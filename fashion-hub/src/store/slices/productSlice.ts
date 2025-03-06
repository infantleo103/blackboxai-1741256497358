import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 't-shirts' | 'hoodies' | 'jackets' | 'pants' | 'accessories';
  stock: number;
  imageUrl: string;
  isCustomizable: boolean;
  customizationOptions?: {
    colors: string[];
    sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
    printLocations: ('front' | 'back' | 'left-sleeve' | 'right-sleeve')[];
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  items: Product[];
  filteredItems: Product[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    subcategory: string | null;
    priceRange: { min: number; max: number } | null;
    sizes: string[] | null;
    sortBy: string | null;
  };
}

const initialState: ProductState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    subcategory: null,
    priceRange: null,
    sizes: null,
    sortBy: null
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductState['filters']>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
      
      // Apply filters
      let filtered = [...state.items];

      // Category filter
      if (state.filters.category) {
        filtered = filtered.filter(item => item.category === state.filters.category);
      }

      // Price range filter
      if (state.filters.priceRange) {
        filtered = filtered.filter(item => 
          item.price >= state.filters.priceRange!.min && 
          item.price <= state.filters.priceRange!.max
        );
      }

      // Size filter
      if (state.filters.sizes && state.filters.sizes.length > 0) {
        filtered = filtered.filter(item => 
          item.customizationOptions?.sizes.some(size => 
            state.filters.sizes!.includes(size)
          )
        );
      }

      // Sorting
      if (state.filters.sortBy) {
        switch (state.filters.sortBy) {
          case 'price_asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'name_asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name_desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default:
            break;
        }
      }

      state.filteredItems = filtered;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredItems = state.items;
    }
  }
});

export const { 
  setProducts, 
  setLoading, 
  setError, 
  setFilters, 
  clearFilters 
} = productSlice.actions;

export default productSlice.reducer;
