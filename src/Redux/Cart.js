import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
     summary: null,
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i.id === item.id);
      if (isItemExist) {
        state.cart = state.cart.map((i) =>
          i.id === isItemExist.id ? item : i
        );
      } else {
        state.cart.push(item);
      }
    })
    .addCase("removeFromCart", (state, action) => {
      state.cart = state.cart.filter((i) => i.id !== action.payload);
    })
    .addCase("loadCartFromAPI", (state, action) => {
      state.cart = action.payload;
    })
        .addCase("updateCartSummary", (state, action) => {
      state.summary = action.payload; // ✅ Handle summary update
    })


    
    .addCase("CLEAR_CART", (state) => {
      state.cart = [];
    });
});
