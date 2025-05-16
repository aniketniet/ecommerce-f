import React from "react";
import styles from "../../Styles/Style";
import { navItems } from "../../Static/data";
import { Link } from "react-router-dom";

const Navbar = ({ active }) => {
  return (
    <div className={`block md:${styles.noramlFlex}`}>
      {navItems &&
        navItems.map((item, index) => (
          <div className="flex" key={index}>
            <Link
              to={item.url}
              className={`${
                active === index + 1
                  ? "text-[#FF4081]"
                  : " text-black md:text-[#fff]"
              }  font-[500] px-6 cursor-pointer mb-8 md:mb-0`}>
              {item.title}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Navbar;
