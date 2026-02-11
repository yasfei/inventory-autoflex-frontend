// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    framework: "react",
    bundler: "vite", // aqui usamos Vite em vez de webpack
    specPattern: "cypress/e2e/**/*.cy.js", // onde estão seus testes
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
