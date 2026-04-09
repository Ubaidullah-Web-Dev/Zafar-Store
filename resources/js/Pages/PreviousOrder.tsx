import { Head } from "@inertiajs/react";
import OrderForm from "@/components/OrderForm";

/**
 * Main Page (/) — Order placement page.
 */
export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Head>
        <title>Order Online - Zafar Store</title>
        <meta name="description" content="Order your favorite items from Zafar Store. Fast and reliable delivery to your doorstep." />
      </Head>

      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-400 text-xs font-medium uppercase tracking-wider">
            Now Taking Orders
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
          Zafar{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Store
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Experience the best shopping experience. Order your essentials and more. 
          Fast delivery right to your doorstep.
        </p>
      </div>

      {/* Order Form */}
      <OrderForm />
    </div>
  );
}
