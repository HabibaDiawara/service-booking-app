<?php

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('lists active services for authenticated users', function () {
    Sanctum::actingAs(User::factory()->create());
    Service::factory()->create(['name' => 'Active Service', 'is_active' => true]);
    Service::factory()->inactive()->create(['name' => 'Hidden Service']);

    $response = $this->getJson('/api/services');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'services')
        ->assertJsonPath('services.0.name', 'Active Service');
});

it('creates a booking for the authenticated user', function () {
    $user = User::factory()->create();
    $service = Service::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/bookings', [
        'service_id' => $service->id,
        'scheduled_at' => now()->addDay()->toIso8601String(),
        'notes' => 'Please call before arrival.',
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('booking.service_id', $service->id)
        ->assertJsonPath('booking.status', Booking::STATUS_CONFIRMED)
        ->assertJsonPath('booking.notes', 'Please call before arrival.');

    expect(Booking::query()->where('user_id', $user->id)->count())->toBe(1);
});

it('lists only the authenticated users bookings', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $service = Service::factory()->create();

    Booking::factory()->create([
        'user_id' => $user->id,
        'service_id' => $service->id,
    ]);

    Booking::factory()->create([
        'user_id' => $otherUser->id,
        'service_id' => $service->id,
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/bookings');

    $response
        ->assertOk()
        ->assertJsonCount(1, 'bookings');
});

it('prevents users from updating another users booking', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->patchJson("/api/bookings/{$booking->id}", [
        'status' => Booking::STATUS_CANCELLED,
    ]);

    $response->assertForbidden();
});

it('cancels the users own booking', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);
    Sanctum::actingAs($user);

    $response = $this->patchJson("/api/bookings/{$booking->id}", [
        'status' => Booking::STATUS_CANCELLED,
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('booking.status', Booking::STATUS_CANCELLED);
});

it('updates the authenticated users profile', function () {
    $user = User::factory()->create(['name' => 'Old Name']);
    Sanctum::actingAs($user);

    $response = $this->patchJson('/api/user', [
        'name' => 'New Name',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('user.name', 'New Name');
});
