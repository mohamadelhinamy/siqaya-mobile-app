import {apiService} from './api';
import {User, ApiResponse} from '../types';

/**
 * User service for handling user-related API calls
 */
export class UserService {
  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<User>('/user/profile');
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userData: Partial<User>,
  ): Promise<ApiResponse<User>> {
    return apiService.put<User>('/user/profile', userData);
  }

  /**
   * Delete user account
   */
  static async deleteAccount(): Promise<ApiResponse<void>> {
    return apiService.delete<void>('/user/account');
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(
    imageUri: string,
  ): Promise<ApiResponse<{url: string}>> {
    // In a real app, you would handle image upload here
    // This is just a placeholder implementation
    return {
      success: true,
      data: {url: imageUri},
    };
  }
}
