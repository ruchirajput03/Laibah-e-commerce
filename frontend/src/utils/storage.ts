// Define types for payment data
export interface PaymentData {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    metadata?: Record<string, any>;
    createdAt: string;
  }
  
  export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
    metadata?: Record<string, any>;
  }
  
  export const PaymentStorage = {
    // Save payment data
    savePaymentData: (data: PaymentData): void => {
      try {
        localStorage.setItem('paymentData', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving payment data:', error);
      }
    },
  
    // Get payment data
    getPaymentData: (): PaymentData | null => {
      try {
        const data = localStorage.getItem('paymentData');
        return data ? (JSON.parse(data) as PaymentData) : null;
      } catch (error) {
        console.error('Error getting payment data:', error);
        return null;
      }
    },

    
  
    // Clear payment data
    clearPaymentData: (): void => {
      try {
        localStorage.removeItem('paymentData');
      } catch (error) {
        console.error('Error clearing payment data:', error);
      }
    },
  
    // Save payment history
    savePaymentHistory: (payment: PaymentIntent): void => {
      try {
        const history = PaymentStorage.getPaymentHistory();
        const updatedHistory = [payment, ...history];
        localStorage.setItem('paymentHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving payment history:', error);
      }
    },
  
    // Get payment history
    getPaymentHistory: (): PaymentIntent[] => {
      try {
        const history = localStorage.getItem('paymentHistory');
        return history ? (JSON.parse(history) as PaymentIntent[]) : [];
      } catch (error) {
        console.error('Error getting payment history:', error);
        return [];
      }
    },
  
    // Clear payment history
    clearPaymentHistory: (): void => {
      try {
        localStorage.removeItem('paymentHistory');
      } catch (error) {
        console.error('Error clearing payment history:', error);
      }
    },
  };
  