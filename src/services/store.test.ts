import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './store';

import constructorReducer, {
  burgerConstructorState
} from './slices/constructor/constructorSlice';
import ingredientsReducer, {
  IngredientsState
} from './slices/ingredients/ingredientsSlice';
import orderReducer, { OrderState } from './slices/order/orderSlice';
import userReducer, { UserState } from './slices/auth/authSlice';
import feedReducer, { FeedState } from './slices/feed/feedSlice';

describe('rootReducer', () => {
  const constructorInitial: burgerConstructorState = {
    burgerConstructor: { bun: null, ingredients: [] },
    error: null
  };

  const ingredientsInitial: IngredientsState = {
    ingredients: [],
    isIngredientsLoading: false,
    error: null
  };

  const orderInitial: OrderState = {
    order: null,
    isOrderLoading: false,
    error: null
  };

  const userInitial: UserState = {
    isAuthenticated: false,
    loginUserRequest: false,
    user: null,
    orders: [],
    ordersRequest: false,
    error: null
  };

  const feedInitial: FeedState = {
    orders: [],
    isFeedsLoading: false,
    order: null,
    isOrderLoading: false,
    total: 0,
    totalToday: 0,
    error: null
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      burgerConstructor: constructorInitial,
      ingredients: ingredientsInitial,
      order: orderInitial,
      user: userInitial,
      feed: feedInitial
    }
  });

  test('инициализирует burgerConstructor с expected state', () => {
    expect(store.getState().burgerConstructor).toEqual(
      constructorReducer(constructorInitial, { type: 'UNKNOWN_ACTION' })
    );
  });

  test('инициализирует ingredients с expected state', () => {
    expect(store.getState().ingredients).toEqual(
      ingredientsReducer(ingredientsInitial, { type: 'UNKNOWN_ACTION' })
    );
  });

  test('инициализирует order с expected state', () => {
    expect(store.getState().order).toEqual(
      orderReducer(orderInitial, { type: 'UNKNOWN_ACTION' })
    );
  });

  test('инициализирует user с expected state', () => {
    expect(store.getState().user).toEqual(
      userReducer(userInitial, { type: 'UNKNOWN_ACTION' })
    );
  });

  test('инициализирует feed с expected state', () => {
    expect(store.getState().feed).toEqual(
      feedReducer(feedInitial, { type: 'UNKNOWN_ACTION' })
    );
  });
});
