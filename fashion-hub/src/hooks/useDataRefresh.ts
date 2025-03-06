import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setProducts, setLoading, setError } from '../store/slices/productSlice';

export const useDataRefresh = (refreshInterval: number = 30000) => {
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      // In a real application, this would be an API call
      // For demo purposes, we're just simulating a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulated API response
      // In production, replace this with actual API calls
      const response = await fetch('/api/products');
      const data = await response.json();
      
      dispatch(setProducts(data));
    } catch (error) {
      dispatch(setError('Failed to refresh data. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up periodic refresh
    const intervalId = setInterval(fetchData, refreshInterval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [fetchData, refreshInterval]);

  return { refetch: fetchData };
};
