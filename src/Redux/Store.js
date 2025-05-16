import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "./Cart";
import { wishlistReducer } from "./Wishlist";

import { categoryReducer } from "./CategoryReducer";
import addressReducer from "./AddressAction";

const Store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    category: categoryReducer,
    address: addressReducer,

  },
});

export default Store;
