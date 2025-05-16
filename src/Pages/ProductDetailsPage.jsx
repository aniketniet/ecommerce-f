import React, { useEffect, useState } from "react";
import styles from "../Styles/Style";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer";
import ProductDetails from "../Components/Layout/ProductDetails";
import SuggestedProduct from "../Components/Layout/SuggestedProduct";
// import { productData } from "../Static/data";
import axios from "axios";

const ProductDetailsPage = () => {
  const id = useParams().id;
  const [data, setData] = useState(null);
  // const productName = name.replace(/-/g, " ");

  console.log(id, "name");

  // useEffect(() => {
  //   const data = productData.find((item) => item.name === productName);
  //   setData(data && data);
  // });



  // api cetogory data
  const fetchProductDetail = async () => {
    // setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/web/get-products/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(data.data, "data");
      setData(data.data.product || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log(data, "data");





  return (
    <>
      <Header />
      <ProductDetails data={data} />
      {data && <SuggestedProduct data={data} />}
      <Footer />
    </>
  );
};

export default ProductDetailsPage;