<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('logs in with valid credentials and returns token and user', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $response
        ->assertOk()
        ->assertJsonStructure([
            'token',
            'user' => ['id', 'name', 'email'],
        ])
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonPath('user.email', 'test@example.com');
});

it('returns validation errors for invalid credentials', function () {
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrong-password',
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonStructure([
            'message',
            'errors' => ['email'],
        ]);
});

it('logs out an authenticated user', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/logout');

    $response
        ->assertOk()
        ->assertJson([
            'message' => 'Logged out successfully.',
        ]);
});

it('rejects logout without a token', function () {
    $response = $this->postJson('/api/logout');

    $response->assertUnauthorized();
});

it('includes cors headers for api preflight requests', function () {
    $response = $this->options('/api/login', [], [
        'Origin' => 'http://localhost:8081',
        'Access-Control-Request-Method' => 'POST',
        'Access-Control-Request-Headers' => 'authorization,content-type',
    ]);

    $response->assertNoContent();
    $response->assertHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
});
