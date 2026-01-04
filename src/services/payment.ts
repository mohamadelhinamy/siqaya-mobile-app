import {apiService} from './api';

export interface PaymentInitiateRequest {
  amount: number;
  order_type: 'cart' | 'product_donation' | 'public_donation';
  payment_method: 'visa' | 'applepay' | 'mada';
  product_id?: number;
  path_id?: number;
  is_gift?: boolean;
  gift_type_id?: number;
  gift_sender_name?: string;
  gift_sender_mobile?: string;
  gift_receiver_name?: string;
  gift_receiver_mobile?: string;
}

export interface PaymentInitiateResponse {
  checkout_id: string;
  webview_url: string;
  amount: number;
  payment_method: string;
}

export const paymentService = {
  initiatePayment: async (
    data: PaymentInitiateRequest,
    userToken?: string,
  ): Promise<{
    success: boolean;
    data?: PaymentInitiateResponse;
    error?: string;
  }> => {
    try {
      const headers = userToken
        ? {Authorization: `Bearer ${userToken}`}
        : undefined;
      const response = await apiService.post<PaymentInitiateResponse>(
        '/payments/mobile/initiate',
        data,
        headers,
      );
      return response;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      return {
        success: false,
        error: 'Failed to initiate payment',
      };
    }
  },
};
