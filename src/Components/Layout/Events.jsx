import React from "react";
import styles from "../../Styles/Style";
import EventCard from "./EventCard";

const Events = () => {
  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>

      <div className="grid w-full">
        <EventCard />
        {/* <img src="/public/banner2.avif" alt="banner" className="w-full h-full" /> */}
      </div>
    </div>
  );
};

export default Events;
