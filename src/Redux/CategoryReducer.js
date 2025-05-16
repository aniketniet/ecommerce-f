// src/redux/reducers/categoryReducer.js
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  subCategories: [],
  loading: false,
  error: null,
};

export const categoryReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("categoriesRequest", (state) => {
      state.loading = true;
    })
    .addCase("categoriesSuccess", (state, action) => {
        console.log("Categories fetched successfully:", action.payload);
      state.loading = false;
      state.categories = action.payload;
    })
    .addCase("categoriesFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("subCategoriesRequest", (state) => {
      state.loading = true;
    })
    .addCase("subCategoriesSuccess", (state, action) => {
      state.loading = false;
      state.subCategories = action.payload;
    })
    .addCase("subCategoriesFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});
