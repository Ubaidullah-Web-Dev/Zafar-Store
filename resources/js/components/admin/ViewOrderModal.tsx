"use client";

import React from "react";
import { Order } from "@/types";
import Modal from "@/components/ui/Modal";

interface ViewOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal to view full order details.
 */
export default function ViewOrderModal({
  order,
  isOpen,
  onClose,
}: ViewOrderModalProps) {
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.id}`} size="md">
      <div className="space-y-5">
        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Customer
            </p>
            <p className="text-white font-medium">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Phone
            </p>
            <p className="text-white font-medium">{order.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Address
            </p>
            <p className="text-white font-medium">{order.address}</p>
          </div>
        </div>

        {/* Items */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Items
          </p>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5"
              >
                <div>
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-gray-500 text-xs">
                    Rs. {item.price} × {item.qty}
                  </p>
                </div>
                <p className="text-amber-400 font-bold text-sm">
                  Rs. {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total & Date */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Order Date
            </p>
            <p className="text-gray-300 text-sm">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Total
            </p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Rs. {Number(order.total_price).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
