import userReducer, {
  clearErrors,
  getOrdersThunk,
  UserState
} from './authSlice';
import { userOrders } from '../../../testData';

describe('authSlice / userSlice', () => {
  const initialState: UserState = {
    isAuthenticated: false,
    loginUserRequest: false,
    user: null,
    orders: [],
    ordersRequest: false,
    error: null
  };

  test('clearErrors должен сбросить поле error', () => {
    const prevState: UserState = {
      ...initialState,
      error: 'Test error'
    };

    const nextState = userReducer(prevState, clearErrors());
    expect(nextState.error).toBeNull();
  });

  test('getOrdersThunk.pending устанавливает ordersRequest: true', () => {
    const nextState = userReducer(
      initialState,
      getOrdersThunk.pending('pending')
    );
    expect(nextState.ordersRequest).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('getOrdersThunk.fulfilled сохраняет заказы', () => {
    const prevState: UserState = {
      ...initialState,
      ordersRequest: true
    };

    const nextState = userReducer(
      prevState,
      getOrdersThunk.fulfilled(userOrders, 'fulfilled')
    );

    expect(nextState.orders).toEqual(userOrders);
    expect(nextState.ordersRequest).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('getOrdersThunk.rejected сохраняет ошибку', () => {
    const error = {
      name: 'RejectedError',
      message: 'Ошибка при получении заказов'
    };

    const prevState: UserState = {
      ...initialState,
      ordersRequest: true
    };

    const nextState = userReducer(
      prevState,
      getOrdersThunk.rejected(error, 'rejected')
    );

    expect(nextState.ordersRequest).toBe(false);
    expect(nextState.error).toBe(error.message);
  });
});
