import React, { useState } from "react";
import styles from "../../../Styles/Style";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";

import { motion } from "framer-motion";

const ChangePassword = () => {
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const token = Cookies.get("userToken");



// Replace handleOnSubmit function
const handleOnSubmit = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.error("Please enter the correct confirm password!");
    return;
  }

  try {
  //  console.log("Token:", token);

    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/web/update-password`,
      new URLSearchParams({
        oldPassword,
        newPassword,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Your password has been updated successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }
};


 return (
  <div className="w-full  flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h1 className="text-[20px] text-center font-[600] pb-4 text-[#000000ba]">
        Change Password
      </h1>

      <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
        {/* Old Password */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <label className="pb-2 block">Old Password</label>
          <div className="relative">
            <input
              type={oldPasswordVisible ? "text" : "password"}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-blue-500"
            />
            {oldPasswordVisible ? (
              <AiOutlineEye
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                color="#333"
                onClick={() => setOldPasswordVisible(false)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                color="#333"
                onClick={() => setOldPasswordVisible(true)}
              />
            )}
          </div>
        </motion.div>

        {/* New Password */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <label className="pb-2 block">New Password</label>
          <div className="relative">
            <input
              type={newPasswordVisible ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-blue-500"
            />
            {newPasswordVisible ? (
              <AiOutlineEye
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                color="#333"
                onClick={() => setNewPasswordVisible(false)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                color="#333"
                onClick={() => setNewPasswordVisible(true)}
              />
            )}
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <label className="pb-2 block">Confirm Password</label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:border-blue-500"
            />
            {confirmPasswordVisible ? (
              <AiOutlineEye
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                color="#333"
                onClick={() => setConfirmPasswordVisible(false)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                color="#333"
                onClick={() => setConfirmPasswordVisible(true)}
              />
            )}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <input
            type="submit"
            value="Submit"
            className={`${styles.button} w-full font-semibold rounded-md text-white bg-[#025cb6] hover:bg-[#014c9b] transition duration-300 cursor-pointer py-2`}
          />
        </motion.div>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover={false}
          theme="light"
        />
      </form>
    </div>
  </div>
);
}



export default ChangePassword;
