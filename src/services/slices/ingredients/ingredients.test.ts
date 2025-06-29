import ingredientsReducer, { getIngredientsThunk } from './ingredientsSlice';
import { IngredientsState, initialState } from './ingredientsSlice';
import { buns } from '../../../testData';

describe('ingredientsSlice', () => {

  test('должен установить isIngredientsLoading: true при pending', () => {
    const nextState = ingredientsReducer(
      initialState,
      getIngredientsThunk.pending('pending')
    );
    expect(nextState.isIngredientsLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('должен сохранить данные и снять isIngredientsLoading при fulfilled', () => {
    const nextState = ingredientsReducer(
      { ...initialState, isIngredientsLoading: true },
      getIngredientsThunk.fulfilled(buns, 'fulfilled', undefined)
    );

    expect(nextState.ingredients).toEqual(buns);
    expect(nextState.isIngredientsLoading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('должен сохранить ошибку и снять isIngredientsLoading при rejected', () => {
    const error = {
      name: 'RejectedError',
      message: 'Ошибка при получении ингредиентов'
    };

    const nextState = ingredientsReducer(
      { ...initialState, isIngredientsLoading: true },
      getIngredientsThunk.rejected(error, 'rejected')
    );

    expect(nextState.ingredients).toEqual([]);
    expect(nextState.isIngredientsLoading).toBe(false);
    expect(nextState.error).toBe(error.message);
  });
});
