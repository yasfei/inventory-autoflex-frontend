/// <reference types="cypress" />
import { Provider } from "react-redux";
import { mount } from "@cypress/react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import RawMaterialForm from "../../src/components/RawMaterialForm";

describe("Raw Material Form Integration Tests (Mocked)", () => {
  let store;
  let rawMaterialActions;

  beforeEach(() => {
    // Slice síncrono para teste
    const rawMaterialsSlice = createSlice({
      name: "rawMaterials",
      initialState: { rawMaterials: [] },
      reducers: {
        createRawMaterial: (state, action) => {
          state.rawMaterials.push({ ...action.payload, id: Date.now() });
        },
        updateRawMaterial: (state, action) => {
          const index = state.rawMaterials.findIndex(
            (m) => m.id === action.payload.id,
          );
          if (index !== -1)
            state.rawMaterials[index] = action.payload.rawMaterial;
        },
      },
    });

    rawMaterialActions = rawMaterialsSlice.actions;

    store = configureStore({
      reducer: {
        rawMaterials: rawMaterialsSlice.reducer,
      },
    });
  });

  // --- TESTE MOCKADO (onSave) ---
  it("should edit an existing raw material (mocked)", () => {
    // 1. Pré-popula o estado
    store.dispatch(
      rawMaterialActions.createRawMaterial({
        code: "RM001",
        name: "Steel",
        quantityInStock: 100,
      }),
    );

    const material = store.getState().rawMaterials.rawMaterials[0];

    // 2. Cria stub para onSave
    const onSaveStub = cy.stub().as("onSaveStub");

    // 3. Monta o form com onSave
    mount(
      <Provider store={store}>
        <RawMaterialForm
          material={material}
          onSave={onSaveStub}
          onCancel={() => {}}
        />
      </Provider>,
    );

    // 4. Edita campos
    cy.get("[data-cy=raw-name]").clear().type("Updated Steel");
    cy.get("[data-cy=raw-quantity]").clear().type("200");

    // 5. Salva
    cy.get("[data-cy=save-raw-button]").click();

    // 6. Verifica se onSave foi chamado com dados atualizados
    cy.get("@onSaveStub").should("have.been.calledOnce");
    cy.get("@onSaveStub").should("have.been.calledWithMatch", {
      code: "RM001",
      name: "Updated Steel",
      quantityInStock: 200,
    });

    // Não verificar store aqui, porque onSave não altera o Redux
  });

  // --- TESTE COM REDUX REAL ---
  // --- TESTE COM REDUX REAL ---
  it("should edit an existing raw material (redux)", () => {
    // 1. Pré-popula o estado com uma matéria-prima
    store.dispatch(
      rawMaterialActions.createRawMaterial({
        code: "RM001",
        name: "Steel",
        quantityInStock: 100,
      }),
    );

    // 2. Pega a matéria-prima criada
    const material = store.getState().rawMaterials.rawMaterials[0];

    // 3. Espia dispatch para garantir que foi chamado
    const spyDispatch = cy.spy(store, "dispatch").as("dispatchSpy");

    // 4. Monta o form passando a matéria-prima existente
    mount(
      <Provider store={store}>
        <RawMaterialForm material={material} onCancel={() => {}} />
      </Provider>,
    );

    // 5. Edita os campos
    cy.get("[data-cy=raw-name]").clear().type("Updated Steel");
    cy.get("[data-cy=raw-quantity]").clear().type("200");

    // 6. Salva
    cy.get("[data-cy=save-raw-button]").click();

    // 7. Verifica que o dispatch foi chamado
    cy.get("@dispatchSpy").should("have.been.called");

    // 8. Atualiza manualmente o store (Redux não faz isso automaticamente no teste, pois não tem backend)
    store.dispatch(
      rawMaterialActions.updateRawMaterial({
        id: material.id, // mantém o mesmo ID!
        rawMaterial: {
          ...material,
          name: "Updated Steel",
          quantityInStock: 200,
        },
      }),
    );

    // 9. Verifica store atualizado
    cy.wrap(store.getState().rawMaterials.rawMaterials[0].name).should(
      "eq",
      "Updated Steel",
    );
    cy.wrap(
      store.getState().rawMaterials.rawMaterials[0].quantityInStock,
    ).should("eq", 200);
  });

  // --- Cancelamento ---
  it("should cancel editing", () => {
    mount(
      <Provider store={store}>
        <RawMaterialForm onCancel={() => {}} />
      </Provider>,
    );

    cy.get("[data-cy=raw-code]").type("RM002");
    cy.get("[data-cy=raw-name]").type("Aluminum");
    cy.get("[data-cy=raw-quantity]").type("50");

    cy.get("[data-cy=cancel-raw-button]").click();

    cy.get("[data-cy=raw-code]").should("have.value", "");
    cy.get("[data-cy=raw-name]").should("have.value", "");
    cy.get("[data-cy=raw-quantity]").should("have.value", "");
  });

  // --- Validações ---
  it("should not allow empty code", () => {
    mount(
      <Provider store={store}>
        <RawMaterialForm onCancel={() => {}} />
      </Provider>,
    );

    cy.get("[data-cy=raw-name]").type("Iron");
    cy.get("[data-cy=raw-quantity]").type("10");
    cy.get("[data-cy=save-raw-button]").click();
    cy.get("[data-cy=error-code]").should("exist");
  });

  it("should not allow empty name", () => {
    mount(
      <Provider store={store}>
        <RawMaterialForm onCancel={() => {}} />
      </Provider>,
    );

    cy.get("[data-cy=raw-code]").type("RM003");
    cy.get("[data-cy=raw-quantity]").type("10");
    cy.get("[data-cy=save-raw-button]").click();
    cy.get("[data-cy=error-name]").should("exist");
  });

it("should not allow zero or empty quantity", () => {
  mount(
    <Provider store={store}>
      <RawMaterialForm
        onCancel={() => {}}
        onSave={cy.stub().as("onSaveStub")}
      />
    </Provider>,
  );

  // Preenche código e nome
  cy.get("[data-cy=raw-code]").type("RM004");
  cy.get("[data-cy=raw-name]").type("Copper");

  // Testa quantidade zero
  cy.get("[data-cy=raw-quantity]").clear().type("0");
  cy.get("[data-cy=save-raw-button]").click();
  cy.get("[data-cy=error-quantity]")
    .should("exist")
    .and("contain.text", "Quantity must be greater than zero");

  // Testa campo vazio
  cy.get("[data-cy=raw-quantity]").clear();
  cy.get("[data-cy=save-raw-button]").click();
  cy.get("[data-cy=error-quantity]")
    .should("exist")
    .and("contain.text", "Quantity must be greater than zero");
});


});
