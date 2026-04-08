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
    public function index()
    {
        return Inertia::render('AdminCustomOrders', [
            'customOrders' => CustomOrder::latest()->get()
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
        ]);

        return back()->with('success', 'Order submitted successfully!');
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
