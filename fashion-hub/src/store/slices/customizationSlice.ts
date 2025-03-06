import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DesignElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
}

interface CustomizationState {
  selectedProduct: {
    id: string;
    color: string;
    size: string;
  } | null;
  designElements: DesignElement[];
  canvas: {
    width: number;
    height: number;
    zoom: number;
  };
  view: '2d' | '3d';
  history: {
    past: DesignElement[][];
    future: DesignElement[][];
  };
}

const initialState: CustomizationState = {
  selectedProduct: null,
  designElements: [],
  canvas: {
    width: 800,
    height: 600,
    zoom: 1,
  },
  view: '2d',
  history: {
    past: [],
    future: [],
  },
};

const customizationSlice = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    setSelectedProduct: (
      state,
      action: PayloadAction<{ id: string; color: string; size: string } | null>
    ) => {
      state.selectedProduct = action.payload;
    },
    addDesignElement: (state, action: PayloadAction<DesignElement>) => {
      state.history.past.push([...state.designElements]);
      state.history.future = [];
      state.designElements.push(action.payload);
    },
    updateDesignElement: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<DesignElement> }>
    ) => {
      state.history.past.push([...state.designElements]);
      state.history.future = [];
      const element = state.designElements.find(el => el.id === action.payload.id);
      if (element) {
        Object.assign(element, action.payload.updates);
      }
    },
    removeDesignElement: (state, action: PayloadAction<string>) => {
      state.history.past.push([...state.designElements]);
      state.history.future = [];
      state.designElements = state.designElements.filter(
        el => el.id !== action.payload
      );
    },
    setCanvasSize: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.canvas.width = action.payload.width;
      state.canvas.height = action.payload.height;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.canvas.zoom = action.payload;
    },
    toggleView: (state) => {
      state.view = state.view === '2d' ? '3d' : '2d';
    },
    undo: (state) => {
      if (state.history.past.length > 0) {
        const newPresent = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        state.history.future = [state.designElements, ...state.history.future];
        state.history.past = newPast;
        state.designElements = newPresent;
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const newPresent = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        state.history.past = [...state.history.past, state.designElements];
        state.history.future = newFuture;
        state.designElements = newPresent;
      }
    },
    clearDesign: (state) => {
      state.history.past.push([...state.designElements]);
      state.history.future = [];
      state.designElements = [];
    },
  },
});

export const {
  setSelectedProduct,
  addDesignElement,
  updateDesignElement,
  removeDesignElement,
  setCanvasSize,
  setZoom,
  toggleView,
  undo,
  redo,
  clearDesign,
} = customizationSlice.actions;

export default customizationSlice.reducer;
