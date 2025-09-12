"use client";
import React, { useEffect, useState } from 'react';
import { PaymentStorage } from '../utils/storage';
import type { PaymentIntent } from '@stripe/stripe-js';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const stored = PaymentStorage.getPaymentHistory() as unknown as PaymentIntent[];

    const mappedPayments: Payment[] = stored.map((pi) => ({
      id: pi.id,
      amount: pi.amount / 100,
      currency: pi.currency,
      status: pi.status,
      createdAt: typeof pi.created === 'number'
        ? new Date(pi.created * 1000).toISOString()
        : new Date().toISOString(), // fallback
      metadata: (pi as any).metadata ?? {}, // metadata might not exist on your stored object
    }));

    setPayments(mappedPayments);
  }, []);

  const clearHistory = () => {
    PaymentStorage.clearPaymentHistory();
    setPayments([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <button
          onClick={clearHistory}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear History
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No payment history found
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className="capitalize">{payment.status}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">ID: {payment.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
