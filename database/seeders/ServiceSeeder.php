<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Home Cleaning',
                'description' => 'Full home deep cleaning including kitchen, bathrooms, and living areas.',
                'duration_minutes' => 120,
                'price' => 149.00,
            ],
            [
                'name' => 'AC Maintenance',
                'description' => 'Filter replacement, coil cleaning, and performance inspection.',
                'duration_minutes' => 60,
                'price' => 89.00,
            ],
            [
                'name' => 'Plumbing Repair',
                'description' => 'Fix leaks, clogs, and minor pipe issues by a licensed plumber.',
                'duration_minutes' => 90,
                'price' => 120.00,
            ],
            [
                'name' => 'Electrical Checkup',
                'description' => 'Safety inspection of outlets, breakers, and wiring.',
                'duration_minutes' => 60,
                'price' => 95.00,
            ],
            [
                'name' => 'Garden Care',
                'description' => 'Lawn mowing, hedge trimming, and basic garden maintenance.',
                'duration_minutes' => 90,
                'price' => 75.00,
            ],
            [
                'name' => 'Appliance Installation',
                'description' => 'Professional setup for washers, dryers, and kitchen appliances.',
                'duration_minutes' => 75,
                'price' => 110.00,
            ],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(
                ['name' => $service['name']],
                [...$service, 'is_active' => true],
            );
        }
    }
}
