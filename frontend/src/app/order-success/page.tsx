// pages/order-success.tsx
"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import axios from 'axios';

interface OrderDetails {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
    subtotal: number;
  }>;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  paymentDetails: {
    paymentIntentId: string;
    method: string;
    status: string;
    amount: number;
    currency: string;
    paidAt?: string;
  };
  subtotal: number;
  tax: number;
  total: number;
  orderStatus: string;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const paymentIntentId = searchParams.get('paymentIntentId');

    if (!orderId || !paymentIntentId) {
      setError("Invalid order information");
      setLoading(false);
      return;
    }

    fetchOrderDetails(orderId, paymentIntentId);
  }, [searchParams]);

  const fetchOrderDetails = async (orderId: string, paymentIntentId: string) => {
    try {
      // You might want to store customer email in localStorage during checkout
      const customerEmail = localStorage.getItem('checkoutEmail');
      
      if (!customerEmail) {
        setError("Customer email not found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/lookup/${orderId}?email=${customerEmail}`
      );

      if (response.data.success) {
        setOrderDetails(response.data.data);
      } else {
        setError("Order not found");
      }
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      setError(error.response?.data?.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-lg">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !orderDetails) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error || "Order not found"}</p>
            <Link
              href="/"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Return to Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto lg:pt-[120px] pt-[40px] lg:px-[40px] px-[20px] lg:mb-[80px] mb-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Order Details</h2>
              <p className="text-gray-600">Order #{orderDetails.orderNumber}</p>
              <p className="text-sm text-gray-500">
                Placed on {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Status</p>
              <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded capitalize">
                {orderDetails.orderStatus}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">AED {item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>AED {orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>AED {orderDetails.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>AED {orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">Shipping Address</h3>
          <div className="text-gray-700">
            <p className="font-medium">{orderDetails.shippingAddress.name}</p>
            <p>{orderDetails.shippingAddress.line1}</p>
            {orderDetails.shippingAddress.line2 && (
              <p>{orderDetails.shippingAddress.line2}</p>
            )}
            <p>
              {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postal_code}
            </p>
            <p>{orderDetails.shippingAddress.country.toUpperCase()}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">Payment Information</h3>
          <div className="text-gray-700">
            <p>Payment Method: {orderDetails.paymentDetails.method}</p>
            <p>Payment Status: <span className="capitalize">{orderDetails.paymentDetails.status}</span></p>
            <p>Transaction ID: {orderDetails.paymentDetails.paymentIntentId}</p>
            {orderDetails.paymentDetails.paidAt && (
              <p>Paid At: {new Date(orderDetails.paymentDetails.paidAt).toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/order-lookup?email=${orderDetails.customerEmail}`}
            className="bg-black text-white px-6 py-3 rounded text-center hover:bg-gray-800"
          >
            View All Orders
          </Link>
          <Link
            href="/"
            className="border border-black text-black px-6 py-3 rounded text-center hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>

        {/* What's Next */}
        <div className="mt-8 text-center text-gray-600">
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <ul className="text-sm space-y-1">
            <li>• You'll receive an order confirmation email shortly</li>
            <li>• We'll send you tracking information once your order ships</li>
            <li>• Your order will be delivered to the address above</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}