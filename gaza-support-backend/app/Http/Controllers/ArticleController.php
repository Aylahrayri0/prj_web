<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(Article::with('user')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'content' => 'required|string',
            'image_url' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        $article = Article::create($validated);
        return response()->json($article, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article): JsonResponse
    {
        return response()->json($article->load('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'image_url' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        $article->update($validated);
        return response()->json($article);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article): JsonResponse
    {
        $article->delete();
        return response()->json(null, 204);
    }
}
