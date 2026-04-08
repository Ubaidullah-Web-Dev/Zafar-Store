<?php

namespace App\Http\Controllers;

use App\Models\CustomOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomOrderController extends Controller
{
    /**
     * Display a listing of custom orders (Admin).
     */
    public function index(Request $request)
    {
        $query = CustomOrder::query();

        // Search by phone or description
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('phone', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        return Inertia::render('AdminCustomOrders', [
            'customOrders' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Store a newly created custom order (Frontend).
     */
    public function store(Request $request)
    {
        // No validation as requested
        CustomOrder::create([
            'phone' => (string) $request->phone,
            'description' => (string) $request->description,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Order submitted successfully!');
    }

    /**
     * Update the status of the specified custom order.
     */
    public function updateStatus(Request $request, $id)
    {
        $order = CustomOrder::findOrFail($id);
        $order->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Status updated successfully.');
    }

    /**
     * Remove the specified custom order from storage (Admin).
     */
    public function destroy($id)
    {
        CustomOrder::findOrFail($id)->delete();
        return back();
    }
}
