import {QueryClient} from '@tanstack/react-query';

// Create a client with custom configuration optimized for mobile
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that unused/inactive cache data remains in memory
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      // Time in milliseconds after data is considered stale
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Number of times to retry failed requests
      retry: 3,
      // Retry delay function (exponential backoff)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (useful for web, less so for mobile)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Number of times to retry failed mutations
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Global error handler for React Query
export const defaultQueryErrorHandler = (error: unknown) => {
  console.error('React Query Error:', error);
  // Add global error handling here (e.g., show toast, logout user, etc.)
};
