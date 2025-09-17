// pages/checkout.tsx
"use client";
import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from "@/context/cartContext";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
  hidePostalCode: true,
};

function CheckoutForm() {
  const { cart, subtotal = 0, tax = 0, total = 0, clearCart } = useCart();
  const router = useRouter();
  
  const [contactEmail, setContactEmail] = useState("");
  const [delivery, setDelivery] = useState({
    country: "UAE",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pin: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // 1. Create PaymentIntent on backend
      const paymentRes = await axios.post(
        `${process.env.API_URL}/api/payments/create-intent`,
        {
          amount: Math.round(total * 100), // Convert to cents/fils
          currency: "aed",
          customerEmail: contactEmail,
          shippingDetails: {
            name: `${delivery.firstName} ${delivery.lastName}`,
            address: {
              line1: delivery.address,
              line2: delivery.apartment,
              city: delivery.city,
              state: delivery.state,
              postal_code: delivery.pin,
              country: delivery.country.toLowerCase(),
            },
          },
          orderItems: cart.map((item) => ({
            productId: item.id,
            name: item.title,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
        }
      );

      const { clientSecret, orderId } = paymentRes.data;

      // 2. Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${delivery.firstName} ${delivery.lastName}`,
              email: contactEmail,
              address: {
                line1: delivery.address,
                line2: delivery.apartment,
                city: delivery.city,
                state: delivery.state,
                postal_code: delivery.pin,
                country: delivery.country.toLowerCase(),
              },
            },
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Clear cart after successful payment
        clearCart();
        
        // Redirect to success page with order ID
        router.push(`/order-success?orderId=${orderId}&paymentIntentId=${paymentIntent.id}`);
      }

    } catch (error: any) {
      console.error("Payment error:", error);
      setError(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:pt-[120px] pt-[40px] lg:px-[40px] px-[20px] lg:mb-[80px] mb-4 gap-10">
        {/* Left: Contact, Delivery, Payment */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact */}
          <section>
            <div className="flex justify-between">
              <h2 className="text-[20px] font-semibold mb-4">Contact</h2>
              <Link href="/login" className="underline">login</Link>
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
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Payment</h2>
            <p className="text-sm text-gray-600 mb-2">All transactions are secure and encrypted.</p>
            
            <div className="border rounded p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Credit card</span>
                <div className="flex space-x-1">
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded">VISA</span>
                  <span className="text-xs bg-red-100 px-2 py-1 rounded">MC</span>
                </div>
              </div>
              
              <div className="border rounded px-4 py-3">
                <CardElement options={cardElementOptions} />
              </div>
              
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" defaultChecked />
                <span>Use shipping address as billing address</span>
              </label>
            </div>

            {error && (
              <div className="text-red-600 text-sm mt-2 p-2 border border-red-300 rounded">
                {error}
              </div>
            )}
          </section>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded text-center font-semibold disabled:opacity-50"
            disabled={loading || !stripe}
          >
            {loading ? "Processing..." : `Pay AED ${total.toFixed(2)}`}
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          {cart.map((item) => {
            const priceAfterDiscount = item.price * (1 - (item.discount || 0) / 100);

            return (
              <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 pb-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
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
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}