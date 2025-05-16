// src/redux/actions/category.js
import axios from "axios";

export const fetchMainCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "categoriesRequest" });

    const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/web/get-all-category`);
    
    dispatch({ type: "categoriesSuccess", payload: data.categories });
  } catch (error) {
    dispatch({ type: "categoriesFail", payload: error.message });
  }
};

export const fetchSubCategories = (mainCategoryId) => async (dispatch) => {
  try {
    dispatch({ type: "subCategoriesRequest" });

    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/web/get-all-sub-category-by-main-category/${mainCategoryId}`
    );
    dispatch({ type: "subCategoriesSuccess", payload: data.subCategories });
  } catch (error) {
    dispatch({ type: "subCategoriesFail", payload: error.message });
  }
};
