import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {ApiResponse} from '../types';
import {Config} from '../constants';

export interface AppTokenResponse {
  token: string;
  expires_in: number;
  token_type: string;
}

export interface LoginResponse {
  user_id: number;
  requires_otp: boolean;
  otp_expires_in: number;
}

export interface VerifyOtpResponse {
  user: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
  token_type: string;
}

export interface ResendOtpResponse {
  otp_expires_in: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
  password_confirmation: string;
  login_type: 'mobile';
}

export interface RegisterResponse {
  user_id: number;
  requires_otp: boolean;
  otp_expires_in: number;
}

export interface Product {
  id: number;
  guid: string;
  product_name: string;
  product_brief: string | null;
  product_description: string | null;
  target_amount: string;
  received_amount: string;
  collected_amount?: number;
  remaining_amount?: number;
  completion_percentage?: number;
  association: {
    id: number;
    name: string;
    logo: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  city?: {
    id: number;
    name: string;
  };
  province?: {
    id: number;
    name: string;
  };
  number_of_beneficiaries?: number;
  stage: {
    stage_target: number;
    stage_collected: number;
    stage_remaining?: number;
    stage_percentage: number;
  };
  current_stage?: {
    stage_number: number;
    target_amount: number | null;
  };
  summary?: {
    donations_count: number;
    last_donation_amount: number | null;
    last_donation_at: string | null;
    last_donation_human: string | null;
    views_count: number;
  };
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  amount: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface CartData {
  id: number;
  user_id: number;
  item_count: number;
  items: CartItem[];
  total_amount: number;
  created_at: string;
  updated_at: string;
  expires_at?: string | null;
}

export type CartResponse = CartData;

/**
 * Sokya API service class with app token management
 */
class ApiService {
  private appToken: string | null = null;
  private appTokenExpiry: number | null = null;

  private async makeRequest<T>(
    endpoint: string,
    options: AxiosRequestConfig = {},
    requiresAppToken: boolean = true,
    isRetry: boolean = false,
  ): Promise<ApiResponse<T>> {
    try {
      // Ensure we have a valid app token for requests that require it
      if (requiresAppToken && !(await this.ensureValidAppToken())) {
        throw new Error('Failed to obtain application token');
      }

      const headers: any = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-App-Locale': 'ar',
        'X-Device-ID': 'device-mobile-app',
      };

      // Merge custom headers from options
      Object.assign(headers, options.headers || {});

      // Add app token if available and required (always last to ensure it's not overridden)
      if (requiresAppToken && this.appToken) {
        headers['X-App-Token'] = `${this.appToken}`;
        console.log('🔑 APP TOKEN FOR TESTING:', this.appToken);
      }

      console.log(options, 'options');
      console.log(headers, 'final headers');

      const axiosConfig = {
        url: `${Config.API.BASE_URL}${endpoint}`,
        method: options.method || 'GET',
        data: options.data,
        ...options,
        headers, // Headers MUST come after ...options to not be overridden
      };

      console.log(
        '🌐 Full axios config:',
        JSON.stringify(axiosConfig, null, 2),
      );

      const response: AxiosResponse<any> = await axios(axiosConfig);

      console.log(response, 'response');

      const data = response.data;

      console.log(data, 'data');

      // Check if response body contains auth error (some APIs return 200 with error in body)
      if (
        requiresAppToken &&
        !isRetry &&
        data &&
        (data.code === 401 ||
          data.code === 403 ||
          (data.message &&
            (data.message.toLowerCase().includes('token') ||
              data.message.toLowerCase().includes('unauthenticated') ||
              data.message.toLowerCase().includes('unauthorized'))))
      ) {
        console.log('🔄 Token issue detected in response body, refreshing...');
        this.appToken = null;
        this.appTokenExpiry = null;
        return this.makeRequest<T>(endpoint, options, requiresAppToken, true);
      }

      return data;
    } catch (error: any) {
      console.error('API Request failed:', error);

      // Handle axios errors
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        const errorCode = responseData?.code;
        const errorMessage = responseData?.message || '';

        console.error('❌ Server error response:', {
          status: status,
          code: errorCode,
          data: responseData,
          headers: error.response.headers,
        });

        // Retry once on 401 (token expired) - check both HTTP status and response code
        if (
          requiresAppToken &&
          !isRetry &&
          (status === 401 ||
            errorCode === 401 ||
            errorMessage.toLowerCase().includes('unauthenticated') ||
            errorMessage.toLowerCase().includes('token'))
        ) {
          console.log('🔄 Token expired, refreshing and retrying...');
          this.appToken = null;
          this.appTokenExpiry = null;
          return this.makeRequest<T>(endpoint, options, requiresAppToken, true);
        }

        throw new Error(errorMessage || `HTTP error! status: ${status}`);
      }

      throw error;
    }
  }

  private async ensureValidAppToken(): Promise<boolean> {
    // Check if current token is still valid (with 5 minute buffer)
    if (
      this.appToken &&
      this.appTokenExpiry &&
      Date.now() < this.appTokenExpiry - 5 * 60 * 1000
    ) {
      console.log('✅ Using existing valid app token:', {
        token: this.appToken.substring(0, 20) + '...',
        expiresAt: new Date(this.appTokenExpiry).toISOString(),
        timeRemaining:
          Math.floor((this.appTokenExpiry - Date.now()) / 1000) + 's',
      });
      return true;
    }

    console.log('🔄 App token expired or missing, generating new token...');
    try {
      const response = await this.generateAppToken();
      console.log('✅ App token generation result:', response.success);
      return response.success;
    } catch (error) {
      console.error('❌ Failed to generate app token:', error);
      return false;
    }
  }

  async generateAppToken(): Promise<ApiResponse<AppTokenResponse>> {
    console.log('🔑 Requesting new app token from /auth/app-token');
    const response = await this.makeRequest<AppTokenResponse>(
      '/auth/app-token',
      {
        method: 'POST',
        data: {
          app_key: Config.API.APP_KEY,
          app_secret: Config.API.APP_SECRET,
        },
      },
      false,
    ); // Don't require app token for this call

    console.log(
      '📦 Full app token response:',
      JSON.stringify(response, null, 2),
    );
    console.log('📦 Response.data:', response.data);
    console.log('📦 Response.data.token:', response.data?.token);

    if (response.success && response.data) {
      this.appToken = response.data.token;
      this.appTokenExpiry = Date.now() + response.data.expires_in * 1000;
      console.log('✅ App token stored:', {
        fullToken: this.appToken,
        tokenLength: this.appToken.length,
        expiresIn: response.data.expires_in + 's',
        expiresAt: new Date(this.appTokenExpiry).toISOString(),
        postmanToken:
          '5aENf0Th8N3XUMGM45Zeq5zEIRyeE5RFZz4AHAtMlVH5fn6hzqOyCSVUUzw2mhVw',
        tokensMatch:
          this.appToken ===
          '5aENf0Th8N3XUMGM45Zeq5zEIRyeE5RFZz4AHAtMlVH5fn6hzqOyCSVUUzw2mhVw',
      });
    } else {
      console.error('❌ App token generation failed:', response);
    }

    return response;
  }

  async loginWithMobile(mobile: string): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      data: {
        mobile,
        login_type: 'mobile',
      },
    });
  }

  async register(
    registerData: RegisterRequest,
  ): Promise<ApiResponse<RegisterResponse>> {
    return this.makeRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      data: registerData,
    });
  }

  async getProducts(
    perPage: number = 12,
    page: number = 1,
  ): Promise<ApiResponse<Product[]>> {
    const products = await this.makeRequest<Product[]>(
      `/products?per_page=${perPage}&page=${page}`,
      {
        method: 'GET',
      },
    );
    console.log;
    return products;
  }

  async verifyOtp(
    userId: number,
    otp: string,
  ): Promise<ApiResponse<VerifyOtpResponse>> {
    return this.makeRequest<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      data: {
        user_id: userId,
        otp,
      },
    });
  }

  async resendOtp(userId: number): Promise<ApiResponse<ResendOtpResponse>> {
    return this.makeRequest<ResendOtpResponse>('/auth/resend-otp', {
      method: 'POST',
      data: {
        user_id: userId,
      },
    });
  }

  async logout(userToken: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  }

  async getAuthenticatedUser(userToken: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  }

  async getCart(userToken: string): Promise<ApiResponse<CartResponse>> {
    return this.makeRequest<CartResponse>(
      '/cart',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
      true, // requiresAppToken
    );
  }

  /**
   * Get current profile using /profile endpoint
   */
  async getProfile(userToken?: string): Promise<ApiResponse<any>> {
    // Use the authenticated user endpoint which exists on the server
    // (avoids 404s for `/profile` on some server configurations)
    return this.makeRequest<any>(
      '/profile',
      {
        method: 'GET',
        headers: userToken
          ? {
              Authorization: `Bearer ${userToken}`,
            }
          : undefined,
      },
      true,
    );
  }

  /**
   * Update profile using PUT /profile
   */
  async updateProfile(
    data: any,
    userToken?: string,
  ): Promise<ApiResponse<any>> {
    // Use the authenticated user endpoint for updating profile data
    return this.makeRequest<any>(
      '/profile',
      {
        method: 'PUT',
        data,
        headers: userToken
          ? {
              Authorization: `Bearer ${userToken}`,
            }
          : undefined,
      },
      true,
    );
  }

  // Keep backward compatibility methods
  async get<T>(
    endpoint: string,
    headers?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {method: 'GET', headers});
  }

  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      data: data,
      headers: headers,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      data: data,
      headers: headers,
    });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      headers: headers,
    });
  }

  /**
   * Get the current app token (ensures it's valid first)
   */
  async getAppToken(): Promise<string | null> {
    await this.ensureValidAppToken();
    return this.appToken;
  }
}

export const apiService = new ApiService();
