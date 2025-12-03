<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of contact messages
     */
    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->get();
        return response()->json($messages);
    }

    /**
     * Store a new contact message
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'country' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $contactMessage = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'country' => $request->country,
            'message' => $request->message,
            'status' => 'pending',
            'is_pinned' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $contactMessage
        ], 201);
    }

    /**
     * Display a specific contact message
     */
    public function show($id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found'
            ], 404);
        }

        return response()->json($message);
    }

    /**
     * Update a contact message
     */
    public function update(Request $request, $id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:pending,approved,rejected',
            'is_pinned' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $message->update($request->only(['status', 'is_pinned']));

        return response()->json([
            'success' => true,
            'message' => 'Message updated successfully',
            'data' => $message
        ]);
    }

    /**
     * Approve a message
     */
    public function approve($id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found'
            ], 404);
        }

        $message->update(['status' => 'approved']);

        return response()->json([
            'success' => true,
            'message' => 'Message approved successfully',
            'data' => $message
        ]);
    }

    /**
     * Reject a message
     */
    public function reject($id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found'
            ], 404);
        }

        $message->update(['status' => 'rejected']);

        return response()->json([
            'success' => true,
            'message' => 'Message rejected successfully',
            'data' => $message
        ]);
    }

    /**
     * Delete a message
     */
    public function destroy($id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found'
            ], 404);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully'
        ]);
    }
}
