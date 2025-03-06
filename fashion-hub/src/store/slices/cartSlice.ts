import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  customization?: {
    design: string;
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => 
          item.id === action.payload.id && 
          item.size === action.payload.size &&
          JSON.stringify(item.customization) === JSON.stringify(action.payload.customization)
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    removeItem: (state, action: PayloadAction<{ id: string; size: string }>) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.size === action.payload.size)
      );
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; size: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(
            (i) => !(i.id === action.payload.id && i.size === action.payload.size)
          );
        }
      }
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
