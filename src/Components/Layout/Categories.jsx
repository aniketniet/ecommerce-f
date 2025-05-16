import React, { useEffect, useState } from "react";
import styles from "../../Styles/Style";
import { brandingData, categoriesData } from "../../Static/data";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMainCategories,
  fetchSubCategories,
} from "../../Redux/CategoryAction";

const Categories = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const { categories, subCategories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchMainCategories());
  }, [dispatch]);

  const handleCategoryClick = (id) => {
    dispatch(fetchSubCategories(id));
    setActiveCategoryId(id);
    setModalOpen(true);
  };

  const handleSubCategoryClick = (sub) => {
    navigate(`/products?category=${sub.name}`);
    setModalOpen(false);
  };

  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div className="flex justify-between items-center w-full rounded-md bg-white my-12 p-5 shadow-sm">
          {brandingData &&
            brandingData.map((data, index) => (
              <div className="flex items-start" key={index}>
                {data.icon}

                <div className="px-3">
                  <h3 className="text-sm font-bold md:text-base">
                    {data.title}
                  </h3>
                  <p className="text-xs md:text-sm">{data.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* categories */}
      <div
        className={`${styles.section} bg-white mb-12 p-6 rounded-lg`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categories &&
            categories.map((data) => {
              return (
                <div
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  key={data.id}
                  onClick={() => handleCategoryClick(data.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 bg-blue-50 p-4 rounded-full text-3xl">
                      <img
                        src={`${import.meta.env.VITE_BASE_URL_IMAGE}${
                          data.imgUrl
                        }`}
                        alt="category"
                        className="w-[80px] h-[80px] object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-medium text-gray-800">{data.name}</h3>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-auto p-6 m-4">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="text-xl font-semibold">Choose a Service</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setModalOpen(false)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {subCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subCategories.map((sub) => (
                  <Link to={`/products?category=${sub.id}`} >
                  <div
                    key={sub.id}
                    className="flex flex-col items-center bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => handleSubCategoryClick(sub)}
                  >
                    <img
                      src={`${import.meta.env.VITE_BASE_URL_IMAGE}${
                        sub.imgUrl
                      }`}
                      alt={sub.name}
                      className="w-16 h-16 mb-3 overflow-hidden rounded-full bg-gray-100"
                    />
                    <span className="text-center font-medium text-gray-800">
                      {sub.name}
                    </span>
                  </div>
                  </Link>

                ))}
              </div>
            ) : (
              <p className="text-gray-500">No subcategories found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
