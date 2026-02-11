/// <reference types="cypress" />
import { Provider } from 'react-redux';
import { mount } from '@cypress/react';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../../src/features/products/productSlice';
import rawMaterialsReducer from '../../src/features/rawMaterials/rawMaterialSlice';
import AssociationsPage from '../../src/components/AssociationsPage';
import toast from 'react-hot-toast';

describe('Associations Page Integration Tests (Mocked)', () => {
  let store;

  const productsMock = [
    { id: 1, name: 'Test Product 1' },
    { id: 2, name: 'Test Product 2' },
  ];

  const rawMaterialsMock = [
    { id: 1, name: 'Steel' },
    { id: 2, name: 'Copper' },
  ];

  const associationsMock = [
    { id: 1, rawMaterialId: 1, rawMaterialName: 'Steel', requiredQuantity: 5 },
  ];

  beforeEach(() => {
    // Criar store mockado com estados iniciais
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

    // Mockar fetch das associações por produto
    cy.intercept('GET', /\/products\/\d+\/raw-materials/, {
      statusCode: 200,
      body: associationsMock,
    }).as('getProductAssociations');

    // Montar a página com Redux Provider
    mount(
      <Provider store={store}>
        <AssociationsPage />
      </Provider>
    );

    // Esperar o fetch de associações
    cy.wait('@getProductAssociations');
  });

  it('should create a new association', () => {
    cy.get('[data-cy=assoc-product]').should('not.be.disabled').select('1');
    cy.get('[data-cy=assoc-material]').should('not.be.disabled').select('1');
    cy.get('[data-cy=assoc-quantity]').type('10');
    cy.get('[data-cy=assoc-submit]').click();

    cy.contains('Quantity: 10').should('exist');
  });

  it('should edit an existing association', () => {
    cy.contains('button', 'Edit').first().click();
    cy.get('[data-cy=assoc-quantity]').clear().type('20');
    cy.get('[data-cy=assoc-submit]').click();

    cy.contains('Quantity: 20').should('exist');
  });

  it('should delete an association', () => {
    cy.contains('button', 'Delete').first().click();
    cy.contains('Quantity: 20').should('not.exist');
  });

it('should show error if trying to submit empty form', () => {
  const toastSpy = cy.spy(toast, 'error');

  cy.get('[data-cy=assoc-product]').select('');
  cy.get('[data-cy=assoc-material]').select('');
  cy.get('[data-cy=assoc-quantity]').clear();
  cy.get('[data-cy=assoc-submit]').click();

  // Confirma que o toast foi chamado
  cy.wrap(toastSpy).should('be.calledWith', 'Fill all fields');
});

});
