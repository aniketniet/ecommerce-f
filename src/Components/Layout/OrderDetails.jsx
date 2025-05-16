import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaShippingFast, FaCreditCard, FaMapMarkerAlt, FaClipboardCheck } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";

const OrderDetails = ({ isAuthor }) => {
  const { id } = useParams();
  const [click, setClick] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateMessage, setUpdateMessage] = useState({ type: "", text: "" });

  const token = Cookies.get("sellerToken");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/vendor/get-order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrder(res.data);
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      setUpdateMessage({ type: "error", text: "Please select a status" });
      return;
    }

    try {
      setUpdateLoading(true);
      setUpdateMessage({ type: "", text: "" });

      // Map frontend status to API expected format
      const statusMapping = {
        "on the way": "SHIPPED",
        "delivered": "DELIVERED"
      };

      const orderItemStatus = statusMapping[selectedStatus] || selectedStatus.toUpperCase();

      // For each order item, send update request
      const updatePromises = order.orderItems.map(item => 
        axios.put(
          `${import.meta.env.VITE_BASE_URL}/vendor/update-order-item-status`,
          `OrderItemStatus=${orderItemStatus}&OrderItemId=${item.id}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${token}`
            }
          }
        )
      );

      await Promise.all(updatePromises);
      
      // Refresh order data
      await fetchOrder();
      
      setUpdateMessage({ type: "success", text: "Order status updated successfully" });
    } catch (error) {
      console.error("Failed to update order status", error);
      setUpdateMessage({ type: "error", text: "Failed to update order status" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColorMap = {
      "PROCESSING": "text-blue-600",
      "SHIPPED": "bg-yellow-500",
      "DELIVERED": "bg-green-600",
      "CANCELLED": "text-red-600"
    };
    
    return statusColorMap[status] || "text-gray-500";
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isFilled = star <= rating;
      const StarIcon = isFilled ? AiFillStar : AiOutlineStar;
      return (
        <StarIcon
          key={star}
          size={28}
          color="#D4AF37"
          className="mr-2 cursor-pointer transition-all duration-200 hover:scale-110"
          onClick={() => setRating(star)}
        />
      );
    });
  };

  // Format date in elegant way
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-[#f8f8f8]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <p className="mt-4 text-gray-500 font-light">Loading your order details...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex justify-center items-center bg-[#f8f8f8]">
      <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
        <div className="text-gray-400 mb-4">
          <BsBoxSeam size={60} className="mx-auto" />
        </div>
        <h2 className="text-2xl font-light mb-2">Order Not Found</h2>
        <p className="text-gray-500">The order details you're looking for cannot be retrieved at this moment.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with subtle gradient border */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-black">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-black">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-3xl font-light text-gray-800 tracking-tight">Order Details</h1>
                <p className="text-gray-500 mt-1 text-sm">Reference: {order.id}</p>
              </div>

              <div className="mt-4 md:mt-0 flex items-center">
                {order.orderItems.length > 0 && (
                  <>
                    <span className={`px-4 py-1.5 rounded-full border border-white  ${getStatusColor(order.orderItems[0].orderItemStatus)}`}>
                      {order.orderItems[0].orderItemStatus}
                    </span>
                    <span className="mx-3 h-1 w-1 bg-gray-200 rounded-full"></span>
                    <span className="text-gray-500 text-sm font-light">{formatDate(order.createdAt)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <h2 className="text-xl font-light text-gray-800 mb-4">Your Purchase</h2>
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <div key={item.id} className="py-6 flex items-center">
                  <div className="flex-shrink-0 bg-gray-50 rounded-lg p-1 border border-black">
                    <img
                      src={`${import.meta.env.VITE_BASE_URL_IMAGE}${item.variant?.images?.[0]}`}
                      alt={item.variant?.product?.name}
                      className="w-96 h-96 object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 leading-tight mb-4">
                          {item.variant?.product?.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.attributes?.map((attr, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex h-8 w-28 items-center px-2 py-0.5 rounded text-sm font-medium bg-gray-50 text-gray-600 border border-black"
                            >
                              {attr.key}: {attr.value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">${item.price} × {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="mt-8 border-t border-black pt-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${order.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">Included</span>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-black">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-lg font-medium text-gray-900">${order.totalAmount}</span>
              </div>
            </div>

            {/* Write a Review Button */}
            {!isAuthor && (
              <div className="mt-8 text-center">
                <button
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  onClick={() => setClick(true)}
                >
                  <AiFillStar className="mr-2" size={18} />
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customer and Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-black">
            <div className="flex items-center mb-5">
              <FaMapMarkerAlt className="text-gray-400 mr-3" size={20} />
              <h3 className="text-xl font-light text-gray-800">Shipping Information</h3>
            </div>
            <div className="space-y-2 pl-9">
              <p className="text-gray-700">Name: {order.user?.name}</p>
              <p className="text-gray-500">Email: {order.user?.email}</p>
              <p className="text-gray-500">Street: {order.address?.houseNo} {order.address?.street}</p>
              <p className="text-gray-500">City/District: {order.address?.city}, {order.address?.district}</p>
              <p className="text-gray-500">Pincode: {order.address?.pincode}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-black">
            <div className="flex items-center mb-5">
              <FaCreditCard className="text-gray-400 mr-3" size={20} />
              <h3 className="text-xl font-light text-gray-800">Payment Details</h3>
            </div>
            <div className="space-y-3 pl-9">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-gray-900 font-medium">{order.paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="text-gray-900 font-medium">TXN{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-gray-900 font-medium">${order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Status Control */}
        {isAuthor && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-black">
            <div className="flex items-center mb-5">
              <FaClipboardCheck className="text-gray-400 mr-3" size={20} />
              <h3 className="text-xl font-light text-gray-800">Update Order Status</h3>
            </div>
            
            {updateMessage.text && (
              <div className={`mb-4 p-3 rounded-md ${updateMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {updateMessage.text}
              </div>
            )}
            
            <div className="mt-4 flex flex-col sm:flex-row items-center">
              <select
                className="block w-full sm:w-auto rounded-md border border-black shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 bg-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Select order status</option>
                <option value="on the way">SHIPPED</option>
                <option value="delivered">DELIVERED</option>
              </select>
              <button 
                className={`mt-3 sm:mt-0 sm:ml-4 w-full sm:w-auto px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${updateLoading ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-800"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                onClick={handleUpdateStatus}
                disabled={updateLoading}
              >
                {updateLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {click && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setClick(false)}></div>
          
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-8 mx-4 my-8">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setClick(false)}
            >
              <RxCross1 size={20} />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-gray-800">Share Your Experience</h2>
              <p className="text-gray-500 mt-1">Your feedback helps improve our service</p>
            </div>
            
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 bg-gray-50 rounded-lg p-2 border border-gray-100">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${order.orderItems[0].variant?.images?.[0]}`}
                  className="w-16 h-16 object-cover rounded-md"
                  alt={order.orderItems[0].variant?.product?.name}
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{order.orderItems[0].variant?.product?.name}</h3>
                <p className="text-sm text-gray-500">${order.totalAmount} × {order.orderItems[0].quantity}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rating <span className="text-red-500">*</span></h4>
              <div className="flex">{renderStars()}</div>
            </div>

            <form>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm px-4 py-3 h-32 resize-none"
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex justify-center px-8 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;