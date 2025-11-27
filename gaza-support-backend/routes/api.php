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
