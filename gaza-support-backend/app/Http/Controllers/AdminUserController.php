<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminUserController extends Controller
{
    /**
     * Get all users
     * GET /api/admin/users
     */
    public function index(): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->paginate(15);

        return response()->json($users, 200);
    }

    /**
     * Get specific user
     * GET /api/admin/users/{id}
     */
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'total_donated' => $user->totalDonated(),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ], 200);
    }

    /**
     * Update user role
     * PUT /api/admin/users/{id}/role
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user,
        ], 200);
    }

    /**
     * Delete user
     * DELETE /api/admin/users/{id}
     */
    public function destroy(User $user): JsonResponse
    {
        // Prevent deleting the last admin
        if ($user->isAdmin() && User::where('role', 'admin')->count() === 1) {
            return response()->json([
                'message' => 'Cannot delete the last admin user',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ], 204);
    }

    /**
     * Search users
     * GET /api/admin/users/search?query=...
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->query('query', '');

        if (strlen($query) < 2) {
            return response()->json([
                'message' => 'Query must be at least 2 characters',
                'results' => [],
            ], 400);
        }

        $users = User::where('name', 'LIKE', "%{$query}%")
            ->orWhere('email', 'LIKE', "%{$query}%")
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->limit(10)
            ->get();

        return response()->json([
            'results' => $users,
        ], 200);
    }
}
