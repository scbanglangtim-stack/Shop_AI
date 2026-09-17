// src/store/redux/store.ts
// Redux Toolkit Store (Chương 6.4 & Đề cương 5.2.2)
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const reduxStore = configureStore({
  reducer: {
    cartRedux: cartReducer,
  },
});

export type ReduxRootState = ReturnType<typeof reduxStore.getState>;
export type ReduxAppDispatch = typeof reduxStore.dispatch;
