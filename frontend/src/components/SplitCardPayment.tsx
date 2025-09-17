import { useState, FormEvent, ChangeEvent } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { StripeError } from '@stripe/stripe-js';
import { usePayment } from '@/components/hooks/usePayment';

interface SplitCardPaymentProps {
  amount: number;
  onSuccess?: (paymentIntent: unknown) => void;
  onError?: (error: Error | StripeError) => void;
}

interface CustomerDetails {
  name: string;
  email: string;
}

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
};

const SplitCardPayment: React.FC<SplitCardPaymentProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const {
    createPaymentIntent,
    savePaymentToHistory,
    isLoading,
    error,
  } = usePayment();

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    try {
      const { clientSecret } = await createPaymentIntent(amount);

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error('Card Number Element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerDetails.name,
              email: customerDetails.email,
            },
          },
        }
      );

      if (stripeError) {
        onError?.(stripeError);
      } else if (paymentIntent) {
        savePaymentToHistory({ paymentIntent });
        onSuccess?.(paymentIntent);
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      onError?.(error);
    }
  };

  const handleInputChange = (
    field: keyof CustomerDetails,
    value: string
  ) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6"
    >
      <input
        type="text"
        placeholder="Full Name"
        value={customerDetails.name}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange('name', e.target.value)
        }
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={customerDetails.email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleInputChange('email', e.target.value)
        }
        className="w-full p-2 border rounded"
        required
      />

      <div className="space-y-2">
        <label>Card Number</label>
        <div className="p-3 border rounded">
          <CardNumberElement options={cardElementOptions} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Expiry</label>
          <div className="p-3 border rounded">
            <CardExpiryElement options={cardElementOptions} />
          </div>
        </div>
        <div>
          <label>CVC</label>
          <div className="p-3 border rounded">
            <CardCvcElement options={cardElementOptions} />
          </div>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default SplitCardPayment;
