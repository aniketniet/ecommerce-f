import React from "react";
import Allvenderorderproduct from "../Components/Layout/Dashboard/DashboardContent/allvenderorderproduct";
import DashboardSidebar from "../Components/Layout/Dashboard/DashboardSidebar";
import DashboardHeader from "../Components/Layout/Dashboard/DashboardHeader";

const AllOrderPage = () => {
  return (
    <>
      <DashboardHeader />

      <div className="flex w-full">
        <div className="w-[80px] 800px:w-[335px]">
          <DashboardSidebar active={2} />
        </div>

        <div className="w-full mt-10 px-5 ">
          <Allvenderorderproduct />
        </div>
      </div>
    </>
  );
};

export default AllOrderPage;
