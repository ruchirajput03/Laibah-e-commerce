"use client";
import { useState } from "react";
import axios from "axios";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

export default function OrderLookup() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const { data } = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        }/api/orders/order-lookup`,
        { params: { orderId, email } }
      );
      setOrder(data.order);
    } catch (err: any) {
      setError(err.response?.data?.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-6">Order Lookup</h1>
        <form onSubmit={handleLookup} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Order ID"
            className="w-full border px-4 py-2 rounded"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Searching..." : "Lookup Order"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {order && (
          <div className="mt-6 border rounded p-4 bg-gray-50">
            <h2 className="text-lg font-semibold">Order #{order.orderId}</h2>
            <p>
              Status: <strong>{order.status}</strong>
            </p>
            <p>Total: AED {order.totalAmount}</p>
            <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>

            <div className="mt-4 space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <Image
                    src={
                      item?.images?.[0]
                        ?`${process.env.API_URL}${item.images[0]}`
                        : "/placeholder.png" // fallback image
                    }
                    alt={item?.name || "Product"}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.variation.size} | Qty: {item.quantity}
                    </p>
                    <p className="font-semibold">
                      AED {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
