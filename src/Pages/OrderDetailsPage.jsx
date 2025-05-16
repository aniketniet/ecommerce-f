import React from "react";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";
import OrderDetails from "../Components/Layout/OrderDetails";

const OrderDetailsPage = () => {
  return (
    <>
       <DashboardHeader />

      <div className="flex w-full">
        <div className="w-[80px] 800px:w-[335px]">
          <DashboardSidebar active={2} />
        </div>

        <div className="w-full mt-10 px-5 ">
          <OrderDetails />
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPage;
