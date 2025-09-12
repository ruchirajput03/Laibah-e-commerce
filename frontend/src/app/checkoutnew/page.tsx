"use client";
import { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import PaymentHistory from '@/components/PaymentHistory';
import type { PaymentIntent } from '@stripe/stripe-js';

export default function CheckoutPage() {
  const [amount] = useState<number>(29.99);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handlePaymentSuccess = (paymentIntent: PaymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    setPaymentSuccess(true);

    // You can redirect or show success message
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 3000);
  };

  const handlePaymentError = (error: Error | unknown) => {
    console.error('Payment failed:', error);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
          <p className="text-green-600">Thank you for your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            {showHistory ? 'Show Payment Form' : 'Show Payment History'}
          </button>
        </div>

        {showHistory ? (
          <PaymentHistory />
        ) : (
          <PaymentForm
            amount={amount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
      </div>
    </div>
  );
}
