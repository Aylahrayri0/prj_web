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
        $testimonials = Testimonial::all()->map(function($testimonial) {
            return [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'country' => $testimonial->email,
                'message' => $testimonial->content,
                'rating' => $testimonial->rating,
                'image_url' => $testimonial->image_url,
                'approved' => $testimonial->approved,
                'created_at' => $testimonial->created_at,
            ];
        });
        
        return response()->json(['data' => $testimonials]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'country' => 'required|string',
            'message' => 'required|string',
            'rating' => 'nullable|integer|between:1,5',
            'image_url' => 'nullable|string',
        ]);

        // Map frontend field names to database columns
        $testimonial = Testimonial::create([
            'name' => $validated['name'],
            'email' => $validated['country'] ?? 'anonymous@example.com',
            'content' => $validated['message'],
            'rating' => $validated['rating'] ?? 5,
            'image_url' => $validated['image_url'] ?? null,
            'approved' => false,
        ]);
        
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
