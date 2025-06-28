import orderReducer, {
  clearOrder,
  orderBurgerThunk,
  OrderState
} from './orderSlice';
import { order } from '../../../testData';
import { TNewOrderResponse } from '../../../utils/burger-api';

describe('orderSlice', () => {
  const initialState: OrderState = {
    order: null,
    isOrderLoading: false,
    error: null
  };

  test('очистка заказа (clearOrder)', () => {
    const prevState: OrderState = {
      order,
      isOrderLoading: true,
      error: 'Some error'
    };

    const nextState = orderReducer(prevState, clearOrder());
    expect(nextState).toEqual(initialState);
  });

  test('pending: установка isOrderLoading: true', () => {
    const nextState = orderReducer(
      initialState,
      orderBurgerThunk.pending('pending', [])
    );
    expect(nextState.isOrderLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('fulfilled: сохранение заказа и завершение загрузки', () => {
    const payload: TNewOrderResponse = {
      order,
      name: 'Test order name',
      success: true
    };

    const prevState: OrderState = {
      order: null,
      isOrderLoading: true,
      error: null
    };

    const nextState = orderReducer(
      prevState,
      orderBurgerThunk.fulfilled(payload, 'fulfilled', [])
    );

    expect(nextState.order).toEqual(order);
    expect(nextState.isOrderLoading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('rejected: установка ошибки и завершение загрузки', () => {
    const error = {
      name: 'Error',
      message: 'Ошибка оформления заказа'
    };

    const prevState: OrderState = {
      order: null,
      isOrderLoading: true,
      error: null
    };

    const nextState = orderReducer(
      prevState,
      orderBurgerThunk.rejected(error, 'rejected', [])
    );

    expect(nextState.isOrderLoading).toBe(false);
    expect(nextState.error).toBe(error.message);
  });
});
