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
        ...(options.headers || {}),
      };

      // Add app token if available and required
      if (requiresAppToken && this.appToken) {
        headers['X-App-Token'] = `${this.appToken}`;
      }

      console.log(options, 'options');

      const response: AxiosResponse<any> = await axios({
        url: `${Config.API.BASE_URL}${endpoint}`,
        method: options.method || 'GET',
        data: options.data,
        headers,
        ...options,
      });

      console.log(response, 'response');

      const data = response.data;

      console.log(data, 'data');

      return data;
    } catch (error: any) {
      console.error('API Request failed:', error);

      // Handle axios errors
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `HTTP error! status: ${error.response.status}`;
        throw new Error(errorMessage);
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
      console.log('Using existing valid app token', this.appToken);
      return true;
    }

    try {
      const response = await this.generateAppToken();
      return response.success;
    } catch (error) {
      console.error('Failed to generate app token:', error);
      return false;
    }
  }

  async generateAppToken(): Promise<ApiResponse<AppTokenResponse>> {
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

    if (response.success && response.data) {
      console.log('Generated new app token', response.data);
      this.appToken = response.data.token;
      this.appTokenExpiry = Date.now() + response.data.expires_in * 1000;
    }

    return response;
  }

  async loginWithMobile(mobile: string): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      data: {
        mobile,
        login_type: 'mobile',
        password: 'password123',
      },
    });
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

  // Keep backward compatibility methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {method: 'GET'});
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      data: data,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      data: data,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {method: 'DELETE'});
  }
}

export const apiService = new ApiService();
