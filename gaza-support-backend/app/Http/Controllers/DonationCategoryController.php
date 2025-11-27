<?php

namespace App\Http\Controllers;

use App\Models\DonationCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DonationCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(DonationCategory::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:donation_categories',
            'description' => 'nullable|string',
        ]);

        $category = DonationCategory::create($validated);
        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(DonationCategory $donationCategory): JsonResponse
    {
        return response()->json($donationCategory);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DonationCategory $donationCategory): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:donation_categories,name,' . $donationCategory->id,
            'description' => 'nullable|string',
        ]);

        $donationCategory->update($validated);
        return response()->json($donationCategory);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DonationCategory $donationCategory): JsonResponse
    {
        $donationCategory->delete();
        return response()->json(null, 204);
    }
}
