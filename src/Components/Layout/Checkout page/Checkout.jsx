import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../../Styles/Style";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import axios from "axios";
import {
  FaHome,
  FaMapMarkerAlt,
  FaTrash,
  FaStar,
  FaPlus,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {selectAddress, clearSelectedAddress, setSelectedAddress} from "../../../Redux/AddressAction";

const AddressManagement = () => {
 
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    houseNo: "",
    street: "",
    city: "",
    district: "",
    pincode: "",
    isDefault: false,
  });

const dispatch = useDispatch();
const selectedAddress = useSelector(setSelectedAddress);


  const token = Cookies.get("userToken");
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/web/get-address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data.success) {
        setAddresses(data.addresses);
        const defaultAddress = data.addresses.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message || "Failed to fetch addresses");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching addresses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/web/add-address`,
        new URLSearchParams(formData).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Address added successfully");
        setFormData({
          houseNo: "",
          street: "",
          city: "",
          district: "",
          pincode: "",
          isDefault: false,
        });
        setShowAddressForm(false);
        fetchAddresses();
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      toast.error("Something went wrong while adding address");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setLoading(true);
      try {
        const response = await axios.delete(
          `${BASE_URL}/web/delete-address/${addressId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        if (data.success) {
          toast.success("Address deleted successfully");
          if (selectedAddress?.id === addressId) {
            setSelectedAddress(null);
          }
          fetchAddresses();
        } else {
          toast.error(data.message || "Failed to delete address");
        }
      } catch (error) {
        toast.error("Something went wrong while deleting address");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${BASE_URL}/web/set-default-address/${addressId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Default address updated successfully");
        fetchAddresses();
        navigate("/payment");
      } else {
        toast.error(data.message || "Failed to update default address");
      }
    } catch (error) {
      toast.error("Something went wrong while updating default address");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    // console.log("Selected address:", address);
      dispatch(selectAddress(address));
  
  };

  return (
    <div className="max-w-7xl mx-auto mt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white rounded-lg shadow-md p-6 mb-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-3 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">
              My Delivery Addresses
            </h2>
          </div>
          <button
            className={`flex items-center justify-center text-white bg-[#C51162] hover:bg-[#F50057] transition-all duration-300 rounded-md px-4 py-2 text-sm font-medium`}
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            {showAddressForm ? (
              <>
                <FaTimes className="mr-2" /> Cancel
              </>
            ) : (
              <>
                <FaPlus className="mr-2" /> Add New Address
              </>
            )}
          </button>
        </div>

        {/* Address form */}
        <AnimatePresence>
          {showAddressForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Add New Delivery Address
                </h3>
                <form onSubmit={handleAddAddress}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        House / Flat / Building No.{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="houseNo"
                        value={formData.houseNo}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. Flat 101, Floor 1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street / Area / Locality{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. MG Road, Sector 14"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. Mumbai Suburban"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. 400001"
                      />
                    </div>
                    <div className="flex items-center md:mt-6">
                      <input
                        type="checkbox"
                        name="isDefault"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isDefault"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Set as default delivery address
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FaCheck className="mr-2" /> Save Address
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address List */}
        <div className="address-list">
          {loading && !showAddressForm ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <FaHome className="text-4xl mb-3 text-gray-400" />
              <p className="text-lg font-medium mb-1">
                No saved addresses found
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Add a new delivery address to proceed with your order
              </p>
              <button
                onClick={() => setShowAddressForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add New Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {addresses.map((address) => (
                <motion.div
                  key={address.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`relative overflow-hidden rounded-lg border-2 ${
                    selectedAddress?.id === address.id
                      ? "border-blue-500 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  } cursor-pointer`}
                  onClick={() => handleSelectAddress(address)}
                >
                  {/* Address Card Content */}
                  <div className="p-5">
                    {/* Status Badge */}
                    {address.isDefault && (
                      <div className="absolute -right-8 top-5 bg-blue-500 text-white px-10 py-1 transform rotate-45 text-xs font-semibold">
                        DEFAULT
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {selectedAddress?.id === address.id && (
                      <div className="absolute top-5 left-5">
                        <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaCheck className="text-white text-sm" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`${
                        selectedAddress?.id === address.id ? "pl-8" : ""
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        <h3 className="font-semibold text-gray-800">
                          Delivery Address
                        </h3>
                      </div>

                      <div className="mb-4 text-gray-700">
                        <p className="font-medium">
                          {address.houseNo}, {address.street}
                        </p>
                        <p>
                          {address.city}, {address.district}
                        </p>
                        <p>PIN: {address.pincode}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                        className="flex items-center text-red-500 hover:text-red-700 transition-colors text-sm"
                      >
                        <FaTrash className="mr-1 text-xs" /> Remove
                      </button>

                      {!address.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefaultAddress(address.id);
                          }}
                          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors text-sm"
                        >
                          <FaStar className="mr-1 text-xs" /> Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => navigate("/payment")}
          className={`mt-6 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C51162] hover:bg-[#F50057] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Proceed to Payment
        </button>

      </motion.div>
    </div>
  );
};

export default AddressManagement;
