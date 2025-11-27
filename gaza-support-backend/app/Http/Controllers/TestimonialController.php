<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Testimonial::where('approved', true)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'content' => 'required|string',
            'rating' => 'required|integer|between:1,5',
            'image_url' => 'nullable|string',
        ]);

        $testimonial = Testimonial::create($validated);
        return response()->json($testimonial, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json($testimonial);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'content' => 'required|string',
            'rating' => 'required|integer|between:1,5',
            'image_url' => 'nullable|string',
            'approved' => 'required|boolean',
        ]);

        $testimonial->update($validated);
        return response()->json($testimonial);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();
        return response()->json(null, 204);
    }
}
