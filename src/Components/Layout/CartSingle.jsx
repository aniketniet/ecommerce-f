import React, { useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import {
  updateQuantityAPI,
  clearCart,
  getCartItems,
} from "../../Redux/CartAction";

const CartSingle = ({ data }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("token");
  const totalPrice = data.discount_price * data.quantity;

  // const handleClearCart = () => {
  //   if (window.confirm("Are you sure you want to clear the cart?")) {
  //     dispatch(clearCart());
  //   }
  // };

  const handleQuantityChange = async (action) => {
    if (action === "increment" && data.quantity >= data.stock) {
      toast.error("Product stock limited!");
      return;
    }
    if (action === "decrement" && data.quantity <= 1) return;

    setIsLoading(true);
    const success = await updateQuantityAPI(data.cartItemId, action);

    if (success) {
      toast.success("Quantity updated!");
      dispatch(getCartItems()); // Fetch latest cart with updated quantity
    } else {
      toast.error("Failed to update quantity.");
    }

    setIsLoading(false);
  };

  return (
    <div className="border border-gray-100 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 w-full">
        {/* Product Image and Info */}
        <div className="flex items-center gap-4 w-full sm:w-2/3">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-100 flex-shrink-0">
            <img
              src={`${import.meta.env.VITE_BASE_URL_IMAGE}${data?.images?.[0]}`}
              alt={data.productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
                e.target.onerror = null;
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 text-lg truncate">
              {data.productName}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Qty: {data.quantity}</p>
            <p className="font-bold text-green-600 text-lg mt-1">
              ${data.itemTotal || totalPrice.toFixed(2)}
            </p>
            {data.discount_price < data.original_price && (
              <p className="line-through text-sm text-gray-400">
                ${(data.original_price * data.quantity).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Quantity & Remove */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange("decrement")}
              disabled={isLoading || data.quantity <= 1}
              className={`px-3 py-2 text-gray-600 transition hover:text-blue-500 ${
                isLoading || data.quantity <= 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Decrease quantity"
            >
              <HiMinus size={18} />
            </button>

            <span className="px-4 py-2 font-semibold text-gray-800 text-lg text-center min-w-[2rem]">
              {isLoading ? "..." : data.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange("increment")}
              disabled={isLoading || data.quantity >= data.stock}
              className={`px-3 py-2 text-gray-600 transition hover:text-blue-500 ${
                isLoading || data.quantity >= data.stock
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Increase quantity"
            >
              <HiPlus size={18} />
            </button>
          </div>

          {/* Remove Button */}
          {/* <button
            onClick={handleClearCart}
            className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
            aria-label="Remove item"
          >
            <RxCross1 size={20} />
          </button> */}
        </div>
      </div>

      {/* Stock Warning */}
      {data.stock <= 5 && (
        <p className="mt-3 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
          ⚠️ Only {data.stock} left in stock!
        </p>
      )}

      {/* ToastContainer removed from here; place it once in your App or Layout component */}
    </div>
  );
};

export default CartSingle;
