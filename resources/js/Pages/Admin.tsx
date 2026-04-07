"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Order } from "@/types";
import { fetchOrders, deleteOrder } from "@/services/api";
import OrderTable from "@/components/admin/OrderTable";
import EditOrderModal from "@/components/admin/EditOrderModal";
import ViewOrderModal from "@/components/admin/ViewOrderModal";
import AdminLayout from "@/components/admin/AdminLayout";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 10;

/**
 * Admin Panel (/admin) — Dashboard to manage all orders.
 */
export default function AdminPage() {
  // Data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  /** Load orders from API */
  const loadOrders = useCallback(async () => {
    try {
      setError(null);
      const res = await fetchOrders();
      setOrders(res.data);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /** Handle delete with confirmation */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteOrder(deleteTarget.id);
      setToast({ message: "Order deleted successfully.", type: "success" });
      setDeleteTarget(null);
      loadOrders();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setToast({
        message: error.message || "Failed to delete order.",
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  /** Show toast helper */
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  // Stats & Pagination
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_price),
    0
  );

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage and track all customer orders
            </p>
          </div>
          <Button onClick={loadOrders} variant="secondary" size="sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-white mt-1">
              {orders.length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mt-1">
              Rs. {totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
            <p className="text-gray-500 text-sm">Average Order</p>
            <p className="text-3xl font-bold text-white mt-1">
              Rs.{" "}
              {orders.length > 0
                ? Math.round(totalRevenue / orders.length).toLocaleString()
                : "0"}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">All Orders</h2>
          </div>

          {loading ? (
            <Spinner text="Loading orders..." />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-3">{error}</p>
              <Button onClick={loadOrders} variant="secondary" size="sm">
                Retry
              </Button>
            </div>
          ) : (
            <>
              <OrderTable
                orders={paginatedOrders}
                onView={(order) => setViewOrder(order)}
                onEdit={(order) => setEditOrder(order)}
                onDelete={(order) => setDeleteTarget(order)}
              />
              <Pagination
                totalItems={orders.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      {/* ── Edit Modal ──────────────────────────────────── */}
      <EditOrderModal
        order={editOrder}
        isOpen={!!editOrder}
        onClose={() => setEditOrder(null)}
        onUpdated={loadOrders}
        showToast={showToast}
      />

      {/* ── View Modal ──────────────────────────────────── */}
      <ViewOrderModal
        order={viewOrder}
        isOpen={!!viewOrder}
        onClose={() => setViewOrder(null)}
      />

      {/* ── Delete Confirmation Modal ───────────────────── */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Order"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete order{" "}
            <span className="text-amber-400 font-bold">
              #{deleteTarget?.id}
            </span>{" "}
            from{" "}
            <span className="text-white font-medium">
              {deleteTarget?.customer_name}
            </span>
            ?
          </p>
          <p className="text-gray-500 text-sm">
            This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
              className="flex-1"
            >
              Delete Order
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
AdminPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
