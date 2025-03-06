import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import customizationReducer from './slices/customizationSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    customization: customizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
