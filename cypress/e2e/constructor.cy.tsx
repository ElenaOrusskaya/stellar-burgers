import * as authTokens from '../fixtures/token.json';
import * as orderData from '../fixtures/order.json';

// Константы для селекторов
const CONSTRUCTOR_ITEM_SELECTOR =
  '.constructor-element > .constructor-element__row > .constructor-element__text';
const MODAL_SELECTOR = '#modals > div:first-child';
const MODAL_CLOSE_BUTTON_SELECTOR = 'div:first-child > button > svg';
const MODAL_OVERLAY_SELECTOR = '#modals > div:nth-child(2)';
const ORDER_BUTTON_SELECTOR =
  '#root > div > main > div > section:nth-child(2) > div > button';

describe('Тесты для работоспособности приложения', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  describe('Загрузка ингредиентов и добавление их в конструктор', () => {
    it('Проверка для добавления булок и ингредиентов в заказ', () => {
      cy.request('/api/ingredients');

      cy.get(`[data-cy=bun] > .common_button`).first().click();
      cy.get(`[data-cy=main] > .common_button`).first().click();
      cy.get(`[data-cy=sauce] > .common_button`).first().click();

      cy.get(CONSTRUCTOR_ITEM_SELECTOR).first().as('bunTop');
      cy.get(CONSTRUCTOR_ITEM_SELECTOR).eq(1).as('mainIngredient');
      cy.get(CONSTRUCTOR_ITEM_SELECTOR).eq(2).as('sauceIngredient');
      cy.get(CONSTRUCTOR_ITEM_SELECTOR).last().as('bunBottom');

      cy.get('@bunTop').contains('Краторная булка N-200i (верх)');
      cy.get('@mainIngredient').contains('Биокотлета из марсианской Магнолии');
      cy.get('@sauceIngredient').contains('Соус Spicy-X');
      cy.get('@bunBottom').contains('Краторная булка N-200i (низ)');
    });
  });

  describe('Проверка работы модального окна для ингредиента', () => {
    it('Открытие модального окна', () => {
      cy.get(`[data-cy=bun]`).first().click();
      cy.get(MODAL_SELECTOR).as('modal');

      cy.get('@modal')
        .find('div:first-child > h3')
        .contains('Краторная булка N-200i');
    });

    it('Закрытие модального окна по крестику', () => {
      cy.get(`[data-cy=bun]`).first().click();
      cy.get(MODAL_SELECTOR).as('modal');
      cy.get('@modal').find(MODAL_CLOSE_BUTTON_SELECTOR).click();

      cy.get(MODAL_SELECTOR).should('not.exist');
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.get(`[data-cy=bun]`).first().click();
      cy.get(MODAL_OVERLAY_SELECTOR).click({ force: true });

      cy.get(MODAL_SELECTOR).should('not.exist');
    });
  });

  describe('Тестирование создания нового заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
      cy.setCookie('accessToken', authTokens.accessToken);
      localStorage.setItem('refreshToken', authTokens.refreshToken);
      cy.intercept('GET', 'api/auth/tokens', { fixture: 'token.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
      cy.visit('/');
    });

    it('Проверка полного цикла создания заказа', () => {
      cy.get(`[data-cy=bun] > .common_button`).first().click();
      cy.get(`[data-cy=main] > .common_button`).first().click();
      cy.get(`[data-cy=sauce] > .common_button`).first().click();

      cy.get(ORDER_BUTTON_SELECTOR).click();

      cy.get(MODAL_SELECTOR).as('orderModal');
      cy.get('@orderModal')
        .find('div:nth-child(2) > h2')
        .contains(orderData.order.number);

      cy.get('@orderModal').find(MODAL_CLOSE_BUTTON_SELECTOR).click();

      cy.get(MODAL_SELECTOR).should('not.exist');

      const bunTop = cy.get('div > section:nth-child(2) > div');
      const main = cy.get('div > section:nth-child(2) > ul > div');
      const bunBottom = cy.get('div > section:nth-child(2) > div:nth-child(3)');

      bunTop.contains('Выберите булки');
      main.contains('Выберите начинку');
      bunBottom.contains('Выберите булки');
    });

    afterEach(() => {
      cy.clearAllCookies();
      localStorage.removeItem('refreshToken');
    });
  });
});
