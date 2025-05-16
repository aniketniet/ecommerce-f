import React from "react";
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer";

import UserOrderDetail from "../Components/Layout/ProfileContent/UserOrderDetail";

const UserOrderDetailPage = () => {
  return (
    <>
      <Header />
      <UserOrderDetail />
      <Footer />
    </>
  );
};

export default UserOrderDetailPage;
