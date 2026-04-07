<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class OrderController extends Controller
{
    /**
     * Validation rules for order creation/update.
     */
    private function validationRules(bool $isUpdate = false): array
    {
        $requiredOrSometimes = $isUpdate ? 'sometimes|required' : 'required';

        return [
            'customer_name' => "{$requiredOrSometimes}|string|max:255",
            'phone'         => "{$requiredOrSometimes}|string|max:50",
            'address'       => "{$requiredOrSometimes}|string|max:1000",
            'items'         => "{$requiredOrSometimes}|array|min:1",
            'items.*.name'  => 'required|string|max:255',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.qty'   => 'required|integer|min:1',
            'total_price'   => "{$requiredOrSometimes}|numeric|min:0",
        ];
    }

    /**
     * Display a listing of all orders.
     * GET /api/orders
     */
    public function index(): JsonResponse
    {
        $orders = Order::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $orders,
            'message' => 'Orders retrieved successfully.',
        ]);
    }

    /**
     * Store a newly created order.
     * POST /api/orders
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate($this->validationRules());

            $order = Order::create($validated);

            return response()->json([
                'success' => true,
                'data'    => $order,
                'message' => 'Order created successfully.',
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display the specified order.
     * GET /api/orders/{id}
     */
    public function show(string $id): JsonResponse
    {
        try {
            $order = Order::findOrFail($id);

            return response()->json([
                'success' => true,
                'data'    => $order,
                'message' => 'Order retrieved successfully.',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }
    }

    /**
     * Update the specified order.
     * PUT /api/orders/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $order = Order::findOrFail($id);

            $validated = $request->validate($this->validationRules(isUpdate: true));

            $order->update($validated);

            return response()->json([
                'success' => true,
                'data'    => $order->fresh(),
                'message' => 'Order updated successfully.',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    /**
     * Remove the specified order.
     * DELETE /api/orders/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $order = Order::findOrFail($id);
            $order->delete();

            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully.',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }
    }
}
