import React, { useState } from "react";
import styles from "../../Styles/Style";
import { Link } from "react-router-dom";
import ProductReview from "./ProductReview";
import { motion } from "framer-motion";

const ProductDetailsInfo = ({ data }) => {
  const [active, setActive] = useState(1);
  
  // Animation variants for consistent transitions
  const contentVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md mt-10 overflow-hidden">
      {/* Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-center bg-gradient-to-r from-gray-50 to-red-50">
        <TabButton 
          label="Product Details" 
          isActive={active === 1} 
          onClick={() => setActive(1)} 
        />
        <TabButton 
          label="Product Reviews" 
          isActive={active === 2} 
          onClick={() => setActive(2)} 
        />
        {/* <TabButton 
          label="Seller Information" 
          isActive={active === 3} 
          onClick={() => setActive(3)} 
        /> */}
      </div>

      {/* Content Container */}
      <div className="px-6 py-8">
        {/* Product Details Content */}
        {active === 1 && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4 }}
            className="prose max-w-none"
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          </motion.div>
        )}

        {/* Reviews Content */}
        {active === 2 && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4 }}
          >
            {data.ProductReview && data.ProductReview.length > 0 ? (
              data.ProductReview.map((item, index) => (
                <ProductReview
                  key={index}
                  authorName={item.user.name}
                  comment={item.comment}
                  stars={item.stars}
                  publishDate={new Date(item.createdAt).toLocaleDateString()}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Seller Information Content */}
        {active === 3 && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row gap-8"
          >
            {/* Seller Profile */}
            <div className="w-full md:w-1/2">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-100">
                  <img
                    src={data.shop.shop_avatar.url}
                    alt="Shop avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">{data.shop.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`w-4 h-4 ${
                            star <= Math.floor(data.shop.ratings) 
                              ? "text-yellow-400" 
                              : "text-gray-300"
                          }`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600 text-sm">
                      ({data.shop.ratings})
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-gray-600 leading-relaxed">
                Professional seller with high-quality products and excellent customer service.
                We pride ourselves on fast shipping and responsive support to ensure
                your complete satisfaction with every purchase.
              </p>
            </div>

            {/* Seller Stats */}
            <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Seller Statistics</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Joined on</span>
                  <span className="font-medium">21 May, 2023</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-medium">200</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-medium">486</span>
                </div>
              </div>
              
              <Link to={`/shop/${data.shop._id}`}>
                <button className="w-full mt-6 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors font-medium">
                  Visit Shop
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`relative px-6 py-4 text-center w-full sm:w-auto transition-all ${
      isActive 
        ? "text-[#FF4081] font-semibold" 
        : "text-gray-600 hover:text-gray-800"
    }`}
  >
    {label}
    {isActive && (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        className="absolute bottom-0 left-0 h-1 bg-[#FF4081] rounded-full transition-all duration-300"
      />
    )}
  </button>
);

export default ProductDetailsInfo;