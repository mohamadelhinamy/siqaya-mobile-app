// Custom React Query hooks
// This file contains reusable hooks for data fetching

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {apiService} from '../services/api';

// Example: User Profile Hook
export const useUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['user', 'profile', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await apiService.get(`/users/${userId}`);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!userId, // Only run query if userId exists
  });
};

// Example: Update User Profile Mutation
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {name?: string; email?: string}) => {
      const response = await apiService.put('/user/profile', userData);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch user profile queries
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});

      // Optionally update cache directly
      // queryClient.setQueryData(['user', 'profile'], data);
    },
    onError: error => {
      console.error('Failed to update profile:', error);
      // Handle error (show toast, etc.)
    },
  });
};

// Example: Posts List Hook
export const usePostsList = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['posts', 'list', {page, limit}],
    queryFn: async () => {
      const response = await apiService.get(
        `/posts?page=${page}&limit=${limit}`,
      );
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });
};

// Example: Create Post Mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: {title: string; content: string}) => {
      const response = await apiService.post('/posts', postData);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate posts list to refetch with new post
      queryClient.invalidateQueries({queryKey: ['posts', 'list']});
    },
  });
};

// Auth-related hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: {email: string; password: string}) => {
      const response = await apiService.post('/auth/login', credentials);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: data => {
      // Handle successful login (store token, navigate, etc.)
      console.log('Login successful:', data);
    },
    onError: error => {
      console.error('Login failed:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiService.post('/auth/logout');
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
};
