"use client";
import { useState, useEffect } from "react";
import { PaymentStorage, PaymentData, PaymentIntent } from "@/utils/storage";
import axios from "axios";
interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

interface PaymentIntentResult {
  paymentIntent: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    metadata?: Record<string, unknown>;
  };
}

export const usePayment = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentIntent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedPaymentData = PaymentStorage.getPaymentData();
    const savedHistory = PaymentStorage.getPaymentHistory();

    if (savedPaymentData) setPaymentData(savedPaymentData);
    if (savedHistory) setPaymentHistory(savedHistory);
  }, []);

  // Create payment intent
  const createPaymentIntent = async (
    amount: number,
    metadata: Record<string, unknown> = {}
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<CreatePaymentIntentResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-payment-intent`,
        { amount, metadata },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      const newPaymentData: PaymentData = {
        clientSecret: data.clientSecret,
        paymentIntentId: data.paymentIntentId,
        amount,
        metadata,
        createdAt: new Date().toISOString(),
      };

      setPaymentData(newPaymentData);
      PaymentStorage.savePaymentData(newPaymentData);

      return data;
    } catch (err: unknown) {
      let message = "Failed to create payment intent";

      // Narrow the type
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.error?.message || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save successful payment to history
  const savePaymentToHistory = (paymentResult: PaymentIntentResult): void => {
    const { paymentIntent } = paymentResult;

    const payment: PaymentIntent = {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: Date.now(),
      metadata: paymentIntent.metadata,
    };

    const updatedHistory = [payment, ...paymentHistory];
    setPaymentHistory(updatedHistory);
    PaymentStorage.savePaymentHistory(payment);
  };

  // Clear current payment data
  const clearPaymentData = (): void => {
    setPaymentData(null);
    PaymentStorage.clearPaymentData();
  };

  return {
    paymentData,
    paymentHistory,
    isLoading,
    error,
    createPaymentIntent,
    savePaymentToHistory,
    clearPaymentData,
    setError,
  };
};
