import React, { useContext, useEffect, useState } from "react";
import axios_client from "../axios_client";
import { useStateContext } from "../context/ContextProvider";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const currencyFormat = (num) => {
    return "SZL " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const { user, dataDecode } = useStateContext();

  const [payWith, setPayWith] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getPaymentMethods = async () => {
    try {
      const { data } = await axios_client.get(
        `/bridgePaymentMethods.php?userID=${user[0].id}`
      );

      const response = dataDecode(data);

      // Find the payment method object with methodName equal to payWith
      const selectedPaymentMethod = response.find(
        (method) => method.methodName === payWith
      );

      // Set payment method to the found object, or null if not found
      setPaymentMethod(selectedPaymentMethod || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setPayWith(queryParams.get("paywith"));
  }, []);

  useEffect(() => {
    if (payWith) {
      getPaymentMethods();
    }
  }, [payWith]);

  const payload = {
    userData: user,
    cartItems: cartItems,
    cartTotal: cartTotal,
    paymentMethod: paymentMethod,
  };

  const handlePaymentClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios_client.post(
        "/bridgeOrderTicket.php",
        JSON.stringify(payload)
      );

      // remove items in the cart context
      clearCart();

      // localStorage has an item "CART_ITEMS". remove it as well
      localStorage.removeItem("CART_ITEMS");

      // get all purchased tickets and show them in '/mytickets'
      navigate("/my-tickets");
    } catch (err) {
      console.log(err);
      setErrorMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const textToShow =
    {
      ePayNet: "Pay with ePayNet",
      MoMo: "Pay with MTN MoMo",
      eMali: "Pay with eMali",
      Visa: "Pay with Card",
    }[payWith] || "Choose Payment Method";

  return (
    <div className="mx-6 relative">
      {isLoading && (
        <div className="absolute bg-primary bg-opacity-80 rounded-md z-10 h-24 top-2/3 shadow w-full flex items-center justify-center">
          <div className="flex items-center">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-35"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-85"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg ml-4 text-white ">Processing...</p>
          </div>
        </div>
      )}
      <h1>Review your Order</h1>

      <div className="my-6 p-2 shadow">
        <h4>Order Summary</h4>
        <hr />
        <div className="my-3 flex gap-2 items-center justify-between">
          <p className="text-xs">Items: x {cartItems.length}</p>
          <p className="text-xs">Total to pay: {currencyFormat(cartTotal)}</p>
        </div>
      </div>

      {["MoMo", "ePayNet"].includes(payWith) && (
        <small className="mb-4 block text-left text-primary text-xs">
          Your mobile number, <strong>{user[0].cellNumber}</strong> will be used
          as account number. Please confirm if this is correct, or{" "}
          <Link className="text-alt underline font-light" to="/profile">
            change it here
          </Link>
        </small>
      )}

      {payWith != null ? (
        <>
          <button
            onClick={handlePaymentClick}
            className="px-4 py-2 text-white bg-primary block text-center mx-auto rounded-sm">
            {textToShow}
          </button>
          <Link
            className="px-4 py-2 text-xs text-primary block text-center mx-auto underline"
            to="/cart">
            Change
          </Link>
        </>
      ) : (
        <>
          <Link
            className="px-4 py-2 text-xs text-primary block text-center mx-auto underline"
            to="/cart">
            Choose Payment Method
          </Link>
        </>
      )}
    </div>
  );
};

export default Checkout;
