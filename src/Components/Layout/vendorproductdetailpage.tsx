import React, { useEffect, useState, useMemo } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ReactImageMagnify from "react-image-magnify";
import { addToWishlist, removeFromWishlist } from "../../Redux/WishlistAction";
import { addTocart } from "../../Redux/CartAction";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const VendorProductDetails = ({ data }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL_IMAGE;
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  const [count, setCount] = useState(1);
  const [select, setSelect] = useState(0);
  const [click, setClick] = useState(false);
  const navigator = useNavigate();
  const userToken = Cookies.get("userToken");

  const [selectedAttributes, setSelectedAttributes] = useState({});

  const product = useMemo(() => {
    const variant = data?.variants?.[0] || {};

    const attributeOptions = {};

    data?.variants?.forEach((variant) => {
      variant.attributes?.forEach((attr) => {
        if (!attributeOptions[attr.key]) attributeOptions[attr.key] = [];
        if (!attributeOptions[attr.key].includes(attr.value)) {
          attributeOptions[attr.key].push(attr.value);
        }
      });
    });

    return {
      id: data?.id,
      name: data?.name || "Product Name",
      description: data?.description || "No description available",
      price: parseFloat(variant?.price || 0).toFixed(2),
      discount_price: parseFloat(variant?.price || 0).toFixed(2), // Assuming no discount price in API
      stock: variant?.stock || 0,
      image_Url: variant?.images?.map((url) => ({ url })) || [],
      shop: {
        name: data?.vendor?.name || "Shop",
        shop_avatar: {
          url: data?.vendor?.avatar || "/default-avatar.png",
        },
      },
      rating: 0, // Not in API response
      reviewCount: 0, // Not in API response
      attributes: variant?.attributes || [],
      attributeOptions,
      variants: data?.variants || [],
    };
  }, [data]);

  useEffect(() => {
    if (product.attributes.length > 0) {
      const initialAttributes = {};
      product.attributes.forEach((attr) => {
        initialAttributes[attr.key] = attr.value;
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [product.attributes]);

  const findMatchingVariant = () => {
    return product.variants.find((variant) => {
      return Object.entries(selectedAttributes).every(([key, value]) =>
        variant.attributes?.some(
          (attr) => attr.key === key && attr.value === value
        )
      );
    });
  };

  const currentVariant = findMatchingVariant() || product.variants[0] || {};

  useEffect(() => {
    if (currentVariant?.stock < count) {
      setCount(1);
    }
  }, [selectedAttributes]);

  const handleAttributeChange = (key, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const incrementCount = () => {
    if (count < currentVariant.stock) {
      setCount(count + 1);
    } else {
      toast.warning(`Only ${currentVariant.stock} items in stock`);
    }
  };

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const addToCartHandler = () => {
    if (!userToken) {
      toast.error("Please login to add items to cart");
      return navigator("/login");
    }

    if (currentVariant.stock === 0) {
      toast.error("Product out of stock");
      return;
    }

    const isItemExists = cart.find((item) => {
      if (item.id !== currentVariant.id) return false;
      return Object.entries(selectedAttributes).every(
        ([key, value]) => item.attributes?.[key] === value
      );
    });

    if (isItemExists) {
      toast.error("Item already exists in cart");
    } else if (currentVariant.stock < count) {
      toast.error("Product stock limited!");
    } else {
      const cartData = {
        ...product,
        id: currentVariant.id,
        price: parseFloat(currentVariant?.price || 0).toFixed(2),
        discount_price: parseFloat(currentVariant?.price || 0).toFixed(2),
        stock: currentVariant.stock,
        image_Url:
          currentVariant.images?.map((url) => ({ url })) || product.image_Url,
        qty: count,
        variantId: currentVariant.id,
        attributes: { ...selectedAttributes },
      };

      dispatch(addTocart(cartData));
      toast.success("Item added to cart");
    }
  };

  useEffect(() => {
    setClick(!!wishlist?.find((item) => item?.id === product?.id));
  }, [wishlist, product?.id]);

  const toggleWishlist = () => {
    if (click) {
      dispatch(removeFromWishlist(product));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
    setClick(!click);
  };

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="w-[95%] md:w-[90%] lg:w-[80%] mx-auto py-5">
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
                    src:
                      baseUrl +
                      (currentVariant.images?.[select] ||
                        product.image_Url[0]?.url),
                  },
                  largeImage: {
                    src:
                      baseUrl +
                      (currentVariant.images?.[select] ||
                        product.image_Url[0]?.url),
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
              <img
                src={
                  baseUrl +
                  (currentVariant.images?.[select] || product.image_Url[0]?.url)
                }
                alt={product.name}
                className="w-full object-contain h-[300px]"
              />
            </motion.div>
            {(currentVariant.images || product.image_Url)?.length > 1 && (
              <div className="w-full overflow-x-auto scrollbar-hide mt-4">
                <div className="flex gap-3 min-w-max">
                  {(currentVariant.images || product.image_Url).map(
                    (img, index) => (
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
                        <img
                          src={
                            baseUrl + (typeof img === "string" ? img : img.url)
                          }
                          alt={`product-thumb-${index}`}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
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
              <button onClick={toggleWishlist}>
                {click ? (
                  <AiFillHeart size={28} className="text-red-500" />
                ) : (
                  <AiOutlineHeart size={28} className="text-gray-600" />
                )}
              </button>
            </div>

            <div className="flex items-end gap-2 mt-3">
              <h4 className="text-2xl font-bold text-emerald-600">
                ${product.discount_price}
              </h4>
              {product.price !== product.discount_price && (
                <h3 className="text-lg line-through text-gray-500">
                  ${product.price}
                </h3>
              )}
            </div>

            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">
                  {i < Math.floor(product.rating) ? "★" : "☆"}
                </span>
              ))}
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <p className="mt-4 text-gray-600">{product.description}</p>

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

            {/* Attribute Options */}
            {Object.keys(product.attributeOptions).length > 0 && (
              <div className="mt-6 space-y-4">
                <p className="text-gray-800 font-medium">Select Options:</p>
                {Object.entries(product.attributeOptions).map(
                  ([key, values]) => (
                    <div key={key}>
                      <p className="text-sm text-gray-600 capitalize">{key}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {values.map((value) => (
                          <button
                            key={`${key}-${value}`}
                            onClick={() => handleAttributeChange(key, value)}
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

            {/* Quantity and Add to Cart */}
            {/* <div className="mt-6">
              <p className="text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                  onClick={decrementCount}
                >
                  -
                </button>
                <span className="w-10 text-center">{count}</span>
                <button
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                  onClick={incrementCount}
                >
                  +
                </button>
              </div>
              <button
                className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                onClick={addToCartHandler}
              >
                Add to Cart
              </button>
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VendorProductDetails;
