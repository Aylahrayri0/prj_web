<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DonationCategoryController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\ImpactStaticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Users - Public
Route::apiResource('users', \App\Http\Controllers\UserController::class);

// Donation Categories - Public
Route::apiResource('donation-categories', \App\Http\Controllers\DonationCategoryController::class);

// Donations - Public
Route::apiResource('donations', \App\Http\Controllers\DonationController::class);

// Articles - Public
Route::apiResource('articles', \App\Http\Controllers\ArticleController::class);

// Testimonials - Public
Route::apiResource('testimonials', \App\Http\Controllers\TestimonialController::class);

// Impact Statistics - Public
Route::apiResource('impact-statistics', \App\Http\Controllers\ImpactStaticsController::class);

// Admin Authentication - Public
Route::prefix('admin')->group(function () {
    Route::post('/login', [\App\Http\Controllers\AdminController::class, 'login']);
});

// Admin Routes - Protected
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Admin Authorization & Dashboard
    Route::post('/logout', [\App\Http\Controllers\AdminController::class, 'logout']);
    Route::get('/statistics', [\App\Http\Controllers\AdminController::class, 'statistics']);

    // User Management
    Route::get('/users', [\App\Http\Controllers\AdminUserController::class, 'index']);
    Route::get('/users/search', [\App\Http\Controllers\AdminUserController::class, 'search']);
    Route::get('/users/{user}', [\App\Http\Controllers\AdminUserController::class, 'show']);
    Route::put('/users/{user}/role', [\App\Http\Controllers\AdminUserController::class, 'updateRole']);
    Route::delete('/users/{user}', [\App\Http\Controllers\AdminUserController::class, 'destroy']);

    // Donation Management
    Route::get('/donations', [\App\Http\Controllers\AdminDonationController::class, 'index']);
    Route::get('/donations/stats/summary', [\App\Http\Controllers\AdminDonationController::class, 'statistics']);
    Route::get('/donations/export/csv', [\App\Http\Controllers\AdminDonationController::class, 'exportCsv']);
    Route::get('/donations/{donation}', [\App\Http\Controllers\AdminDonationController::class, 'show']);
    Route::put('/donations/{donation}/status', [\App\Http\Controllers\AdminDonationController::class, 'updateStatus']);
    Route::delete('/donations/{donation}', [\App\Http\Controllers\AdminDonationController::class, 'destroy']);

    // Testimonial/Message Management
    Route::get('/testimonials', [\App\Http\Controllers\AdminTestimonialController::class, 'index']);
    Route::get('/testimonials/pending/all', [\App\Http\Controllers\AdminTestimonialController::class, 'pending']);
    Route::get('/testimonials/stats/summary', [\App\Http\Controllers\AdminTestimonialController::class, 'statistics']);
    Route::get('/testimonials/{testimonial}', [\App\Http\Controllers\AdminTestimonialController::class, 'show']);
    Route::put('/testimonials/{testimonial}/approve', [\App\Http\Controllers\AdminTestimonialController::class, 'approve']);
    Route::put('/testimonials/{testimonial}/reject', [\App\Http\Controllers\AdminTestimonialController::class, 'reject']);
    Route::delete('/testimonials/{testimonial}', [\App\Http\Controllers\AdminTestimonialController::class, 'destroy']);
});
