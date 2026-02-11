/// <reference types="cypress" />
import { Provider } from 'react-redux';
import { mount } from '@cypress/react';
import { configureStore } from '@reduxjs/toolkit';
import rawMaterialsReducer from '../../src/features/rawMaterials/rawMaterialSlice';
import RawMaterialPage from '../../src/features/rawMaterials/RawMaterialPage';

describe('Raw Material Page Integration Tests (Mocked)', () => {
  let store;

  const rawMaterialsMock = [
    { id: 1, code: 'RM01', name: 'Steel', quantityInStock: 100 },
    { id: 2, code: 'RM02', name: 'Plastic', quantityInStock: 50 },
  ];

  beforeEach(() => {
    // Criar store mockada
    store = configureStore({
      reducer: {
        rawMaterials: rawMaterialsReducer,
      },
      preloadedState: {
        rawMaterials: { rawMaterials: rawMaterialsMock },
      },
    });

    // Interceptações de API mockadas
    cy.intercept('GET', '/raw-materials', { statusCode: 200, body: rawMaterialsMock }).as('getRawMaterials');
    cy.intercept('POST', '/raw-materials', { statusCode: 201 }).as('createRawMaterial');
    cy.intercept('PUT', '/raw-materials/*', { statusCode: 200 }).as('updateRawMaterial');
    cy.intercept('DELETE', '/raw-materials/*', { statusCode: 204 }).as('deleteRawMaterial');

    // Montar página com Redux Provider
    mount(
      <Provider store={store}>
        <RawMaterialPage />
      </Provider>
    );

    cy.wait('@getRawMaterials');
  });

  // --- Testes de exibição ---
  it('should render the page title and list raw materials', () => {
    cy.get('.page-title').should('contain.text', 'Raw Materials');

    cy.get('.item-list .item-item').should('have.length', 2);
    cy.get('.item-item').first().should('contain.text', 'Steel');
    cy.get('.item-item').last().should('contain.text', 'Plastic');
  });

  // --- Testes de edição ---
  it('should populate the form when editing a raw material', () => {
    cy.get('.item-item').first().within(() => {
      cy.contains('button', 'Edit').click();
    });

    cy.get('input[name=code]').should('have.value', 'RM01');
    cy.get('input[name=name]').should('have.value', 'Steel');
    cy.get('input[placeholder="0"]').should('have.value', '100');

    cy.get('input[name=name]').clear().type('Steel Updated');
    cy.get('button').contains('Update Material').click();

    cy.wait('@updateRawMaterial');
  });

  // --- Testes de criação ---
  it('should create a new raw material', () => {
    cy.get('input[name=code]').clear().type('RM03');
    cy.get('input[name=name]').clear().type('Copper');
    cy.get('input[placeholder="0"]').clear().type('25');

    cy.get('button').contains('Save Material').click();
    cy.wait('@createRawMaterial');
  });

  // --- Testes de cancelamento ---
  it('should cancel editing', () => {
    cy.get('.item-item').first().within(() => {
      cy.contains('button', 'Edit').click();
    });

    cy.get('button').contains('Cancel').click();

    cy.get('input[name=code]').should('have.value', '');
    cy.get('input[name=name]').should('have.value', '');
    cy.get('input[placeholder="0"]').should('have.value', '');
  });

  // --- Testes de exclusão ---
  it('should delete a raw material', () => {
    cy.get('.item-item').first().within(() => {
      cy.contains('button', 'Delete').click();
    });

    cy.on('window:confirm', () => true);
    cy.wait('@deleteRawMaterial');
  });

  // --- Testes de validação ---
  it('should not allow empty code', () => {
    cy.get('input[name=name]').clear().type('Iron');
    cy.get('input[placeholder="0"]').clear().type('10');

    cy.get('button').contains('Save Material').click();
    cy.get('[data-cy=error-code]').should('contain.text', 'Code is required');
  });

  it('should not allow empty name', () => {
    cy.get('input[name=code]').clear().type('RM04');
    cy.get('input[placeholder="0"]').clear().type('10');

    cy.get('button').contains('Save Material').click();
    cy.get('[data-cy=error-name]').should('contain.text', 'Name is required');
  });

});
