import { v4 as uuidv4 } from 'uuid';
import reducer, {
  addIngredient,
  removeIngredient,
  upIngredient,
  downIngredient,
  clearBurgerConstructor
} from './constructorSlice';
import { buns, notBuns } from '../../../testData';

jest.mock('uuid');

describe('constructorSlice', () => {
  const initialState = {
    burgerConstructor: {
      bun: null,
      ingredients: []
    },
    error: null
  };

  const filledState = {
    burgerConstructor: {
      bun: { ...buns[0], id: 'bun1' },
      ingredients: [
        { ...notBuns[0], id: 'id1' },
        { ...notBuns[1], id: 'id2' }
      ]
    },
    error: null
  };

  beforeEach(() => {
    (uuidv4 as jest.Mock).mockImplementation(() => 'test-id');
  });

  test('должен вернуть initialState по умолчанию', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  test('добавление булки', () => {
    const nextState = reducer(initialState, addIngredient(buns[0]));
    expect(nextState.burgerConstructor.bun).toEqual({
      ...buns[0],
      id: 'test-id'
    });
  });

  test('добавление начинки', () => {
    const nextState = reducer(initialState, addIngredient(notBuns[0]));
    expect(nextState.burgerConstructor.ingredients.length).toBe(1);
    expect(nextState.burgerConstructor.ingredients[0]).toEqual({
      ...notBuns[0],
      id: 'test-id'
    });
  });

  test('удаление ингредиента', () => {
    const toRemove = filledState.burgerConstructor.ingredients[0];
    const nextState = reducer(filledState, removeIngredient(toRemove));
    expect(nextState.burgerConstructor.ingredients).toHaveLength(1);
    expect(nextState.burgerConstructor.ingredients[0].id).toBe('id2');
  });

  test('перемещение ингредиента вверх', () => {
    const nextState = reducer(filledState, upIngredient(1));
    expect(nextState.burgerConstructor.ingredients[0].id).toBe('id2');
    expect(nextState.burgerConstructor.ingredients[1].id).toBe('id1');
  });

  test('перемещение ингредиента вниз', () => {
    const nextState = reducer(filledState, downIngredient(0));
    expect(nextState.burgerConstructor.ingredients[0].id).toBe('id2');
    expect(nextState.burgerConstructor.ingredients[1].id).toBe('id1');
  });

  test('очистка конструктора', () => {
    const nextState = reducer(filledState, clearBurgerConstructor());
    expect(nextState.burgerConstructor.bun).toBeNull();
    expect(nextState.burgerConstructor.ingredients).toHaveLength(0);
  });
});
