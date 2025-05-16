import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCartItems } from "../../../../Redux/CartAction";
import { setSelectedAddress } from "../../../../Redux/AddressAction";
import { CreditCard, DollarSign, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";
import Cookies from "js-cookie";
import { FaMoneyBill, FaMoneyBillWaveAlt } from "react-icons/fa";

const PaymentInfo = ({ setOpen, currentUser }) => {
  const selectedAddressId = useSelector(setSelectedAddress);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardDetailsValid, setIsCardDetailsValid] = useState(false);
  const dispatch = useDispatch();
  const cartSummary = useSelector((state) => state.cart);

  const productId = cartSummary?.cart?.map((item) => item.productId);
  const token = Cookies.get("userToken");
  const totalAmount = cartSummary?.summary?.subtotal || 0;

  // Mock card state for demo
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  // Validate card input
  useEffect(() => {
    const { number, name, expiry, cvv } = cardDetails;
    if (
      number.replace(/\s/g, "").length === 16 &&
      name.length > 3 &&
      expiry.length === 5 &&
      cvv.length === 3
    ) {
      setIsCardDetailsValid(true);
    } else {
      setIsCardDetailsValid(false);
    }
  }, [cardDetails]);

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, "");
    if (/^\d*$/.test(value) && value.length <= 16) {
      // Format with a space every 4 digits
      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      setCardDetails({ ...cardDetails, number: formatted });
    }
  };

  // Format expiry date as MM/YY
  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      let formatted = value;
      if (value.length > 2) {
        formatted = value.slice(0, 2) + "/" + value.slice(2);
      }
      setCardDetails({ ...cardDetails, expiry: formatted });
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Failed to load payment gateway.");
        setIsProcessing(false);
        return;
      }

      const amountToPay = totalAmount * 100;

      // Create Razorpay order
      const orderRes = await fetch(
        "http://103.189.173.127:3000/api/web/create-razorpay-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: amountToPay }),
        }
      );

      const orderData = await orderRes.json();
      if (!orderData?.order?.id) throw new Error("Order creation failed");

      const razorpayOrderId = orderData.order.id;

      // Configure Razorpay options
      const options = {
        key: "rzp_test_eaw8FUWQWt0bHV",
        amount: amountToPay,
        currency: "INR",
        name: "ShopNest",
        description: "Complete your purchase",
        order_id: razorpayOrderId,
        image: "https://via.placeholder.com/150",
        handler: async function (response) {
          try {
            // Verify Razorpay payment
            const formBody = new URLSearchParams();
            formBody.append("razorpay_order_id", response.razorpay_order_id);
            formBody.append(
              "razorpay_payment_id",
              response.razorpay_payment_id
            );
            formBody.append("razorpay_signature", response.razorpay_signature);
            formBody.append("amount", amountToPay.toString());
            formBody.append("currency", "INR");
            formBody.append("product_id", productId);

            const verifyRes = await fetch(
              "http://103.189.173.127:3000/api/web/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Authorization: `Bearer ${token}`,
                },
                body: formBody.toString(),
              }
            );

            const verifyData = await verifyRes.json();

            if (
              verifyRes.status !== 200 ||
              verifyData.message !== "Payment verified successfully"
            ) {
              throw new Error("Payment verification failed");
            }

            // Create order after verification
            const createOrderRes = await fetch(
              "http://103.189.173.127:3000/api/web/create-order",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  paymentMode: "razorpay",
                  paymentOrderId: response.razorpay_payment_id,
                  orderStatus: "SUCCESS",
                  addressId: selectedAddressId.id,
                  gst: 49.0,
                  discount: 50.0,
                  couponCode: "NEWUSER50",
                  totalAmount: totalAmount,
                  notes: "Ring the bell on arrival",
                }),
              }
            );

            const orderResult = await createOrderRes.json();
            
            // Navigation and cleanup
            navigate("/order/success");
            localStorage.setItem("cartItems", JSON.stringify([]));
          } catch (error) {
            console.error("Payment processing error:", error);
            alert("Something went wrong while processing your payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: currentUser?.username || "Guest",
          email: currentUser?.email || "guest@example.com",
          contact: currentUser?.phone || "",
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initialization failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleDirectCardPayment = () => {
    // This would typically integrate with a payment processor
    // For this example, we'll simulate a successful payment
    setIsProcessing(true);
    
    setTimeout(() => {
      try {
        // Create order after "successful" card payment
        fetch("http://103.189.173.127:3000/api/web/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMode: "card",
            paymentOrderId: `CARD-${Date.now()}`,
            orderStatus: "SUCCESS",
            addressId: selectedAddressId.id,
            gst: 49.0,
            discount: 50.0,
            couponCode: "NEWUSER50",
            totalAmount: totalAmount,
            notes: "Ring the bell on arrival",
          }),
        })
          .then(response => response.json())
          .then(() => {
            navigate("/order/success");
            localStorage.setItem("cartItems", JSON.stringify([]));
          })
          .catch(error => {
            console.error("Order creation error:", error);
            alert("Payment was successful, but order creation failed.");
          })
          .finally(() => {
            setIsProcessing(false);
          });
      } catch (error) {
        console.error("Payment error:", error);
        alert("Payment processing failed. Please try again.");
        setIsProcessing(false);
      }
    }, 2000); // Simulate processing
  };

  const handleCashOnDeliveryOrder = () => {
    setIsProcessing(true);
    
    try {
      // Create order for COD
      fetch("http://103.189.173.127:3000/api/web/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMode: "COD",
          paymentOrderId: `COD-${Date.now()}`,
          orderStatus: "PENDING",
          addressId: selectedAddressId.id,
          gst: 49.0,
          discount: 50.0,
          couponCode: "NEWUSER50",
          totalAmount: totalAmount,
          notes: "Ring the bell on arrival",
        }),
      })
        .then(response => response.json())
        .then(() => {
          navigate("/order/success");
          localStorage.setItem("cartItems", JSON.stringify([]));
        })
        .catch(error => {
          console.error("Order creation error:", error);
          alert("Order creation failed. Please try again.");
        })
        .finally(() => {
          setIsProcessing(false);
        });
    } catch (error) {
      console.error("Order error:", error);
      alert("Order processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else if (paymentMethod === "card") {
      handleDirectCardPayment();
    } else if (paymentMethod === "cod") {
      handleCashOnDeliveryOrder();
    }
  };

  const renderPaymentMethodContent = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                placeholder="John Smith"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 3) {
                      setCardDetails({ ...cardDetails, cvv: value });
                    }
                  }}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <ShieldCheck size={16} className="mr-1 text-green-600" />
              Your payment information is secure and encrypted
            </div>
          </div>
        );
      
      case "razorpay":
        return (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center">
            <FaMoneyBill size={24} className="text-[#C51162] mr-2" />
              <div>
                <p className="text-sm text-gray-600">
                  You'll be redirected to Razorpay's secure payment page to complete your purchase.
                </p>
              </div>
            </div>
          </div>
        );
      
      case "cod":
        return (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Pay with cash when your order is delivered. Please note that an additional fee of ₹40 may apply for Cash on Delivery orders.
            </p>
            <p className="text-sm font-medium text-gray-800 mt-2">
              Total amount to be paid on delivery: ₹{(totalAmount + 40).toFixed(2)}
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-11/12 m-auto bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
        <p className="text-gray-600 text-sm mt-1">
          All transactions are secure and encrypted
        </p>
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{cartSummary?.summary?.subtotal?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">₹{cartSummary?.summary?.shipping?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">₹49.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-[#C51162]">-₹50.00</span>
        </div>
        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
          <span className="font-bold text-gray-800">Total</span>
          <span className="font-bold text-gray-800">₹{totalAmount?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
              paymentMethod === "card"
                ? "border-[#C51162] bg-indigo-50"
                : "border-gray-200 hover:border-[#C51162]"
            }`}
          >
            <CreditCard
              size={24}
              className={`${paymentMethod === "card" ? "text-[#C51162]" : "text-gray-600"}`}
            />
            <span className={`mt-2 text-sm font-medium ${
              paymentMethod === "card" ? "text-[#C51162]" : "text-gray-700"
            }`}>Credit Card</span>
          </button>
          
          <button
            onClick={() => setPaymentMethod("razorpay")}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
              paymentMethod === "razorpay"
                ? "border-[#C51162] bg-gray-100"
                : "border-gray-200 hover:border-[#C51162]"
            }`}
          >
            <div className="h-6 w-6 flex items-center justify-center">
            <FaMoneyBill size={30} className="text-[#C51162] mr-2" />
            </div>
            <span className={`mt-2 text-sm font-medium ${
              paymentMethod === "razorpay" ? "text-[#C51162]" : "text-gray-700"
            }`}>Razorpay</span>
          </button>
          
          <button
            onClick={() => setPaymentMethod("cod")}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
              paymentMethod === "cod"
                ? "border-[#C51162] bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300"
            }`}
          >
            <DollarSign
              size={24}
              className={`${paymentMethod === "cod" ? "text-[#C51162]" : "text-gray-600"}`}
            />
            <span className={`mt-2 text-sm font-medium ${
              paymentMethod === "cod" ? "text-[#C51162]" : "text-gray-700"
            }`}>Cash on Delivery</span>
          </button>
        </div>
      </div>

      {/* Payment Method Content */}

      {renderPaymentMethodContent()}

      {/* Payment Button */}
      <div className="mt-6">
        <button
          onClick={handlePayment}
          disabled={paymentMethod === "card" && !isCardDetailsValid || isProcessing}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-md font-medium text-white ${
            (paymentMethod === "card" && !isCardDetailsValid) || isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#C51162] hover:bg-[#FF4081] transition"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              {paymentMethod === "cod" ? "Place Order" : "Pay"} ₹{paymentMethod === "cod" ? (totalAmount + 40).toFixed(2) : totalAmount?.toFixed(2)}
              <ArrowRight size={16} className="ml-2" />
            </span>
          )}
        </button>
      </div>

      {/* Security Badges */}
      <div className="mt-6 flex justify-center space-x-4 text-gray-500">
        <div className="flex items-center">
          <ShieldCheck size={16} className="mr-1" />
          <span className="text-xs">Secure Payment</span>
        </div>
        <div className="flex items-center">
          <CheckCircle size={16} className="mr-1" />
          <span className="text-xs">Money-back Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;