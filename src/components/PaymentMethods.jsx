import React, { useEffect, useState } from "react";
import axios_client from "../axios_client";
import emali from "../assets/payment/emali.png";
import mtn_momo from "../assets/payment/mtn momo.png";
import visa_mastercard from "../assets/payment/visa_mastercard.png";
import epaynet from "../assets/payment/epaynet_logo_.png";

import { useStateContext } from "../context/ContextProvider";

const PaymentMethods = ({
  visible,
  onClose,
  heading,
  onSelectPaymentMethod,
}) => {
  const { user, dataDecode } = useStateContext();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPaymentMethods = async () => {
    try {
      const { data } = await axios_client.get(`/payment-methods`);

      const response = dataDecode(data);
      setPaymentMethods(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  // get the selected payment method
  const handlePaymentMethodChange = (e) => {
    const paymentMethod = e.currentTarget.dataset.paymentMethod;
    onSelectPaymentMethod(paymentMethod);
  };

  const getPaymentMethodImage = (methodName) => {
    switch (methodName) {
      case "e-Mali":
        return emali;
      case "MoMo":
        return mtn_momo;
      case "Visa":
        return visa_mastercard;
      case "ePayNet":
        return epaynet;
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      className="w-full inset-0 fixed bg-black bg-opacity-40 backdrop-blur-sm z-10">
      <div className="rounded shadow-lg p-4 bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 md:w-2/5 lg:w-1/4 absolute">
        <h4 className="text-center text-sm mb-3">{heading}</h4>

        <div className="px-2 rounded">
          {isLoading ? (
            <div className="text-center rtl:text-left">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-accent animate-spin dark:text-gray-600 fill-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            paymentMethods.length > 0 &&
            paymentMethods.map((method, index) => (
              <div
                key={index}
                data-payment-method={method.methodName}
                onClick={handlePaymentMethodChange}
                className="epaynet rounded bg-accent p-2 cursor-pointer flex justify-start items-center text-sm font-bold gap-8 my-2">
                <img
                  className="h-8"
                  src={getPaymentMethodImage(method.methodName)}
                  alt={method.description}
                />
                <h5>{method.methodName}</h5>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
