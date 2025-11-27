<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to Gaza Support Backend API',
        'version' => '1.0.0',
        'status' => 'Running ✅',
        'api_endpoints' => [
            'donation_categories' => '/api/donation-categories',
            'donations' => '/api/donations',
            'articles' => '/api/articles',
            'testimonials' => '/api/testimonials',
            'impact_statistics' => '/api/impact-statistics',
            'test' => '/api/test'
        ],
        'documentation' => 'See BACKEND_DOCUMENTATION.md for full API reference'
    ]);
});
