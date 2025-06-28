import feedReducer, {
  FeedState,
  getFeedsThunk,
  getOrderByNumberThunk
} from './feedSlice';
import { userOrders } from '../../../testData';
import { TFeedsResponse, TOrderResponse } from '../../../utils/burger-api';

describe('feedSlice', () => {
  const initialState: FeedState = {
    orders: [],
    isFeedsLoading: false,
    order: null,
    isOrderLoading: false,
    total: 0,
    totalToday: 0,
    error: null
  };

  describe('getFeedsThunk', () => {
    test('pending: isFeedsLoading становится true', () => {
      const nextState = feedReducer(
        initialState,
        getFeedsThunk.pending('pending')
      );
      expect(nextState.isFeedsLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    test('fulfilled: сохраняет данные ленты и сбрасывает флаг загрузки', () => {
      const response: TFeedsResponse = {
        orders: userOrders,
        total: 42,
        totalToday: 7,
        success: true
      };

      const nextState = feedReducer(
        { ...initialState, isFeedsLoading: true },
        getFeedsThunk.fulfilled(response, 'fulfilled')
      );

      expect(nextState.orders).toEqual(userOrders);
      expect(nextState.total).toBe(42);
      expect(nextState.totalToday).toBe(7);
      expect(nextState.isFeedsLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    test('rejected: сохраняет ошибку и сбрасывает флаг загрузки', () => {
      const error = {
        name: 'RejectedError',
        message: 'Ошибка загрузки ленты'
      };

      const nextState = feedReducer(
        { ...initialState, isFeedsLoading: true },
        getFeedsThunk.rejected(error, 'rejected')
      );

      expect(nextState.isFeedsLoading).toBe(false);
      expect(nextState.error).toBe(error.message);
    });
  });

  describe('getOrderByNumberThunk', () => {
    test('pending: isOrderLoading становится true', () => {
      const nextState = feedReducer(
        initialState,
        getOrderByNumberThunk.pending('pending', 1)
      );
      expect(nextState.isOrderLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    test('fulfilled: сохраняет заказ и сбрасывает флаг загрузки', () => {
      const response: TOrderResponse = {
        orders: [userOrders[0]],
        success: true
      };

      const prevState: FeedState = {
        ...initialState,
        isOrderLoading: true
      };

      const nextState = feedReducer(
        prevState,
        getOrderByNumberThunk.fulfilled(response, 'fulfilled', 1)
      );

      expect(nextState.order).toEqual(userOrders[0]);
      expect(nextState.isOrderLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    test('rejected: сохраняет ошибку и сбрасывает флаг загрузки', () => {
      const error = {
        name: 'RejectedError',
        message: 'Ошибка загрузки заказа по номеру'
      };

      const nextState = feedReducer(
        { ...initialState, isOrderLoading: true },
        getOrderByNumberThunk.rejected(error, 'rejected', 1)
      );

      expect(nextState.isOrderLoading).toBe(false);
      expect(nextState.error).toBe(error.message);
    });
  });
});
