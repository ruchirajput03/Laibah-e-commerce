// pages/order-lookup.tsx
"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  items: OrderItem[];
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
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderLookupPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState<'email' | 'orderNumber'>('email');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const orderParam = searchParams.get('orderNumber');
    
    if (emailParam) {
      setEmail(emailParam);
      setSearchType('email');
      handleSearchByEmail(emailParam);
    } else if (orderParam) {
      setOrderNumber(orderParam);
      setSearchType('orderNumber');
    }
  }, [searchParams]);

  const handleSearchByEmail = async (searchEmail?: string) => {
    const emailToSearch = searchEmail || email;
    if (!emailToSearch.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedOrder(null);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/customer/${emailToSearch}`
      );

      if (response.data.success) {
        setOrders(response.data.data.orders);
        if (response.data.data.orders.length === 0) {
          setError("No orders found for this email address");
        }
      } else {
        setError("No orders found");
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByOrderNumber = async () => {
    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter both order number and email address");
      return;
    }

    setLoading(true);
    setError("");
    setOrders([]);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/number/${orderNumber}?email=${email}`
      );

      if (response.data.success) {
        setSelectedOrder(response.data.data);
      } else {
        setError("Order not found");
      }
    } catch (error: any) {
      console.error('Error fetching order:', error);
      setError(error.response?.data?.message || "Order not found");
      setSelectedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="border rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
          <p className="text-gray-600 text-sm">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 rounded text-sm font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
          <p className="text-lg font-bold mt-1">AED {order.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center bg-gray-50 rounded p-2">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                alt={item.name}
                width={40}
                height={40}
                className="object-cover rounded mr-2"
              />
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex items-center justify-center bg-gray-100 rounded p-2 w-20">
              <span className="text-sm text-gray-600">+{order.items.length - 3} more</span>
            </div>
          )}
        </div>
      </div>

      {/* Tracking Information */}
      {order.trackingNumber && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="text-sm font-medium text-blue-800">Tracking Number:</p>
          <p className="text-blue-700">{order.trackingNumber}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedOrder(order)}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          View Details
        </button>
        {order.orderStatus === 'pending' || order.orderStatus === 'confirmed' ? (
          <button
            onClick={() => handleCancelOrder(order._id)}
            className="border border-red-500 text-red-500 px-4 py-2 rounded text-sm hover:bg-red-50"
          >
            Cancel Order
          </button>
        ) : null}
      </div>
    </div>
  );

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/cancel/${orderId}`,
        { email, reason: 'Canceled by customer' }
      );

      if (response.data.success) {
        // Refresh orders
        handleSearchByEmail();
        alert('Order canceled successfully');
      }
    } catch (error: any) {
      console.error('Error canceling order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto lg:pt-[120px] pt-[40px] lg:px-[40px] px-[20px] lg:mb-[80px] mb-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Lookup</h1>
          <p className="text-gray-600">Track your orders and view order history</p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSearchType('email')}
              className={`px-4 py-2 rounded ${
                searchType === 'email'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border'
              }`}
            >
              Search by Email
            </button>
            <button
              onClick={() => setSearchType('orderNumber')}
              className={`px-4 py-2 rounded ${
                searchType === 'orderNumber'
                  ? 'bg-black text-white'
                  : 'bg-white text-black border'
              }`}
            >
              Search by Order Number
            </button>
          </div>

          {searchType === 'email' ? (
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border rounded px-4 py-2"
              />
              <button
                onClick={() => handleSearchByEmail()}
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Orders'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Order Number (e.g., ORD-1234567890-0001)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="flex-1 border rounded px-4 py-2"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border rounded px-4 py-2"
                />
              </div>
              <button
                onClick={handleSearchByOrderNumber}
                disabled={loading}
                className="w-full bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find Order'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4">Searching for orders...</p>
          </div>
        ) : (
          <>
            {/* Order List */}
            {orders.length > 0 && !selectedOrder && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Orders ({orders.length})</h2>
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}

            {/* Selected Order Details */}
            {selectedOrder && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ← Back to Orders
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Information */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Order Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Number:</span>
                          <span className="font-medium">{selectedOrder.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date Placed:</span>
                          <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(selectedOrder.orderStatus)}`}>
                            {selectedOrder.orderStatus}
                          </span>
                        </div>
                        {selectedOrder.trackingNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tracking:</span>
                            <span className="font-medium">{selectedOrder.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Shipping Address</h3>
                      <div className="text-sm">
                        <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                        <p>{selectedOrder.shippingAddress.line1}</p>
                        {selectedOrder.shippingAddress.line2 && (
                          <p>{selectedOrder.shippingAddress.line2}</p>
                        )}
                        <p>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postal_code}
                        </p>
                        <p>{selectedOrder.shippingAddress.country.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Payment Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="capitalize">{selectedOrder.paymentDetails.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="capitalize">{selectedOrder.paymentDetails.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Paid:</span>
                          <span className="font-medium">AED {selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Items ({selectedOrder.items.length})</h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Size: {item.size} | Qty: {item.quantity}
                              </p>
                              <p className="text-sm font-semibold mt-2">
                                AED {item.subtotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Totals */}
                      <div className="mt-6 pt-4 border-t space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>AED {selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (5%):</span>
                          <span>AED {selectedOrder.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span>AED {selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 space-y-2">
                      {(selectedOrder.orderStatus === 'pending' || selectedOrder.orderStatus === 'confirmed') && (
                        <button
                          onClick={() => handleCancelOrder(selectedOrder._id)}
                          className="w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-50"
                        >
                          Cancel Order
                        </button>
                      )}
                      <Link
                        href="/"
                        className="block w-full bg-black text-white text-center py-2 rounded hover:bg-gray-800"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}