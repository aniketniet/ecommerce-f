import React, { useEffect, useState } from "react";
import styles from "../Styles/Style";
import { useParams } from "react-router-dom";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";
import VendorProductDetails from "../Components/Layout/vendorproductdetailpage";
import SuggestedProduct from "../Components/Layout/SuggestedProduct";
import Cookies from "js-cookie";
import axios from "axios";

const VendorProductDetailsPage = () => {
  const { id: name } = useParams();
  const [data, setData] = useState(null);

  const token = Cookies.get("sellerToken");

  const fetchProductDetail = async () => {
    if (!token) {
      console.warn("No token found. Please login.");
      return;
    }

    try {
      console.log("Fetching product with ID:", name);
      console.log("Using token:", token);
      const o = import.meta.env.VITE_BASE_URL;
      console.log(o, "oooo");

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/vendor/get-product/${name}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", data);
      setData(res.data?.data || null);
    } catch (error) {
      if (error.response) {
        console.error("API error response:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [name]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <DashboardHeader />
      <div className="flex w-full">
        <div className="w-[80px] 800px:w-[335px]">
          <DashboardSidebar active={2} />
        </div>

        <div className="w-full mt-10 px-5">
          <VendorProductDetails data={data} />
          {/* {data && <SuggestedProduct data={data} />} */}
        </div>
      </div>
    </>
  );
};

export default VendorProductDetailsPage;
