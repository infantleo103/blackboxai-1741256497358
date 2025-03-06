import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women' | 'kids';
  subcategory: 'tshirts' | 'pants' | 'shirts' | 'shorts' | 'dresses' | 'tops';
  sizes: string[];
  images: string[];
  isCustomizable: boolean;
}

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  selectedProduct: Product | null;
  filters: {
    category: string | null;
    subcategory: string | null;
    priceRange: { min: number; max: number } | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  filters: {
    category: null,
    subcategory: null,
    priceRange: null,
  },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<{
        category?: string | null;
        subcategory?: string | null;
        priceRange?: { min: number; max: number } | null;
      }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      
      // Apply filters
      state.filteredItems = state.items.filter((product) => {
        const categoryMatch = !state.filters.category || product.category === state.filters.category;
        const subcategoryMatch = !state.filters.subcategory || product.subcategory === state.filters.subcategory;
        const priceMatch = !state.filters.priceRange || 
          (product.price >= state.filters.priceRange.min && 
           product.price <= state.filters.priceRange.max);
        
        return categoryMatch && subcategoryMatch && priceMatch;
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        subcategory: null,
        priceRange: null,
      };
      state.filteredItems = state.items;
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setFilters,
  setLoading,
  setError,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer;
