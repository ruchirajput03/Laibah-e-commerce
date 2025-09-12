// pages/checkout.tsx
"use client";
import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from "@/context/cartContext";
import axios from "axios";
// ...rest of imports

export default function CheckoutPage() {
  const { cart, subtotal = 0, tax = 0, total = 0 } = useCart();

  const [contactEmail, setContactEmail] = useState('');
  const [delivery, setDelivery] = useState({
    country: 'UAE',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pin: '',
  });
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    nameOnCard: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order items with variation info
      const orderItems = cart.map(item => ({
        productId: item.id,
        name: item.title,
        variation: {
          size: item.size,
          // color: item.color,
          price: item.price,
          images: [item.image],
        },
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }));

      const orderData = {
        userEmail: contactEmail,
        shipping: {
          fullName: `${delivery.firstName} ${delivery.lastName}`,
          address: `${delivery.address} ${delivery.apartment || ''}`,
          city: delivery.city,
          state: delivery.state,
          zip: delivery.pin,
          country: delivery.country
        },
        payment: {
          method: "Credit Card",
          transactionId: null // can be updated after payment gateway confirmation
        },
        items: orderItems,
        totalAmount: total,
        tax
      };

      const response = await axios.post("http://localhost:8080/api/orders", orderData);

      alert("Order placed successfully!");
      console.log("Order response:", response.data);

      // Optionally clear cart after successful order
      // clearCart();
    } catch (error: any) {
      console.error("Failed to place order", error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:pt-[120px] pt-[40px] lg:px-[40px] px-[20px] lg:mb-[80px] mb-4 gap-10">
      {/* Left: Contact, Delivery, Payment */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact */}
        <section>
            <div className="flex justify-between">
            <h2 className="text-[20px] font-semibold mb-4">Contact</h2>
                <Link href="/login" className='underline'>login</Link>
            </div>
        
          <input
            type="email"
            placeholder="Email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full border rounded px-4 py-2 mb-2"
          />
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" />
            <span>Email me with news and offers</span>
          </label>
        </section>

        {/* Delivery */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Delivery</h2>
          <select
            className="w-full border rounded px-4 py-2 mb-2"
            value={delivery.country}
            onChange={(e) => setDelivery({ ...delivery, country: e.target.value })}
          >
            <option value="UAE">UAE</option>
            <option value="USA">USA</option>
          </select>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="First name (optional)"
              className="w-1/2 border rounded px-4 py-2"
              value={delivery.firstName}
              onChange={(e) => setDelivery({ ...delivery, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-1/2 border rounded px-4 py-2"
              required
              value={delivery.lastName}
              onChange={(e) => setDelivery({ ...delivery, lastName: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="Address"
            className="w-full border rounded px-4 py-2 mb-2"
            required
            value={delivery.address}
            onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            className="w-full border rounded px-4 py-2 mb-2"
            value={delivery.apartment}
            onChange={(e) => setDelivery({ ...delivery, apartment: e.target.value })}
          />
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="City"
              className="w-1/3 border rounded px-4 py-2"
              required
              value={delivery.city}
              onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              className="w-1/3 border rounded px-4 py-2"
              required
              value={delivery.state}
              onChange={(e) => setDelivery({ ...delivery, state: e.target.value })}
            />
            <input
              type="text"
              placeholder="PIN code"
              className="w-1/3 border rounded px-4 py-2"
              required
              value={delivery.pin}
              onChange={(e) => setDelivery({ ...delivery, pin: e.target.value })}
            />
          </div>
          <label className="flex items-center space-x-2 text-sm mb-4">
            <input type="checkbox" />
            <span>Save this information for next time</span>
          </label>

          {/* Shipping method */}
          <div className="border rounded px-4 py-3 bg-gray-100 text-gray-600">
            Enter your shipping address to view available shipping methods.
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Payment</h2>
          <p className="text-sm text-gray-600 mb-2">All transactions are secure and encrypted.</p>
          <div className="border rounded p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Credit card</span>
              <span className="bg-yellow-400 text-black rounded-full px-2 py-1 text-xs">B</span>
            </div>
            <input
              type="text"
              placeholder="Card number"
              className="w-full border rounded px-4 py-2"
              required
              value={payment.cardNumber}
              onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
            />
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Expiration date (MM / YY)"
                className="w-1/2 border rounded px-4 py-2"
                required
                value={payment.expiry}
                onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
              />
              <input
                type="text"
                placeholder="Security code"
                className="w-1/2 border rounded px-4 py-2"
                required
                value={payment.cvc}
                onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Name on card"
              className="w-full border rounded px-4 py-2"
              required
              value={payment.nameOnCard}
              onChange={(e) => setPayment({ ...payment, nameOnCard: e.target.value })}
            />
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" defaultChecked />
              <span>Use shipping address as billing address</span>
            </label>
          </div>
        </section>

        <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded text-center font-semibold"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay now"}
          </button>
      </form>

      {/* Right: Order Summary */}
      <div className="space-y-4">
      {cart.map((item) => {
        const priceAfterDiscount = item.price * (1 - item.discount / 100);

        return (
          <div key={`${item.id}-${item.size}`} className="flex items-center gap-4  pb-4">
            <Image
              src={process.env.API_URL + `${item.image}`}
              alt={item.title}
              width={80}
              height={80}
              className="object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-sm text-gray-500">
                Size: {item.size} &nbsp; | &nbsp; Qty: {item.quantity}
              </p>
              <p className="text-sm font-semibold">
                AED {(priceAfterDiscount * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        );
      })}

      <div className="pt-4 border-t space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>AED {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (5%)</span>
          <span>AED {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>AED {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
    </main>
    <Footer/>
    </>
  );
}
