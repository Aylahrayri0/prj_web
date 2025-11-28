<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Donation;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Admin Login
     * POST /api/admin/login
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized: Not an admin'], 403);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Admin Logout
     * POST /api/admin/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout successful'], 200);
    }

    /**
     * Get Admin Dashboard Statistics
     * GET /api/admin/statistics
     */
    public function statistics(): JsonResponse
    {
        // Count statistics
        $totalDonations = Donation::count();
        $totalAmount = Donation::where('status', 'completed')->sum('amount');
        $totalUsers = User::where('role', 'user')->count();
        $totalMessages = Testimonial::count();
        $approvedMessages = Testimonial::where('approved', true)->count();
        $pendingMessages = Testimonial::where('approved', false)->count();

        // Latest donations (5)
        $latestDonations = Donation::with(['user', 'category'])
            ->latest()
            ->limit(5)
            ->get();

        // Latest messages (5)
        $latestMessages = Testimonial::latest()
            ->limit(5)
            ->get();

        // Donations by status
        $donationsByStatus = Donation::select('status')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Messages by month (last 6 months)
        $messagesByMonth = Testimonial::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();

        // Donations by month (last 6 months)
        $donationsByMonth = Donation::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month')
            ->selectRaw('SUM(amount) as total_amount')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();

        return response()->json([
            'summary' => [
                'total_donations' => $totalDonations,
                'total_amount' => $totalAmount,
                'total_users' => $totalUsers,
                'total_messages' => $totalMessages,
                'approved_messages' => $approvedMessages,
                'pending_messages' => $pendingMessages,
            ],
            'latest_donations' => $latestDonations,
            'latest_messages' => $latestMessages,
            'donations_by_status' => $donationsByStatus,
            'messages_by_month' => $messagesByMonth,
            'donations_by_month' => $donationsByMonth,
        ], 200);
    }
}
