<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DonationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Donation::with(['category', 'user'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:donation_categories,id',
            'amount' => 'required|numeric|min:0.01',
            'donor_name' => 'required|string',
            'donor_email' => 'required|email',
            'message' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // Set default status to 'pending' if not provided
        $validated['status'] = $validated['status'] ?? 'pending';

        $donation = Donation::create($validated);
        return response()->json($donation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Donation $donation): JsonResponse
    {
        return response()->json($donation->load(['category', 'user']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Donation $donation): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:donation_categories,id',
            'amount' => 'required|numeric|min:0.01',
            'donor_name' => 'required|string',
            'donor_email' => 'required|email',
            'message' => 'nullable|string',
            'status' => 'required|in:pending,completed,failed',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $donation->update($validated);
        return response()->json($donation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Donation $donation): JsonResponse
    {
        $donation->delete();
        return response()->json(null, 204);
    }
}
