import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import rawMaterialReducer from "../features/rawMaterials/rawMaterialSlice";
import productionReducer from "../features/production/productionSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    rawMaterials: rawMaterialReducer,
    production: productionReducer
  }
});
