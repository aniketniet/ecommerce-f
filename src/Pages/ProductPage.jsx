import React, { useEffect, useState } from "react";
import Header from "../Components/Layout/Header";
// import { productData } from "../Static/data";
import { useSearchParams } from "react-router-dom";
import Product from "../Components/Layout/Product";
import Footer from "../Components/Layout/Footer";
import styles from "../Styles/Style";
import axios from "axios";

import { motion } from "framer-motion";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const [data, setData] = useState();


   // api cetogory data
      const fetchProducts = async () => {
        // setLoading(true);
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/web/get-products-by-sub-category/${categoryData}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
            
          );
          console.log(data.data)
          setData(data.data || []);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          // setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchProducts();
      }, []);




  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  // useEffect(() => {
  //   if (categoryData === null) {
  //     const d = productData.sort((a, b) => a.total_sell - b.total_sell);
  //     setData(d);
  //   } else {
  //     const d = productData.filter((data) => data.category === categoryData);
  //     setData(d);
  //   }
  // }, []);

  return (
    <>
      <Header activeHeading={3} />

      <motion.div
        initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -500 }}
        transition={{ duration: 0.5 }}
        className={styles.section}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0 mt-12">
          {data?.map((item, index) => (
            <Product data={item} key={index} />
          ))}
        </div>

        {data?.length === 0 ? (
          <h1 className="text-center font-bold md:text-2xl text-gray-600 mb-16">
            Product not found!
          </h1>
        ) : null}
      </motion.div>

      <Footer />
    </>
  );
};

export default ProductPage;
