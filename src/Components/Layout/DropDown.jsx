import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DropDown = ({ categoriesData }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleMainCategoryHover = async (categoryId) => {
    if (categoryId === activeCategoryId) return;

    setActiveCategoryId(categoryId);
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/web/get-all-sub-category-by-main-category/${categoryId}`
      );
      setSubCategories(data.subCategories || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubCategoryClick = (subCategory) => {
    navigate(`/products?category=${subCategory.id}`);
    window.location.reload();
  };

  const handleMouseLeave = () => {
    setActiveCategoryId(null);
    setSubCategories([]);
  };

  // Get the active category object
  const activeCategory = categoriesData?.find((cat) => cat.id === activeCategoryId);

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      {/* Horizontal Category Bar */}
      <div className="flex items-center gap-4 px-6 py-3 overflow-x-auto">
        {categoriesData?.map((category) => (
          <div
            key={category.id}
            className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
              activeCategoryId === category.id ? "scale-110" : "hover:scale-105"
            }`}
            onMouseEnter={() => handleMainCategoryHover(category.id)}
          >
            <div 
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-sm transition-all duration-200 ${
                activeCategoryId === category.id 
                  ? "bg-pink-50 border-2 border-pink-400" 
                  : "bg-gray-50 hover:bg-pink-50"
              }`}
            >
              <img
                src={`${import.meta.env.VITE_BASE_URL_IMAGE}${category.imgUrl}`}
                alt={category.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <span 
              className={`text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                activeCategoryId === category.id ? "text-pink-600" : "text-gray-700 hover:text-pink-600"
              }`}
            >
              {category.name}
            </span>
          </div>
        ))}
      </div>

      {/* Subcategories Dropdown */}
      {activeCategoryId && (
        <div 
          className="absolute left-0 right-0 top-full z-50 bg-white shadow-lg rounded-b-lg border border-gray-100 py-4 animate-fadeIn"
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex">
                {/* Left side - Category highlight */}
                <div className="w-1/4 pr-6 border-r border-gray-100">
                  <div className="flex items-center mb-4">
                    {activeCategory && (
                      <>
                        <div className="w-16 h-16 rounded-lg bg-pink-50 p-3 flex items-center justify-center mr-4">
                          <img
                            src={`${import.meta.env.VITE_BASE_URL_IMAGE}${activeCategory.imgUrl}`}
                            alt={activeCategory.name}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <h3 className="font-semibold text-xl text-pink-600">
                          {activeCategory.name}
                        </h3>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Explore our collection of {activeCategory?.name.toLowerCase()} products
                  </p>
                </div>

                {/* Right side - Subcategories */}
                <div className="w-3/4 pl-6">
                  {subCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-sm text-gray-500">No subcategories available</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-6">
                      {subCategories.map((subcat) => (
                        <div
                          key={subcat.id}
                          onClick={() => handleSubCategoryClick(subcat)}
                          className="group flex items-center cursor-pointer py-1.5 px-2 rounded-md hover:bg-pink-50 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-300 mr-2 group-hover:bg-pink-500"></span>
                          <span className="text-gray-700 group-hover:text-pink-600 transition-colors font-medium text-sm">
                            {subcat.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add a style block for the fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DropDown;