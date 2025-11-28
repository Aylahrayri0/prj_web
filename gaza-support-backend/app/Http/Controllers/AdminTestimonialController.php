<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminTestimonialController extends Controller
{
    /**
     * Get all testimonials with filtering
     * GET /api/admin/testimonials?approved=false&page=1
     */
    public function index(Request $request): JsonResponse
    {
        $query = Testimonial::query();

        // Filter by approval status
        if ($request->has('approved')) {
            $approved = $request->query('approved') === 'true';
            $query->where('approved', $approved);
        }

        // Filter by rating
        if ($request->has('min_rating')) {
            $query->where('rating', '>=', $request->query('min_rating'));
        }

        // Sort by latest first
        $testimonials = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($testimonials, 200);
    }

    /**
     * Get testimonial details
     * GET /api/admin/testimonials/{id}
     */
    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json($testimonial, 200);
    }

    /**
     * Approve testimonial
     * PUT /api/admin/testimonials/{id}/approve
     */
    public function approve(Testimonial $testimonial): JsonResponse
    {
        $testimonial->update(['approved' => true]);

        return response()->json([
            'message' => 'Testimonial approved successfully',
            'testimonial' => $testimonial,
        ], 200);
    }

    /**
     * Reject testimonial (keep in database but marked as not approved)
     * PUT /api/admin/testimonials/{id}/reject
     */
    public function reject(Testimonial $testimonial): JsonResponse
    {
        $testimonial->update(['approved' => false]);

        return response()->json([
            'message' => 'Testimonial rejected successfully',
            'testimonial' => $testimonial,
        ], 200);
    }

    /**
     * Delete testimonial
     * DELETE /api/admin/testimonials/{id}
     */
    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return response()->json([
            'message' => 'Testimonial deleted successfully',
        ], 204);
    }

    /**
     * Get testimonial statistics
     * GET /api/admin/testimonials/stats/summary
     */
    public function statistics(): JsonResponse
    {
        $totalCount = Testimonial::count();
        $approvedCount = Testimonial::where('approved', true)->count();
        $pendingCount = Testimonial::where('approved', false)->count();
        $averageRating = Testimonial::avg('rating');

        // Rating distribution
        $ratingDistribution = Testimonial::selectRaw('rating')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get();

        // Latest testimonials
        $latest = Testimonial::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'summary' => [
                'total_count' => $totalCount,
                'approved_count' => $approvedCount,
                'pending_count' => $pendingCount,
                'approval_percentage' => $totalCount > 0 ? round(($approvedCount / $totalCount) * 100, 2) : 0,
                'average_rating' => round($averageRating, 2),
            ],
            'rating_distribution' => $ratingDistribution,
            'latest' => $latest,
        ], 200);
    }

    /**
     * Get unapproved testimonials
     * GET /api/admin/testimonials/pending/all
     */
    public function pending(): JsonResponse
    {
        $testimonials = Testimonial::where('approved', false)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'count' => count($testimonials),
            'testimonials' => $testimonials,
        ], 200);
    }
}
