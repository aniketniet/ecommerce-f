import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../../Styles/Style";
import { BsFillBagFill } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";

import Cookies from "js-cookie";

const UserOrderDetail = ({ isAuthor }) => {
  const [click, setClick] = useState(false);
  const [order, setOrder] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
    const token = Cookies.get("userToken");
  const { id } = useParams();

  const stars = [1, 2, 3, 4, 5];
  const [filledStars, setFilledStars] = useState([true, true, true, true, true]);

  const handleStarClick = (index) => {
    const updated = filledStars.map((_, i) => i <= index);
    setFilledStars(updated);
  };
useEffect(() => {
    const fetchOrder = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/web/get-order/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrder(res.data);
        } catch (err) {
            console.error("Failed to fetch order:", err);
        }
    };
    fetchOrder();
}, [id, token]);

  if (!order) return <div className="p-8 text-gray-500">Loading...</div>;

  const {
    id: orderId,
    createdAt,
    totalAmount,
    paymentMode,
    orderItems = [],
    orderStatus,
    status,
    couponCode,
    gst,
    discount,
    notes
  } = order;

  return (
    <div className={`min-h-screen ${styles.section} py-8`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="text-[25px] font-[600] pl-2 text-[#333]">Order Details</h1>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6">
        <h1 className="font-[600] text-[#333333ba]">Order ID: <span>#{orderId}</span></h1>
        <h1 className="font-[600] text-[#333333ba]">Placed on: {new Date(createdAt).toLocaleDateString()}</h1>
      </div>

      {/* Product List */}
      {orderItems.map((item, index) => {
        const product = item?.variant?.product;
        const image = item?.variant?.images?.[0];
        const attributes = item?.attributes;

        return (
          <div key={index} className="flex mt-10 py-3 border-b justify-between">
            <div className="flex">
              <img
                src={image ? `${import.meta.env.VITE_BASE_URL_IMAGE}${image}` : ""}
                alt="product"
                className="w-[70px] h-[70px] object-cover"
              />
              <div className="ml-5">
                <h5 className="font-[700] text-[20px] text-[#2a2a2a]">{product?.name}</h5>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                <p className="text-sm text-gray-600">
                  {attributes.map((attr, i) => (
                    <span key={i} className="mr-2">
                      {attr.key}: {attr.value}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {!isAuthor && (
              <button className={`${styles.button} !h-11 !rounded-[4px] text-white`} onClick={() => setClick(true)}>
                Write a review
              </button>
            )}
          </div>
        );
      })}

      {/* Total */}
      <div className="w-full flex justify-end mt-2">
        <h1 className="font-[600] text-[#333]">
          Total Price: <span className="font-[700] text-black">₹{totalAmount}</span>
        </h1>
      </div>

      {/* Address + Payment */}
      <div className="flex flex-col 800px:flex-row w-full 800px:w-[80%] items-start justify-between mt-12 gap-4">
        <div>
          <h1 className="font-[700] text-[20px] text-[#333]">Shipping Note:</h1>
          <p className="font-[600] mt-2">{notes || "No special instructions"}</p>
        </div>
        <div>
          <h1 className="font-[700] text-[20px] text-[#333]">Payment Info:</h1>
          <p className="font-[600] text-[#333333ca]">Mode: {paymentMode}</p>
          <p className="font-[600] text-[#333333ca]">Status: {orderStatus}</p>
        </div>
      </div>

      {/* Order Status Update */}
      {isAuthor && (
        <div className="mt-12">
          <h1 className="font-[700] text-[20px] text-[#333]">Order Status:</h1>
          <select
            name="orderStatus"
            defaultValue={status}
            className="bg-transparent focus:border-blue-500 cursor-pointer border py-1 px-2 !rounded-md border-gray-300">
            <option value="processing">Processing</option>
            <option value="transferred to delivery partner">Transferred to delivery partner</option>
            <option value="received">Received</option>
            <option value="on the way">On the way</option>
            <option value="delivered">Delivered</option>
          </select>
          <button className={`${styles.button} !bg-[#ff648b30] !h-11 !rounded-[4px] mt-5 text-[#f9224d] font-[700]`}>
            Update status
          </button>
        </div>
      )}

      {/* Review Modal */}
      {click && (
        <div className="w-full h-screen bg-[#00000060] fixed top-0 left-0 z-50 flex items-center justify-center">
          <div className="sm:w-[95%] md:w-[80%] 800px:w-[50%] h-[70vh] overflow-y-scroll bg-white rounded-md">
            <div className="w-full flex items-end justify-end p-2">
              <RxCross1
                size={40}
                className="cursor-pointer p-2 hover:bg-[#0000001b] transition rounded-full"
                onClick={() => setClick(false)}
              />
            </div>
            <h5 className="text-[30px] font-Poppins text-center">Give a review</h5>

            <div className="px-5 mt-6">
              <h1 className="font-[600] text-[18px]">Rating <span className="text-red-500">*</span></h1>
              <div className="flex items-center mt-1">
                {stars.map((_, i) => {
                  return filledStars[i] ? (
                    <AiFillStar
                      key={i}
                      size={25}
                      color="#f6Ba00"
                      className="mr-2 cursor-pointer"
                      onClick={() => handleStarClick(i)}
                    />
                  ) : (
                    <AiOutlineStar
                      key={i}
                      size={25}
                      color="#f6Ba00"
                      className="mr-2 cursor-pointer"
                      onClick={() => handleStarClick(i)}
                    />
                  );
                })}
              </div>

              <form className="mt-6">
                <label htmlFor="comment" className="font-[600] text-[18px]">Write a comment</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="mt-2 w-full h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:border-blue-500"
                  placeholder="Enter your product review..."
                />
                <input
                  type="submit"
                  value="Submit"
                  className={`${styles.button} mt-4 text-white`}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetail;
