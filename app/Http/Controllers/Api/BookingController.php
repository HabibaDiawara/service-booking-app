<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $bookings = $request->user()
            ->bookings()
            ->with('service')
            ->orderByDesc('scheduled_at')
            ->get()
            ->map(fn (Booking $booking) => $this->formatBooking($booking));

        return response()->json([
            'bookings' => $bookings,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'integer', Rule::exists('services', 'id')->where('is_active', true)],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $booking = $request->user()->bookings()->create([
            'service_id' => $validated['service_id'],
            'scheduled_at' => $validated['scheduled_at'],
            'notes' => $validated['notes'] ?? null,
            'status' => Booking::STATUS_CONFIRMED,
        ]);

        $booking->load('service');

        return response()->json([
            'booking' => $this->formatBooking($booking),
            'message' => 'Booking created successfully.',
        ], 201);
    }

    public function update(Request $request, Booking $booking): JsonResponse
    {
        $this->authorizeBooking($request, $booking);

        if ($booking->isCancelled()) {
            throw ValidationException::withMessages([
                'status' => ['This booking has already been cancelled.'],
            ]);
        }

        $validated = $request->validate([
            'scheduled_at' => ['sometimes', 'date', 'after:now'],
            'status' => ['sometimes', Rule::in([Booking::STATUS_CANCELLED])],
        ]);

        if (isset($validated['scheduled_at'])) {
            $booking->scheduled_at = $validated['scheduled_at'];
        }

        if (($validated['status'] ?? null) === Booking::STATUS_CANCELLED) {
            $booking->status = Booking::STATUS_CANCELLED;
        }

        $booking->save();
        $booking->load('service');

        return response()->json([
            'booking' => $this->formatBooking($booking),
            'message' => 'Booking updated successfully.',
        ]);
    }

    private function authorizeBooking(Request $request, Booking $booking): void
    {
        if ($booking->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to manage this booking.');
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function formatBooking(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'service_id' => $booking->service_id,
            'scheduled_at' => $booking->scheduled_at->toIso8601String(),
            'status' => $booking->status,
            'notes' => $booking->notes,
            'service' => $booking->relationLoaded('service') && $booking->service
                ? [
                    'id' => $booking->service->id,
                    'name' => $booking->service->name,
                    'duration_minutes' => $booking->service->duration_minutes,
                    'price' => (float) $booking->service->price,
                ]
                : null,
        ];
    }
}
