import React from "react";
import logo from "/shopinger.png";
import { Link } from "react-router-dom";
import {
  AiOutlineTwitter,
  AiFillGithub,
  AiFillInstagram,
  AiFillFacebook,
} from "react-icons/ai";
import {
  footerProductLinks,
  footerSupportLinks,
  footercompanyLinks,
} from "../../Static/data";

const Footer = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Newsletter Section */}
      <div className="py-10 px-6 md:px-12 lg:px-16 bg-gradient-to-r from-purple-900 to-pink-800 rounded-t-3xl mx-4 -mb-8 relative z-10 shadow-xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
          <div className="md:w-2/5">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              <span className="text-pink-300">Join our newsletter</span>
              <span className="block mt-2 text-white text-opacity-90 text-2xl md:text-3xl">
                Get exclusive deals, updates & offers
              </span>
            </h1>
          </div>
          
          <div className="md:w-3/5">
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Your email address"
                className="w-full bg-white bg-opacity-10 backdrop-blur-lg text-white placeholder-gray-300 border border-gray-300 border-opacity-20 rounded-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-full px-6 py-3 transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto pt-16 pb-8 px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img
              src={logo}
              alt="Shopinger"
              className="w-48 mb-6"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Discover the perfect elements to create beautiful products and elevate your shopping experience with our carefully curated collection.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-pink-600 rounded-full p-2.5 transition-all duration-300"
              >
                <AiFillFacebook size={20} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-pink-600 rounded-full p-2.5 transition-all duration-300"
              >
                <AiOutlineTwitter size={20} />
              </a>
             
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-pink-600 rounded-full p-2.5 transition-all duration-300"
              >
                <AiFillInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links Columns */}
          <div>
            <h2 className="font-bold text-lg mb-5 text-pink-300">Company</h2>
            <ul className="space-y-3">
              {footercompanyLinks?.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    className="text-gray-400 hover:text-pink-300 transition-colors duration-300 text-sm flex items-center"
                  >
                    <span className="mr-2">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-5 text-pink-300">Shop</h2>
            <ul className="space-y-3">
              {footerProductLinks?.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    className="text-gray-400 hover:text-pink-300 transition-colors duration-300 text-sm flex items-center"
                  >
                    <span className="mr-2">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-5 text-pink-300">Support</h2>
            <ul className="space-y-3">
              {footerSupportLinks?.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    className="text-gray-400 hover:text-pink-300 transition-colors duration-300 text-sm flex items-center"
                  >
                    <span className="mr-2">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-sm text-gray-400">
              &copy; 2025{" "}
              <span className="text-pink-400 font-bold">
               VGI Sooprs
              </span>
              . All rights reserved.
            </div>

            <div className="text-sm text-gray-400 flex items-center justify-center space-x-2">
              <Link to="/terms" className="hover:text-pink-300 transition-colors duration-300">Terms</Link>
              <span className="text-gray-600">•</span>
              <Link to="/privacy" className="hover:text-pink-300 transition-colors duration-300">Privacy Policy</Link>
            </div>

            <div className="flex justify-center md:justify-end">
              <img
                src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
                alt="Payment Methods"
                className="h-8 opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;