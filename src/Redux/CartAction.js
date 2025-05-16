import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";



// Add to Cart API Action
export const addTocart = (data) => async (dispatch, getState) => {
  const token = Cookies.get("userToken");
  // console.log(data, "data in addToCart");
  try {
    // Send API request to add item to cart
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/web/add-to-cart`, {
      variantId: data.variantId,
      quantity: data.qty || 1,
      attributes: data.attributes,
    }, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
        'Content-Type': 'application/json',
      },
    });

    // Update Redux state
    dispatch({
      type: "addToCart",
      payload: data,
    });

    // Store updated cart in localStorage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));

    // toast.success("Item added to cart!");
    alert("Item added to cart!");
    
    return response.data; // Return response if needed
  } catch (error) {
    console.error("Error adding item to cart:", error);
    toast.error("Failed to add item to cart.");
  }
};


// Redux/CartAction.js

export const getCartItems = () => async (dispatch) => {
  const token = Cookies.get("userToken");
  
  
  if (!token) {
    console.log("No authentication token found");
    toast.error("Please log in to view your cart");
    return;
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/web/get-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    dispatch({
      type: "loadCartFromAPI",
      payload: response.data.items,
    });

       // Dispatch cart summary if present
    if (response.data.summary) {
      dispatch({
        type: "updateCartSummary",
        payload: response.data.summary,
      });
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      
      Cookies.remove("userToken");
     
    } else {
      toast.error("Failed to load cart.");
    }
  }
};

export const updateQuantityAPI = async (id, action) => {
  const token = Cookies.get("userToken");

  if (!token) {
    toast.error("You are not logged in. Please log in again.");
    return false;
  }

  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/web/quantity-update/${id}`,
      { action },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

 
    if (response.status === 200) {
      toast.success("Quantity updated successfully!");
      
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error updating quantity:", error);
    toast.error(
      error.response?.data?.message || "Failed to update quantity"
    );
    return false;
  }
};


// Redux/CartAction.js
export const clearCart = () => async (dispatch, getState) => {
  const token = Cookies.get("userToken");

  if (!token) {
    toast.error("You are not logged in. Please log in.");
    return;
  }

  try {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/web/clear-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Clear cart in Redux
    dispatch({ type: "CLEAR_CART" });

    // Remove from localStorage
    localStorage.removeItem("cartItems");

    toast.success("Cart cleared successfully!");
  } catch (error) {
    console.error("Error clearing cart:", error);
    toast.error("Failed to clear cart.");
  }
};

