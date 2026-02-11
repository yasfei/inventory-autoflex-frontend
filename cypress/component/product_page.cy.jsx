/// <reference types="cypress" />
import { Provider } from 'react-redux';
import { mount } from '@cypress/react';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../../src/features/products/productSlice';
import rawMaterialsReducer from '../../src/features/rawMaterials/rawMaterialSlice';
import ProductPage from '../../src/features/products/ProductPage';

describe('Product Page Integration Tests (Mocked)', () => {
  let store;

  const productsMock = [
    {
      id: 1,
      code: 'P001',
      name: 'Chocolate',
      value: 5000,
      rawMaterials: [{ rawMaterialId: 2, rawMaterialName: 'Cocoa', requiredQuantity: 2 }],
    },
    {
      id: 2,
      code: 'P002',
      name: 'Vanilla',
      value: 3000,
      rawMaterials: [{ rawMaterialId: 1, rawMaterialName: 'Sugar', requiredQuantity: 5 }],
    },
    {
      id: 3,
      code: 'P003',
      name: 'Strawberry',
      value: 4000,
      rawMaterials: [],
    },
  ];

  const rawMaterialsMock = [
    { id: 1, code: 'RM001', name: 'Sugar', quantity: 100 },
    { id: 2, code: 'RM002', name: 'Cocoa', quantity: 50 },
  ];

  // --- Ignorar erro de fetch do React para não quebrar o teste ---
  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('Failed to fetch')) {
      return false; // ignora a exceção
    }
  });

  beforeEach(() => {
    // Criar store mockado
    store = configureStore({
      reducer: {
        products: productsReducer,
        rawMaterials: rawMaterialsReducer,
      },
      preloadedState: {
        products: { products: productsMock },
        rawMaterials: { rawMaterials: rawMaterialsMock },
      },
    });

    // Interceptações de API (mockadas)
    cy.intercept('GET', '/products', { statusCode: 200, body: productsMock }).as('getProducts');
    cy.intercept('GET', '/raw-materials', { statusCode: 200, body: rawMaterialsMock }).as('getRawMaterials');

    // Montar página com Redux Provider
    mount(
      <Provider store={store}>
        <ProductPage />
      </Provider>
    );

    // Espera pelos fetches mockados
    cy.wait(['@getProducts', '@getRawMaterials']);
  });

  // --- Testes de exibição na lista ---
  it('should display products in the list', () => {
    cy.get('.item-list [data-cy=list-product-name]').contains('Chocolate').should('exist');
    cy.get('.item-list [data-cy=list-product-name]').contains('Vanilla').should('exist');

    cy.get('.item-list [data-cy=list-product-cod]').contains('P001').should('exist');
    cy.get('.item-list [data-cy=list-product-cod]').contains('P002').should('exist');

    cy.get('.item-list [data-cy=list-product-value]').contains('R$ 5000.00').should('exist');
    cy.get('.item-list [data-cy=list-product-value]').contains('R$ 3000.00').should('exist');
  });

  // --- Testes de formulário (edição) ---
  it('should populate the form when editing a product', () => {
    cy.get('.item-list [data-cy=list-product-name]')
      .contains('Chocolate')
      .closest('li')
      .within(() => {
        cy.contains('button', 'Edit').click();
      });

    cy.get('[data-cy=form-product-name]').should('have.value', 'Chocolate');
    cy.get('[data-cy=form-product-code]').should('have.value', 'P001');
    cy.get('[data-cy=form-product-value]')
      .invoke('val')
      .then((val) => {
        const numeric = Number(val.replace(/\D/g, '')) / 100;
        expect(numeric).to.eq(5000);
      });
  });

  // --- Testes de validação de formulário ---
  it('should not allow adding product without code', () => {
    cy.get('[data-cy=form-product-name]').clear();
    cy.get('[data-cy=form-product-code]').clear();
    cy.get('[data-cy=form-product-value]').clear();

    cy.get('[data-cy=save-product-button]').click();

    cy.get('[data-cy=error-code]').should('contain.text', 'Code is required');
    cy.get('[data-cy=error-name]').should('contain.text', 'Name is required');
    cy.get('[data-cy=error-value]').should('contain.text', 'Value must be greater than zero');
  });

  it('should not allow adding product without name', () => {
    cy.get('[data-cy=form-product-code]').clear().type('P003');
    cy.get('[data-cy=form-product-value]').clear().type('1500');
    cy.get('[data-cy=save-product-button]').click();
    cy.contains('Name is required').should('exist');
  });

  it('should not allow product with value <= 0', () => {
    cy.get('[data-cy=form-product-code]').clear().type('P004');
    cy.get('[data-cy=form-product-name]').clear().type('Zero Value Product');
    cy.get('[data-cy=form-product-value]').clear().type('0');
    cy.get('[data-cy=save-product-button]').click();
    cy.contains('Value must be greater than zero').should('exist');
  });

  // --- Testes de associação de matérias-primas ---
  it('should not allow adding raw material without selecting', () => {
    cy.get('[data-cy=form-product-code]').clear().type('P005');
    cy.get('[data-cy=form-product-name]').clear().type('No RM Selected');
    cy.get('[data-cy=raw-material-quantity]').clear().type('10');

    cy.get('[data-cy=add-raw-material]').click();
    cy.get('[data-cy=error-raw-material]').should('contain.text', 'Select a raw material');
  });

  it('should not allow adding raw material with invalid quantity', () => {
    cy.get('[data-cy=form-product-code]').clear().type('P006');
    cy.get('[data-cy=form-product-name]').clear().type('Invalid RM Qty');
    cy.get('[data-cy=raw-material-select]').select('1');

    cy.get('[data-cy=raw-material-quantity]').clear().type('0');
    cy.get('[data-cy=add-raw-material]').click();
    cy.get('[data-cy=error-raw-material-qty]').should('contain.text', 'Quantity must be greater than zero');
  });
});
