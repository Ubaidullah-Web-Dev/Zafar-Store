"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Product, OrderItem } from "@/types";
import { createOrder, fetchProducts } from "@/services/api";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

/**
 * Order form — allows customers to select items, enter details, and place an order.
 */
export default function OrderForm() {
  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ name?: string, phone?: string, address?: string }>({});

  // Products list & state
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Cart state
  const [cart, setCart] = useState<OrderItem[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Department and Category filter
  const [activeDepartment, setActiveDepartment] = useState<string>("Bakery");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    fetchProducts()
      .then((res) => {
        setProductsList(res.data);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, []);

  // Get unique categories for current department
  const categories = useMemo(() => {
    const deptProducts = productsList.filter(p => p.department === activeDepartment);
    const cats = Array.from(new Set(deptProducts.map((p) => p.category)));
    return ["All", ...cats];
  }, [activeDepartment, productsList]);

  // Filter products by department and category
  const filteredProducts = useMemo(() => {
    let filtered = productsList.filter(p => p.department === activeDepartment);

    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    return filtered;
  }, [activeDepartment, activeCategory, productsList]);

  // Calculate total
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  /** Add or increment an item in the cart */
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { name: product.name, price: product.price, qty: 1 }];
    });
  };

  /** Remove an item from cart */
  const removeFromCart = (name: string) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  /** Update item quantity */
  const updateQty = (name: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(name);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.name === name ? { ...item, qty } : item))
    );
  };

  /** Submit the order */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string, phone?: string, address?: string } = {};

    if (customerName.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters long.";
    }

    const phoneDigits = phone.replace(/\D/g, '');
    const isValidPhone = /^[\d\s+\-()]+$/.test(phone) && phoneDigits.length >= 10 && phoneDigits.length <= 15;

    if (!isValidPhone) {
      newErrors.phone = "Enter a pure numeric phone number (e.g. 0300-1234567).";
    }

    if (address.trim().length < 5) {
      newErrors.address = "Please provide your full delivery address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ message: "Please correct the highlighted errors.", type: "error" });
      return;
    }

    // Clear errors if all good
    setErrors({});

    if (cart.length === 0) {
      setToast({ message: "Please add at least one item to your order.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        customer_name: customerName,
        phone,
        address,
        items: cart,
        total_price: totalPrice,
      });

      setToast({ message: "Order placed successfully! 🎉", type: "success" });

      // Reset form
      setCustomerName("");
      setPhone("");
      setAddress("");
      setCart([]);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setToast({
        message: error.message || "Failed to place order. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Customer Information ─────────────────────── */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
              1
            </span>
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Muhammad Ali"
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.name
                    ? "border-red-500 focus:ring-red-500/50 focus:border-red-500/50"
                    : "border-white/10 focus:ring-amber-500/50 focus:border-amber-500/50"
                  }`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                }}
                placeholder="e.g. 0300-1234567"
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${errors.phone
                    ? "border-red-500 focus:ring-red-500/50 focus:border-red-500/50"
                    : "border-white/10 focus:ring-amber-500/50 focus:border-amber-500/50"
                  }`}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Delivery Address *
              </label>
              <textarea
                required
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
                }}
                placeholder="Enter your complete delivery address"
                rows={2}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${errors.address
                    ? "border-red-500 focus:ring-red-500/50 focus:border-red-500/50"
                    : "border-white/10 focus:ring-amber-500/50 focus:border-amber-500/50"
                  }`}
              />
              {errors.address && <p className="text-red-400 text-xs mt-1.5">{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* ── Menu / Product Selection ─────────────────── */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
              2
            </span>
            Select Items
          </h2>

          {/* Department Tabs */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-full max-w-sm mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveDepartment("Bakery");
                setActiveCategory("All");
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeDepartment === "Bakery"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              Bakery & Fast Food
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveDepartment("Grocery");
                setActiveCategory("All");
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeDepartment === "Grocery"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              Grocery & Essentials
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${activeCategory === cat
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {productsLoading ? (
            <div className="flex justify-center items-center py-12">
              <span className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const inCart = cart.find((item) => item.name === product.name);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addToCart(product)}
                    className={`group relative p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${inCart
                        ? "bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {product.category}
                        </p>
                      </div>
                      <span className="text-amber-400 font-bold text-sm">
                        Rs. {product.price}
                      </span>
                    </div>
                    {inCart && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold shadow-lg">
                        {inCart.qty}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Cart Summary ────────────────────────────── */}
        {cart.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
                3
              </span>
              Order Summary
              <span className="ml-auto text-sm font-normal text-gray-400">
                {cart.length} item(s)
              </span>
            </h2>

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rs. {item.price} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.name, item.qty - 1)}
                      className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-sm transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="text-white font-medium w-6 text-center text-sm">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.name, item.qty + 1)}
                      className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-sm transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-amber-400 font-bold text-sm w-24 text-right">
                    Rs. {item.price * item.qty}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.name)}
                    className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-gray-400 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Rs. {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* ── Submit Button ───────────────────────────── */}
        <Button
          type="submit"
          size="md"
          loading={loading}
          className="w-full"
          disabled={cart.length === 0}
        >
          {cart.length === 0
            ? "Add items to place an order"
            : `Place Order — Rs. ${totalPrice.toLocaleString()}`}
        </Button>
      </form>
    </>
  );
}
