import {apiService} from './api';
import {User, ApiResponse} from '../types';

/**
 * User service for handling user-related API calls
 */
export class UserService {
  /**
   * Get current user profile
   */
  static async getCurrentUser(userToken?: string): Promise<ApiResponse<User>> {
    return apiService.getProfile(userToken);
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userData: Partial<User>,
    userToken?: string,
  ): Promise<ApiResponse<User>> {
    return apiService.updateProfile(userData, userToken);
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
