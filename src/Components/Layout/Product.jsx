import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

// Icons
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoMdFlash } from "react-icons/io";
import { BsArrowRight } from "react-icons/bs";

// Components & Styles
import ProductDetailsCart from "./ProductDetailsCart";
import styles from "../../Styles/Style";
import { removeFromWishlist, addToWishlist } from "../../Redux/WishlistAction";
import { addTocart } from "../../Redux/CartAction";

const Product = ({ data }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const variant = data?.variants?.[0];
  const imageUrl = variant?.images?.[0]
    ? `${import.meta.env.VITE_BASE_URL_IMAGE}${variant.images[0]}`
    : "https://res.cloudinary.com/duajvpvod/image/upload/v1747382367/images_1_exzmei.png";
  const price = variant?.price || 0;

  useEffect(() => {
    setClick(wishlist?.some((item) => item.id === data?.id));
  }, [wishlist, data?.id]);

  const handleWishlistToggle = () => {
    if (!data || !data.id) {
      toast.error("Invalid product data.");
      return;
    }

    if (click) {
      dispatch(removeFromWishlist(data));
      toast.info("Removed from wishlist.");
    } else {
      dispatch(addToWishlist(data));
      toast.success("Added to wishlist.");
    }

    setClick(!click);
  };

  const handleAddToCart = () => {
    if (!data || !data.id || !variant) {
      toast.error("Product or variant data is missing.");
      return;
    }

    const isItemExists = cart?.some((item) => item.id === data.id);
    if (isItemExists) {
      toast.warn("Item already in cart.");
      return;
    }

    const attributesObject = Array.isArray(variant.attributes)
      ? variant.attributes.reduce((acc, attr) => {
          if (attr.key && attr.value) acc[attr.key] = attr.value;
          return acc;
        }, {})
      : {};

    const cartData = {
      id: data.id,
      name: data.name,
      variantId: variant.id,
      price: variant.price,
      quantity: 1,
      image: variant.images?.[0]
        ? `${import.meta.env.VITE_BASE_URL_IMAGE}${variant.images[0]}`
        : "",
      attributes: attributesObject,
    };

    if (!cartData.variantId || !cartData.price || !cartData.quantity) {
      toast.error("Missing essential cart item data.");
      return;
    }

    dispatch(addTocart(cartData));
  };

  return (
    <Link to={`/product/${data?.id || "product"}`}>
    <motion.div
      className="bg-white rounded-xl overflow-hidden w-full max-w-xs relative group transition-all duration-300 shadow-sm hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
          <IoMdFlash className="text-indigo-600" />
          New Arrival
        </span>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 bg-white p-1.5 rounded-full shadow-md transition-transform hover:scale-110"
      >
        {click ? (
          <AiFillHeart size={18} className="text-red-500" />
        ) : (
          <AiOutlineHeart size={18} className="text-gray-600" />
        )}
      </button>

      {/* Image Container */}
      <div className="relative overflow-hidden h-56">
        <Link to={`/product/${data?.id || "product"}`}>
          <motion.img
            src={imageUrl || data?.image}
            alt={data?.name || "Product Image"}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
            initial={false}
            animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
          />
        </Link>

        {/* Quick Actions Overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 transition-opacity duration-300"
          initial={false}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        >
          <div className="flex gap-3">
            <button
              onClick={() => setOpen(true)}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title="Quick view"
            >
              <AiOutlineEye size={20} className="text-gray-700" />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title="Add to cart"
            >
              <AiOutlineShoppingCart size={20} className="text-gray-700" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5 bg-green-50 px-2 py-0.5 rounded">
            <span className="font-medium text-green-700 text-sm">{data?.rating || "4.0"}</span>
            <AiFillStar size={14} className="text-green-500" />
          </div>
          <span className="text-gray-500 text-xs">
            ({data?.reviews || "1000+"})
          </span>
          <span className="ml-auto text-xs font-medium text-green-600">Free Delivery</span>
        </div>

        {/* Product Name */}
        <Link to={`/product/${data?.id || "product"}`}>
          <h3 className="font-medium text-gray-800 line-clamp-2 hover:text-indigo-600 transition-colors mb-2">
            {data?.name || "Product Name"}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">₹{price}</span>
            <span className="text-xs text-gray-500 line-through">₹{Math.round(price * 1.2)}</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-[#C51162] hover:bg-[#FF4081] text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm font-medium transition-colors"
          >
            Add
            <BsArrowRight size={14} />
          </motion.button>
        </div>
      </div>

      {open && <ProductDetailsCart setOpen={setOpen} data={data} />}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="light"
      />
    </motion.div>
    </Link>
  );
};

export default Product;