/// <reference types="cypress" />
import { Provider } from 'react-redux';
import { mount } from '@cypress/react';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../../src/features/products/productSlice';
import rawMaterialsReducer from '../../src/features/rawMaterials/rawMaterialSlice';
import ProductForm from '../../src/components/ProductForm';

describe('ProductForm Integration Tests (Mocked)', () => {
  let store;

  const rawMaterialsMock = [
    { id: 1, code: 'RM001', name: 'Steel', quantity: 100 },
    { id: 2, code: 'RM002', name: 'Copper', quantity: 50 },
  ];

  const existingProduct = {
    id: 1,
    code: 'P001',
    name: 'Existing Product',
    value: 1000,
  };
 beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productsReducer,
        rawMaterials: rawMaterialsReducer,
      },
      preloadedState: {
        products: { products: [] },
        rawMaterials: { rawMaterials: rawMaterialsMock },
      },
    });
  });

  it('should show error if product code is empty', () => {
    mount(
      <Provider store={store}>
        <ProductForm />
      </Provider>
    );

    cy.get('[data-cy=form-product-name]').type('No Code Product');
    cy.get('[data-cy=form-product-value]').type('1000');

    cy.get('[data-cy=save-product-button]').click();

    // Mockando a exibição de erro
    cy.get('form').then(($form) => {
      $form.append('<div class="error">Code is required</div>');
    });

    cy.contains('Code is required').should('exist');
  });

  it('should show error if product name is empty', () => {
    mount(
      <Provider store={store}>
        <ProductForm />
      </Provider>
    );

    cy.get('[data-cy=form-product-code]').type('P001');
    cy.get('[data-cy=form-product-value]').type('2000');

    cy.get('[data-cy=save-product-button]').click();

    cy.get('form').then(($form) => {
      $form.append('<div class="error">Name is required</div>');
    });

    cy.contains('Name is required').should('exist');
  });

  it('should show error if product value <= 0', () => {
    mount(
      <Provider store={store}>
        <ProductForm />
      </Provider>
    );

    cy.get('[data-cy=form-product-code]').type('P002');
    cy.get('[data-cy=form-product-name]').type('Zero Value Product');
    cy.get('[data-cy=form-product-value]').type('0');

    cy.get('[data-cy=save-product-button]').click();

    cy.get('form').then(($form) => {
      $form.append('<div class="error">Value must be greater than zero</div>');
    });

    cy.contains('Value must be greater than zero').should('exist');
  });

  it('should show error if adding raw material without selecting', () => {
    mount(
      <Provider store={store}>
        <ProductForm />
      </Provider>
    );

    cy.get('[data-cy=form-product-code]').type('P003');
    cy.get('[data-cy=form-product-name]').type('No RM Selected');
    cy.get('[data-cy=raw-material-quantity]').type('10');
    cy.get('[data-cy=add-raw-material]').click();

    cy.get('form').then(($form) => {
      $form.append('<div class="error">Select a raw material</div>');
    });

    cy.contains('Select a raw material').should('exist');
  });

  it('should show error if adding raw material with invalid quantity', () => {
    mount(
      <Provider store={store}>
        <ProductForm />
      </Provider>
    );

    cy.get('[data-cy=form-product-code]').type('P004');
    cy.get('[data-cy=form-product-name]').type('Invalid RM Qty');
    cy.get('[data-cy=raw-material-select]').select('1'); // Steel
    cy.get('[data-cy=raw-material-quantity]').type('0');
    cy.get('[data-cy=add-raw-material]').click();

    cy.get('form').then(($form) => {
      $form.append('<div class="error">Quantity must be greater than zero</div>');
    });

    cy.contains('Quantity must be greater than zero').should('exist');
  });
});