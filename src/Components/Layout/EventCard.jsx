import React from "react";
import styles from "../../Styles/Style";
import CountDown from "./CountDown";
import { motion } from "framer-motion";

import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

const EventCard = ({ active }) => {
  // const productName = "Iphone-14-pro-max-256-gb-ssd-and-8-gb-ram-silver-colour";

  return (
    <motion.div
      initial={{ opacity: 0, x: -500 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -500 }}
      transition={{ duration: 0.5 }}
      className={`w-full block lg:flex p-3 sm:p-4 rounded-lg ${
        active ? "unset" : "mb-12"
      } bg-white`}
    >
      {/* Left Image Section */}
      <div className="w-full lg:w-[50%] m-auto">
        <img src="/public/ban1.webp" alt="product/image" className="h-full" />
      </div>

      {/* Right Text + Countdown Section */}
        {/* Top Image */}
        <div className="w-full lg:w-[50%] m-auto">
        <img src="/public/ban2.webp" alt="product/image" className="h-full" />
      </div>

        {/* Product Title */}
        {/* <h2 className={`${styles.productTitle}`}>
          Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour
        </h2> */}

        {/* Product Description
        <p className="mt-3">
          Product details are a crucial part of any eCommerce website or online
          marketplace. These details help the potential customers to make an
          informed decision about the product they are interested in buying. A
          well-written product description can also be a powerful marketing tool
          that can help to increase sales. Product details typically include
          information about the product's features, specifications, dimensions,
          weight, materials, and other relevant information that can help
          customers to understand the product better. The product details
          section should also include high-quality images and videos of the
          product, as well as customer reviews and ratings.
        </p> */}

        {/* Bottom Image */}
        {/* <div className="mt-4">
          <img
            src="/public/banner.webp"
            alt="Bottom section image"
            className="rounded-md w-full"
          />
        </div> */}

        {/* Price Section */}
        {/* <div className="w-full flex justify-between py-2">
          <div className="flex">
            <h5 className="font-[500] line-through text-[18px] pr-3 text-[#d55b45]">
              $1099
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              $999
            </h5>
          </div>
          <span className="font-[400] pr-3 text-[#44a55e] text-[17px]">
            120 sold
          </span>
        </div> */}

        {/* Countdown */}
        {/* <div className="flex w-full items-start">
          <CountDown />
        </div> */}

        {/* Product Details Button */}
        {/* <div className="flex w-full items-start justify-start">
          <Link
            to={`/product/${productName}`}
            className={`${styles.button} text-white font-semibold`}
          >
            See Details
          </Link>
        </div> */}

        {/* More Events Link */}
        {/* <div className="flex items-end justify-end mt-5">
          <span className="flex items-center gap-2 cursor-pointer transition ease-linear hover:text-[#475ad2] text-[#333] text-[17px]">
            see more events <BsArrowRight size={20} />
          </span>
        </div> */}
    </motion.div>
  );
};

export default EventCard;
