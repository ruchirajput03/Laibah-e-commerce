"use client";
import { useState, FormEvent, ChangeEvent } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import { usePayment } from '@/components/hooks/usePayment';

interface PaymentFormProps {
  amount: number;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: Error) => void;
}

interface CustomerDetails {
  name: string;
  email: string;
  address: {
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const {
    paymentData,
    createPaymentIntent,
    savePaymentToHistory,
    clearPaymentData,
    isLoading,
    error,
    setError,
  } = usePayment();

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      postal_code: '',
      country: 'US',
    },
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    try {
      let clientSecret = paymentData?.clientSecret;

      if (!clientSecret) {
        const paymentIntent = await createPaymentIntent(amount, {
          customerEmail: customerDetails.email,
          customerName: customerDetails.name,
        });
        clientSecret = paymentIntent.clientSecret;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerDetails.name,
            email: customerDetails.email,
            address: customerDetails.address,
          },
        },
      });

      if (stripeError) {
        const err = new Error(stripeError.message || 'Payment failed');
        setError(err.message);
        onError?.(err);
      }
       else if (paymentIntent) {
        savePaymentToHistory({ paymentIntent });
        clearPaymentData();
        onSuccess?.(paymentIntent);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      onError?.(err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const key = field.split('.')[1] as keyof CustomerDetails['address'];
  
      setCustomerDetails((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      const key = field as keyof Omit<CustomerDetails, 'address'>;
      setCustomerDetails((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

      {/* Customer Info */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={customerDetails.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange('name', e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={customerDetails.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange('email', e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          placeholder="Street Address"
          value={customerDetails.address.line1}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange('address.line1', e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="City"
          value={customerDetails.address.city}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange('address.city', e.target.value)
          }
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={customerDetails.address.postal_code}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange('address.postal_code', e.target.value)
          }
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Card Info */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Card Information</label>
        <div className="p-3 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-gray-50 p-3 rounded">
        <div className="flex justify-between">
          <span>Amount:</span>
          <span className="font-semibold">${amount}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default PaymentForm;
