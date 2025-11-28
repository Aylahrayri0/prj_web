<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminDonationController extends Controller
{
    /**
     * Get all donations with filtering
     * GET /api/admin/donations?status=pending&category_id=1&page=1
     */
    public function index(Request $request): JsonResponse
    {
        $query = Donation::with(['user', 'category']);

        // Filter by status
        if ($request->has('status')) {
            $status = $request->query('status');
            if ($status === 'completed') {
                $query->completed();
            } elseif ($status === 'pending') {
                $query->pending();
            }
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->query('start_date'));
        }
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->query('end_date'));
        }

        $donations = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($donations, 200);
    }

    /**
     * Get donation details
     * GET /api/admin/donations/{id}
     */
    public function show(Donation $donation): JsonResponse
    {
        return response()->json([
            'id' => $donation->id,
            'donor_name' => $donation->donor_name,
            'donor_email' => $donation->donor_email,
            'amount' => $donation->amount,
            'currency' => $donation->currency,
            'status' => $donation->status,
            'message' => $donation->message,
            'category' => $donation->category,
            'user' => $donation->user,
            'created_at' => $donation->created_at,
            'updated_at' => $donation->updated_at,
        ], 200);
    }

    /**
     * Update donation status
     * PUT /api/admin/donations/{id}/status
     */
    public function updateStatus(Request $request, Donation $donation): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,failed',
        ]);

        $donation->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Donation status updated successfully',
            'donation' => $donation->load(['user', 'category']),
        ], 200);
    }

    /**
     * Delete donation
     * DELETE /api/admin/donations/{id}
     */
    public function destroy(Donation $donation): JsonResponse
    {
        $donation->delete();

        return response()->json([
            'message' => 'Donation deleted successfully',
        ], 204);
    }

    /**
     * Get donation statistics
     * GET /api/admin/donations/stats/summary
     */
    public function statistics(): JsonResponse
    {
        $totalDonations = Donation::sum('amount');
        $totalCount = Donation::count();
        $pendingAmount = Donation::pending()->sum('amount');
        $completedAmount = Donation::completed()->sum('amount');
        $completedCount = Donation::completed()->count();
        $averageDonation = $totalCount > 0 ? $totalDonations / $totalCount : 0;

        // Donations by category
        $byCategory = Donation::select('category_id')
            ->selectRaw('SUM(amount) as total_amount')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('category_id')
            ->with('category')
            ->get();

        // Donations by status
        $byStatus = Donation::selectRaw('status')
            ->selectRaw('COUNT(*) as count')
            ->selectRaw('SUM(amount) as total_amount')
            ->groupBy('status')
            ->get();

        return response()->json([
            'summary' => [
                'total_amount' => $totalDonations,
                'total_count' => $totalCount,
                'completed_amount' => $completedAmount,
                'completed_count' => $completedCount,
                'pending_amount' => $pendingAmount,
                'average_donation' => round($averageDonation, 2),
            ],
            'by_category' => $byCategory,
            'by_status' => $byStatus,
        ], 200);
    }

    /**
     * Export donations to CSV
     * GET /api/admin/donations/export/csv
     */
    public function exportCsv(Request $request): JsonResponse
    {
        $donations = Donation::with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->get();

        $csvData = "ID,Donor Name,Donor Email,Amount,Currency,Status,Category,User,Created At\n";

        foreach ($donations as $donation) {
            $csvData .= sprintf(
                '"%s","%s","%s","%s","%s","%s","%s","%s","%s"' . "\n",
                $donation->id,
                $donation->donor_name,
                $donation->donor_email,
                $donation->amount,
                $donation->currency,
                $donation->status,
                $donation->category->name ?? 'N/A',
                $donation->user->name ?? 'Anonymous',
                $donation->created_at
            );
        }

        return response()->json([
            'csv' => $csvData,
            'filename' => 'donations_' . date('Y-m-d_H-i-s') . '.csv',
        ], 200);
    }
}
