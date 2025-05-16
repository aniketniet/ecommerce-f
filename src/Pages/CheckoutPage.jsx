import React from "react";
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer";
import AddressManagement from "../Components/Layout/Checkout page/Checkout";
import CheckoutSteps from "../Components/Layout/Checkout page/CheckoutSteps";

function CheckoutPage() {
  return (
    <>
      <Header />

      <br />
      <br />

      <CheckoutSteps active={1} />

      <AddressManagement />

      <Footer />
    </>
  );
}

export default CheckoutPage;
