import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import ReactImageMagnify from "react-image-magnify";
import ProductDetailsInfo from "./ProductDetailsInfo.jsx";
import { addToWishlist, removeFromWishlist } from "../../Redux/WishlistAction";
import { addTocart } from "../../Redux/CartAction";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/Style.js";

const ProductDetails = ({ data }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL_IMAGE;
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [count, setCount] = useState(1);
  const [select, setSelect] = useState(0);
  const [click, setClick] = useState(false);
  const navigator = useNavigate();

  const userToken = Cookies.get("userToken");
  // State for selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Better data extraction with fallbacks
  const product = React.useMemo(() => {
    const variant = data?.variants?.[0] || {};

    // Extract all possible attribute options from variants
    const attributeOptions = {};
    if (data?.variants) {
      data.variants.forEach((variant) => {
        if (variant.attributes) {
          variant.attributes.forEach((attr) => {
            if (!attributeOptions[attr.key]) {
              attributeOptions[attr.key] = [];
            }
            if (!attributeOptions[attr.key].includes(attr.value)) {
              attributeOptions[attr.key].push(attr.value);
            }
          });
        }
      });
    }

    return {
      id: data?.id,
      name: data?.name || "Product Name",
      description: data?.description || "No description available",
      price: parseFloat(variant?.originalPrice || variant?.price || 0).toFixed(
        2
      ),
      discount_price: parseFloat(variant?.price || 0).toFixed(2),
      stock: variant?.stock || 0,
      // image_Url: (variant?.images || []).map((url) => ({ url })),
      // image_Url: variant?.images ? variant.images.map((url) => ({ url })) : [],
      image_Url: variant?.images ? variant.images.map((url) => ({ url })) : [],
      shop: {
        name: data?.vendor?.name || "Shop",
        shop_avatar: {
          url: data?.vendor?.avatar || "/default-avatar.png",
        },
      },
      rating: data?.rating || 0,
      reviewCount: data?.reviewCount || 0,
      attributes: variant?.attributes || [],
      attributeOptions,
      variants: data?.variants || [],
    };
  }, [data]);

  // Initialize selected attributes with default values from first variant
  useEffect(() => {
    if (product.attributes.length > 0) {
      const initialAttributes = {};
      product.attributes.forEach((attr) => {
        initialAttributes[attr.key] = attr.value;
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [product.attributes]);

  // Find the matching variant based on selected attributes
  const findMatchingVariant = () => {
    if (!product.variants || product.variants.length === 0) return null;

    // Convert selectedAttributes to a format that can be compared
    const selectedAttrKeys = Object.keys(selectedAttributes);

    return product.variants.find((variant) => {
      if (!variant.attributes) return false;

      // Check if all selected attributes match this variant
      return selectedAttrKeys.every((key) => {
        const attrMatch = variant.attributes.find(
          (attr) => attr.key === key && attr.value === selectedAttributes[key]
        );
        return !!attrMatch;
      });
    });
  };

  // Update product details when selected attributes change
  useEffect(() => {
    const matchingVariant = findMatchingVariant();
    if (matchingVariant) {
      // Reset count if new variant has less stock
      if (matchingVariant.stock < count) {
        setCount(1);
      }
    }
  }, [selectedAttributes]);

  const handleAttributeChange = (key, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const incrementCount = () => {
    const currentVariant = findMatchingVariant() || product;
    if (count < currentVariant.stock) {
      setCount(count + 1);
    } else {
      toast.warning(`Only ${currentVariant.stock} items in stock`);
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const addToCartHandler = () => {
    if (!userToken) {
      toast.error("Please login to add items to cart");
      navigator("/login");
      return;
    }
    if (count <= 0) {
      toast.error("Please select a valid quantity");
      return;
    }
    if (product.stock === 0) {
      toast.error("Product out of stock");
      return;
    }

    const currentVariant = findMatchingVariant() || product;

    const isItemExists = cart?.find((item) => {
      // Check for both id match and attributes match
      if (item?.id !== currentVariant.id) return false;

      // Check attributes match
      const attrKeys = Object.keys(selectedAttributes);
      return attrKeys.every(
        (key) => item.attributes[key] === selectedAttributes[key]
      );
    });

    if (isItemExists) {
      toast.error("Item already exists in cart");
    } else {
      if (currentVariant.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = {
          ...product,
          id: currentVariant.id,
          price: parseFloat(
            currentVariant?.originalPrice || currentVariant?.price || 0
          ).toFixed(2),
          discount_price: parseFloat(currentVariant?.price || 0).toFixed(2),
          stock: currentVariant.stock,
          image_Url: currentVariant.images
            ? currentVariant.images.map((url) => ({ url }))
            : product.image_Url,
          qty: count,
          variantId: currentVariant.id,
          attributes: { ...selectedAttributes },
        };

        dispatch(addTocart(cartData));
        // toast.success("Item added to cart");
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((item) => item?.id === product?.id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, product?.id]);

  const toggleWishlist = () => {
    if (click) {
      setClick(false);
      dispatch(removeFromWishlist(product));
      toast.success("Removed from wishlist");
    } else {
      setClick(true);
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  // Check if product has images
  const hasImages = product.image_Url && product.image_Url.length > 0;

  // Get current variant for stock and price info
  const currentVariant = findMatchingVariant() || product;

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  console.log("55555555555", baseUrl);

  return (
    <div className="bg-white">
      {hasImages ? (
        <div className="w-[95%] md:w-[90%] lg:w-[80%] mx-auto py-5">
          <div className="w-full py-5">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Image Section */}
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="hidden md:block"
                >
                  <ReactImageMagnify
                    {...{
                      smallImage: {
                        alt: product.name,
                        isFluidWidth: true,
                        src: baseUrl + product.image_Url[select]?.url,
                      },
                      largeImage: {
                        src: baseUrl + product.image_Url[select]?.url,
                        width: 1200,
                        height: 1800,
                      },
                      enlargedImageContainerDimensions: {
                        width: "150%",
                        height: "150%",
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="md:hidden mx-auto w-full"
                >
                  {/* <img
                    src={product.image_Url[select]?.url}
                    alt={product.name}
                    className="w-full object-contain h-[300px]"
                  /> */}
                  <img
                    src={baseUrl + product.image_Url[select]?.url}
                    alt={product.name + "23123123"}
                    className="w-full object-contain h-[300px]"
                  />
                </motion.div>

                {/* Thumbnail Gallery */}
                {product.image_Url.length > 1 && (
                  <div className="w-full overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 mt-4 min-w-max">
                      {product.image_Url?.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 * index }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`${
                            select === index
                              ? "border-2 border-emerald-500"
                              : "border border-gray-200"
                          } cursor-pointer rounded overflow-hidden h-[80px] w-[80px]`}
                          onClick={() => setSelect(index)}
                        >
                          {/* <img
                          // ${baseUrl}${bannerData.imgUrl}
                            src={image.url}
                            alt={`product-view-${index}`}
                            className="h-full w-full object-cover"
                          /> */}

                          <img
                            src={`${baseUrl}${image.url}`}
                            alt={`product-view-${index}`}
                            className="h-full w-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full md:w-1/2"
              >
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {product.name}
                  </h1>
                  <button
                    onClick={toggleWishlist}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={
                      click ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    {click ? (
                      <AiFillHeart size={28} className="text-red-500" />
                    ) : (
                      <AiOutlineHeart size={28} className="text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Pricing */}
                <div className="flex items-end gap-2 mt-3">
                  <h4 className="text-2xl font-bold text-emerald-600">
                    ${currentVariant.discount_price || currentVariant.price}
                  </h4>
                  {currentVariant.price !== currentVariant.discount_price && (
                    <h3 className="text-lg line-through text-gray-500">
                      ${currentVariant.price}
                    </h3>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        {i < Math.floor(product.stars) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <p className="text-gray-600">{product.description}</p>
                </div>

                {/* Stock Status */}
                <div className="mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentVariant.stock > 10
                        ? "bg-green-100 text-green-800"
                        : currentVariant.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentVariant.stock > 10
                      ? "In Stock"
                      : currentVariant.stock > 0
                      ? `Only ${currentVariant.stock} left`
                      : "Out of Stock"}
                  </span>
                </div>

                {/* Attribute Selector */}
                {Object.keys(product.attributeOptions).length > 0 && (
                  <div className="mt-6 space-y-4">
                    <p className="text-gray-800 font-medium">Select Options:</p>

                    {Object.entries(product.attributeOptions).map(
                      ([key, values]) => (
                        <div key={key} className="space-y-2">
                          <p className="text-sm text-gray-600 capitalize">
                            {key}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {values.map((value) => (
                              <button
                                key={`${key}-${value}`}
                                onClick={() =>
                                  handleAttributeChange(key, value)
                                }
                                className={`px-3 py-2 text-sm rounded border ${
                                  selectedAttributes[key] === value
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-6">
                  <p className="text-gray-700 mb-2">Quantity</p>
                  <div className="flex items-center">
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-l bg-gray-200 hover:bg-gray-300 transition-colors"
                      onClick={decrementCount}
                      disabled={count <= 1}
                    >
                      <span className="text-xl font-medium">-</span>
                    </button>
                    <div className="w-14 h-10 flex items-center justify-center bg-gray-100">
                      {count}
                    </div>
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-r bg-gray-200 hover:bg-gray-300 transition-colors"
                      onClick={incrementCount}
                      disabled={count >= currentVariant.stock}
                    >
                      <span className="text-xl font-medium">+</span>
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  className={`mt-6 w-full py-3 px-6 rounded bg-[#C51162] hover:bg-[#FF4081] text-white font-medium flex items-center justify-center transition-colors ${
                    currentVariant.stock === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={addToCartHandler}
                  disabled={currentVariant.stock === 0}
                >
                  <AiOutlineShoppingCart className="mr-2" size={20} />
                  {currentVariant.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                {/* Vendor Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      {/* <img
                        src={product.shop.shop_avatar.url}
                        alt={product.shop.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      /> */}
                      <img
                        src="/user.png"
                        alt={product.shop.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />

                      <div className="ml-3">
                        <h3 className="font-medium">{product.shop.name}</h3>
                        <p className="text-sm text-gray-500">Verified Seller</p>
                      </div>
                    </div>

                    <button className="px-4 py-2 border border-[#FF4081] text-[#FF4081] hover:bg-purple-50 rounded flex items-center justify-center transition-colors">
                      <AiOutlineMessage className="mr-2" size={18} />
                      Contact Seller
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={true}
              theme="light"
            />
          </div>

          {/* Product Details Info Component */}
          <ProductDetailsInfo data={data} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-gray-500">No product images available</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
