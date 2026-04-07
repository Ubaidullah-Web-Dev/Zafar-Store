"use client";

import React, { useState, useEffect } from "react";
import { Order, OrderItem } from "@/types";
import { updateOrder } from "@/services/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import products from "@/data/data.json";
import { Product } from "@/types";

interface EditOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  showToast: (message: string, type: "success" | "error") => void;
}

/**
 * Modal for editing an existing order.
 */
export default function EditOrderModal({
  order,
  isOpen,
  onClose,
  onUpdated,
  showToast,
}: EditOrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Populate form when order changes
  useEffect(() => {
    if (order) {
      setCustomerName(order.customer_name);
      setPhone(order.phone);
      setAddress(order.address);
      setItems(
        Array.isArray(order.items)
          ? order.items.map((i) => ({ ...i }))
          : []
      );
    }
  }, [order]);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  /** Add a product to the items list */
  const addItem = (product: Product) => {
    const existing = items.find((i) => i.name === product.name);
    if (existing) {
      setItems(
        items.map((i) =>
          i.name === product.name ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setItems([...items, { name: product.name, price: product.price, qty: 1 }]);
    }
  };

  /** Remove item */
  const removeItem = (name: string) => {
    setItems(items.filter((i) => i.name !== name));
  };

  /** Update quantity */
  const updateItemQty = (name: string, qty: number) => {
    if (qty <= 0) {
      removeItem(name);
      return;
    }
    setItems(items.map((i) => (i.name === name ? { ...i, qty } : i)));
  };

  /** Submit update */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (items.length === 0) {
      showToast("Order must have at least one item.", "error");
      return;
    }

    setLoading(true);
    try {
      await updateOrder(order.id, {
        customer_name: customerName,
        phone,
        address,
        items,
        total_price: totalPrice,
      });
      showToast("Order updated successfully! ✅", "success");
      onUpdated();
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      showToast(error.message || "Failed to update order.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Order" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Address
          </label>
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none"
          />
        </div>

        {/* Current Items */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Order Items
          </label>
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No items added.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                >
                  <span className="flex-1 text-white text-sm">{item.name}</span>
                  <span className="text-gray-400 text-xs">
                    Rs. {item.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateItemQty(item.name, item.qty - 1)}
                      className="w-6 h-6 rounded bg-white/10 text-white text-xs hover:bg-white/20 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="text-white text-sm w-5 text-center">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateItemQty(item.name, item.qty + 1)}
                      className="w-6 h-6 rounded bg-white/10 text-white text-xs hover:bg-white/20 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-amber-400 text-sm font-medium w-20 text-right">
                    Rs. {item.price * item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.name)}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Item */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Add Item
          </label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {(products as Product[]).map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addItem(product)}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30 transition-all cursor-pointer"
              >
                {product.name} — Rs. {product.price}
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-gray-400">Total</span>
          <span className="text-xl font-bold text-amber-400">
            Rs. {totalPrice.toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Update Order
          </Button>
        </div>
      </form>
    </Modal>
  );
}
