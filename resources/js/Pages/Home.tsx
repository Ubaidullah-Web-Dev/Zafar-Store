import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

export default function Home() {
  const { data, setData, post, processing, reset, recentlySuccessful } = useForm({
    phone: "",
    description: "",
  });

  const [toast, setToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/custom-orders", {
      onSuccess: () => {
        reset();
        setToast(true);
      },
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toast
          message="Order submitted successfully! 🚀"
          type="success"
          onClose={() => setToast(false)}
        />
      )}

      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl pt-10 sm:text-6xl font-black text-white mb-6 tracking-tight">
            Zafar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Store
            </span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl font-medium">
            Quick order placement. Just enter your details below.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 space-y-6"
        >
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-widest">
              Phone Number
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 11) setData("phone", value);
              }}
              placeholder="e.g. 03001234567"
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-widest">
              Order Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Tell us what you need..."
              rows={5}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-lg resize-none"
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/20"
            loading={processing}
          >
            Place Quick Order
          </Button>
        </form>

        {/* Navigation to old menu */}
        <div className="mt-12 text-center text-sm">
          <Link
            href="/previous-order"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-400 font-bold transition-all group"
          >
            Looking for our full menu?
            <span className="border-b border-gray-500 group-hover:border-amber-400 transition-all">
              View All Items
            </span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
