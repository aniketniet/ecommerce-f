
import React, { useState, useEffect } from "react";
import styles from "../../Styles/Style";
import { Link } from "react-router-dom";
import axios from "axios";

const Hero = () => {
 const [banner, setBanner] = useState("");
 const [heading, setHeading] = useState("");
 const [description, setDescription] = useState("");
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchBanner = async () => {
     try {
       const { data } = await axios.get(
         `${import.meta.env.VITE_BASE_URL}/web/get-all-banners`,
         {
           headers: {
             "Content-Type": "application/json",
           },
         }
       );
       
       console.log(data);
      
       if (data.success && data.data && data.data.length > 0) {
         const bannerData = data.data[0];
         const bannerUrl = `${import.meta.env.VITE_BASE_URL_IMAGE}${bannerData.imgUrl}`;
         setBanner(bannerUrl);
         setHeading(bannerData.title || "Best Collection for home decoration");
         setDescription(bannerData.description || "Lorem ipsum, dolor sit amet consectetur adipisicing elit.");
       }
     } catch (error) {
       console.error("Error fetching banners:", error);
     } finally {
       setLoading(false);
     }
   };

   fetchBanner();
 }, []);

 return (
   <div
     className={`${styles.noramlFlex} relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat`}
     style={{
       backgroundImage: loading ? "none" : `url(${banner})`,
       backgroundSize: "cover",
       backgroundPosition: "center",
     }}>
     {loading && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}
     <div className={`${styles.section} w-[90%] 800px:w-[60%] `}>
       <h4 className="text-[34px] 800px:text-[60px] font-[600] capitalize text-[#3d3a3a] leading-[1.2] ">
         {heading}
       </h4>

       <p className="pt-5 font-[400] font-Poppins text-[16px] text-[#000000ba]">
         {description}
       </p>

       <Link to={"#"} className="inline-block">
         <div className={`${styles.button} mt-6`}>
           <span className="text-white font-Poppins text-[18px]">
             Shop Now
           </span>
         </div>
       </Link>
     </div>
   </div>
 );
};

export default Hero;