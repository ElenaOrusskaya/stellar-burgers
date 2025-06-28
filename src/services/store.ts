import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { ThunkAction, ThunkDispatch, thunk } from 'redux-thunk';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import burgerConstructor from './slices/constructor/constructorSlice';
import feed from './slices/feed/feedSlice';
import ingredients from './slices/ingredients/ingredientsSlice';
import order from './slices/order/orderSlice';
import user from './slices/auth/authSlice';

export const rootReducer = combineReducers({
  burgerConstructor,
  feed,
  ingredients,
  order,
  user
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

type TApplicationActions = any;

export type AppThunk<Return = void> = ThunkAction<
  Return,
  RootState,
  unknown,
  TApplicationActions
>;

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = ThunkDispatch<RootState, never, TApplicationActions>;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
