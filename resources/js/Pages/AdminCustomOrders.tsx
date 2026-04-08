import React, { useState } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/components/admin/AdminLayout";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";

interface CustomOrder {
  id: number;
  phone: string;
  description: string;
  created_at: string;
}

interface Props {
  customOrders: CustomOrder[];
}

export default function AdminCustomOrders({ customOrders }: Props) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    setDeleting(true);
    router.delete(`/admin/custom-orders/${deleteId}`, {
      onSuccess: () => {
        setToast({ message: "Custom order deleted.", type: "success" });
        setDeleteId(null);
      },
      onFinish: () => setDeleting(false),
    });
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Custom Orders</h1>
            <p className="text-gray-500 mt-1">Manage quick orders and requests</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-[10px] font-black text-gray-500">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customOrders.length > 0 ? (
                  customOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="text-amber-500 font-bold text-sm">#{order.id}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-white font-medium text-sm">{order.phone}</span>
                      </td>
                      <td className="px-6 py-5 max-w-xs">
                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                          {order.description}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => setDeleteId(order.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-600 font-medium">
                      No custom orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Custom Order"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">Are you sure you want to delete this custom order?</p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
              className="flex-1 shadow-lg shadow-red-500/20"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

AdminCustomOrders.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
