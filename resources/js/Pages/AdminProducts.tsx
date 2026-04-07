"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Product } from "@/types";
import { fetchProducts, deleteProduct, createProduct, updateProduct } from "@/services/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDepartment]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", department: "Grocery", category: "", price: 0 });
  
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenEdit = (prod: Product) => {
    setEditProduct(prod);
    setFormData({ name: prod.name, department: prod.department, category: prod.category, price: prod.price });
    setIsModalOpen(true);
  };

  // Derived state for table
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDepartment === "All" || p.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  // Unique categories for the datalist dropdown
  const uniqueCategories = Array.from(new Set(products.map(p => p.category)));

  // Paginated subset
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenCreate = () => {
    setEditProduct(null);
    setFormData({ name: "", department: "Grocery", category: "", price: 0 });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, formData);
        setToast({ message: "Product updated successfully.", type: "success" });
      } else {
        await createProduct(formData);
        setToast({ message: "Product created successfully.", type: "success" });
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err: unknown) {
      setToast({ message: "Failed to save product.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setToast({ message: "Product deleted successfully.", type: "success" });
      setDeleteTarget(null);
      loadProducts();
    } catch (err: unknown) {
      setToast({ message: "Failed to delete product.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto py-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Products</h1>
            <p className="text-gray-500 mt-1">Add, edit, or remove catalog items</p>
          </div>
          <Button onClick={handleOpenCreate} variant="primary">
            + Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <select 
            value={filterDepartment} 
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 [&>option]:bg-[#0d0d12]"
          >
            <option value="All">All Departments</option>
            <option value="Grocery">Grocery</option>
            <option value="Bakery">Bakery</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <Spinner text="Loading products..." />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-3">{error}</p>
              <Button onClick={loadProducts} variant="secondary" size="sm">Retry</Button>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[500px]">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 whitespace-nowrap">
                  {paginatedProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-gray-400">#{p.id}</td>
                      <td className="px-6 py-4 text-white font-medium">{p.name}</td>
                      <td className="px-6 py-4 text-amber-400">{p.department}</td>
                      <td className="px-6 py-4 text-gray-400">{p.category}</td>
                      <td className="px-6 py-4 text-white font-bold text-right">Rs. {p.price}</td>
                      <td className="px-6 py-4 flex gap-2 justify-center">
                        <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(p)}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(p)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination 
                totalItems={filteredProducts.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ───────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editProduct ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
            <select required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 [&>option]:bg-[#0d0d12]">
              <option value="Grocery">Grocery</option>
              <option value="Bakery">Bakery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <input 
              required 
              list="category-suggestions"
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              placeholder="E.g. Dairy & Beverages" 
              autoComplete="off"
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" 
            />
            <datalist id="category-suggestions">
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Price (Rs.)</label>
            <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editProduct ? "Update Product" : "Save Product"}</Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Modal ───────────────────── */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product" size="sm">
        <div className="space-y-4">
          <p className="text-gray-300">Are you sure you want to delete <span className="text-white font-bold">{deleteTarget?.name}</span>?</p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

AdminProducts.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
