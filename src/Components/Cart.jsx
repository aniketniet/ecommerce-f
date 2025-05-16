import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../Styles/Style";
import CartSingle from "./Layout/CartSingle";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCartItems, addTocart, clearCart } from "../Redux/CartAction";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

const Cart = ({ setOpenCart }) => {
  const dispatch = useDispatch();
  const isAuthenticated = Cookies.get("userToken");
  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      dispatch(clearCart());
    }
  };

  // Handle empty cart early return
  if (!cart || cart.length === 0) {
    return (
      <div className="w-full fixed h-screen left-0 top-0 z-50 bg-[#0000006b]">
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 right-0 h-full w-[80%] sm:w-[60%] md:w-[30%] flex flex-col justify-center items-center shadow-sm bg-white"
        >
          <div className="absolute top-4 right-4">
            <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
          </div>
          <h5 className="text-lg font-medium">Cart is empty!</h5>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full fixed h-screen left-0 top-0 z-50 bg-[#0000006b]">
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 right-0 h-full w-[80%] sm:w-[60%] md:w-[30%] flex flex-col justify-between shadow-sm bg-white overflow-y-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <div>
          {/* Close Cart Button */}
          <div className="flex justify-end items-center p-4">
            <RxCross1 size={20} className="cursor-pointer" onClick={() => setOpenCart(false)} />
          </div>

          {/* Cart Header */}
          <div className={`${styles.noramlFlex} p-4`}>
            <IoBagHandleOutline size={25} />
            <h5 className="pl-3 font-[500] text-[17px]">{cart.length} Items</h5>

            <button
              onClick={handleClearCart}
              className="ml-auto p-2 rounded-md text-sm  text-[#C51162]  transition"
              aria-label="Clear cart"
              title="Clear cart"
            >
              Clear
            </button>
          </div>

          {/* Cart Items List */}
          <div className="w-full border-t">
            {cart.map((item, index) => (
              <CartSingle
                data={item}
                key={item.cartItemId || index}
                quantityChangeHanlder={quantityChangeHandler}
              />
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="px-3 mb-3 mt-7">
          <Link to={isAuthenticated ? "/checkout" : "/sign-up"}>
            <button className="rounded-[5px] flex items-center justify-center w-full bg-[#C51162] h-[45px] text-white">
              Checkout Now {totalPrice.toFixed(2)}
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
