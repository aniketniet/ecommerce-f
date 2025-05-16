import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai"; // Added missing import

const ProductReview = ({
  comment,
  authorName,
  reviewImage,
  stars,
  publishDate,
}) => {
  // Convert stars to a number and ensure it's between 0-5
  const starRating = Math.min(5, Math.max(0, Number(stars) || 0));
  
  return (
    <div className="mt-5 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full flex">
        <img
          src={reviewImage || '/user.png'}
          alt={`${authorName}'s profile`}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex w-full ml-3 flex-col">
          {/* Author name with more visible styling */}
          <span className="text-lg font-semibold text-gray-800">{authorName}</span>
          
          {/* Stars and date on same line */}
          <div className="flex items-center mt-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                i < starRating ? (
                  <AiFillStar
                    key={i}
                    size={20}
                    color="#f6Ba00"
                    className="mr-1"
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    size={20}
                    color="#f6Ba00"
                    className="mr-1"
                  />
                )
              ))}
            </div>
            
            {/* publish time with better styling */}
            <div className="text-gray-500 text-sm ml-4">
              {publishDate}
            </div>
          </div>
          
          {/* Review comment with improved readability */}
          <div className="text-gray-700 leading-relaxed mt-1 max-w-2xl">
            {comment}
          </div>
          
          {/* Optional helpful buttons */}
          <div className="mt-3 flex gap-4">
            <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
              Reply
            </button>
            <button className="text-gray-600 text-sm font-medium hover:underline flex items-center">
              Helpful
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;