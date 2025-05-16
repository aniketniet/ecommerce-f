import { useState } from "react";
import { Camera } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const Profile = ({ setViewProfile }) => {
  const user = JSON.parse(localStorage.getItem("userAuth") || "{}");

  const [email] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const token = Cookies.get("userToken");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      localStorage.setItem("PhotoUrl", JSON.stringify(url));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/web/update-details`,
        new URLSearchParams({
          name,
          phone,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUpdateSuccess(true);
        localStorage.setItem("userName", JSON.stringify(name));
        localStorage.setItem("number", JSON.stringify(phone));
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        alert(response.data?.message || "Failed to update profile.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-24 bg-[#C51162]"></div>

      <div className="relative px-6 -mt-16">
        <div className="flex flex-col md:flex-row">
          <div className="relative mx-auto md:mx-0">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
              <img
                src="/user.png"
                alt="Profile"
                className="w-full h-full object-cover"
                onClick={() => setViewProfile(true)}
              />
            </div>
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Camera size={16} className="text-[#FF4081]" />
              <input
                type="file"
                id="profile-image"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          </div>

          <div className="md:ml-6 mt-4 md:mt-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">{name || "Your Name"}</h2>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Edit Profile Information</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {updateSuccess && (
            <div className="mt-6 p-3 bg-green-50 text-green-700 rounded-md">
              Profile updated successfully!
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className={`px-6 py-2 rounded-md bg-[#FF4081] text-white font-medium hover:bg-[#C51162] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isUpdating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
