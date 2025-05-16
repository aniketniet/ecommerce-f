import React, { useEffect, useState } from "react";
// import { productData } from "../../Static/data";
import styles from "../../Styles/Style";

import Product from "./Product";
import axios from "axios";

const BestDeals = () => {
  // const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  // const [loading, setLoading] = useState(false);
     const fetchProducts = async () => {
          // setLoading(true);
          try {
            const { data } = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/web/get-all-products`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
              
            );
            console.log(data.data,"gregget",)
            setProductData(data.data || []);
          } catch (error) {
            console.error("Error fetching products:", error);
          } finally {
            // setLoading(false);
          }
        };
      
        useEffect(() => {
          fetchProducts();
        }, []);
  

  

  // console.log(data, "datnnnna");

  return (
<div className={`${styles.section}`}>
  <div className={`${styles.heading} text-center mb-6`}>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Best Deals</h1>
  </div>

  <div className="flex flex-wrap justify-center gap-5 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 lg:gap-7 mb-12">
    {productData && productData.length > 0 ? (
      productData.map((data, index) => <Product data={data} key={index} />)
    ) : (
      <div className="w-full text-center text-gray-500">No products available.</div>
    )}
  </div>
</div>

  );
};

export default BestDeals;
