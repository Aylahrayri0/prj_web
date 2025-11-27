<?php

namespace App\Http\Controllers;

use App\Models\ImpactStatics;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ImpactStaticsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(ImpactStatics::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'metric_name' => 'required|string',
            'value' => 'required|integer',
            'description' => 'nullable|string',
        ]);

        $impact = ImpactStatics::create($validated);
        return response()->json($impact, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ImpactStatics $impactStatics): JsonResponse
    {
        return response()->json($impactStatics);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ImpactStatics $impactStatics): JsonResponse
    {
        $validated = $request->validate([
            'metric_name' => 'required|string',
            'value' => 'required|integer',
            'description' => 'nullable|string',
        ]);

        $impactStatics->update($validated);
        return response()->json($impactStatics);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ImpactStatics $impactStatics): JsonResponse
    {
        $impactStatics->delete();
        return response()->json(null, 204);
    }
}
