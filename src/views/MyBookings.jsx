import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios_client from "../axios_client";
import Bottom from "../components/Bottom";
import success from "../assets/icons8-success.gif";
import pending from "../assets/icons8-dots-loading.gif";
import { Checkmark, XMark } from "../components/Animations";

const MyBookings = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookingId = params.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let interval;

    const getBooking = async () => {
      try {
        const { data } = await axios_client.get(
          `/bridgeGetBookings.php?bookingId=${bookingId}`
        );
        const bookingData = data.data;

        setBooking(bookingData);

        // Stop polling if booking_status is 1 or 3
        if (
          bookingData?.booking_status === 2 ||
          bookingData?.booking_status === 3
        ) {
          clearInterval(interval);
        }
      } catch (error) {
        console.log(error);
        clearInterval(interval);
      } finally {
        setIsLoading(false);
      }
    };

    getBooking();
    interval = setInterval(getBooking, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const loading = () => (
    <div className="text-center m-20">
      <div role="status">
        <svg
          aria-hidden="true"
          className="inline w-12 h-12 text-gray-200 animate-spin dark:text-primary fill-primary"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.635 70.6331 15.5151C75.2735 18.3952 79.3347 22.2335 82.5849 26.7925C84.9175 30.2018 86.799 33.9183 88.1811 37.8372C89.083 40.168 91.5422 41.6006 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="ml-4 text-primary text-lg">Processing payment...</span>
        <span className="sr-only">Processing payment...</span>
      </div>
    </div>
  );

  const renderPaymentStatus = () => {
    if (booking?.booking_status === 1) {
      return (
        <div className="flex items-center justify-center flex-col">
          <img src={pending} alt="Payment pending..." className="mx-auto" />
          <div className="my-4 text-center">
            <p className="text-2xl text-gray-600 mt-4">
              Payment pending approval...
            </p>
            <small className="block">
              Please make sure you have approved the payment on your chosen
              platform
            </small>
          </div>
        </div>
      );
    }
    if (booking?.booking_status === 2) {
      return (
        <div className="flex items-center justify-center flex-col">
          <Checkmark />

          <div className="my-4 text-center">
            <p className="text-2xl text-gray-600 mt-4">
              Payment completed successfully!
            </p>
            <small className="block ">
              We have sent the booking confirmation to your email address
            </small>
          </div>
          <Link
            className="px-4 py-3 text-white text-lg text-center rounded-sm my-4 block bg-primary hover:bg-opacity-70 w-full sm:w-1/6 mx-auto"
            to="/profile">
            Show details here
          </Link>
        </div>
      );
    }
    if (booking?.booking_status === 3) {
      return (
        <div className="flex items-center justify-center flex-col">
          <Checkmark />

          <div className="my-4 text-center">
            <p className="text-2xl text-gray-600 mt-4">
              System failed to process this transaction!
            </p>
            <small className="block ">
              Something went wrong while we were trying to verify your payment!
            </small>
          </div>

          <Link
            className="text-center block underline text-primary text-lg"
            to="/support">
            Contact support
          </Link>
        </div>
      );
    }
    return loading();
  };

  return (
    <div className="my-4 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
      <Bottom />

      <p className="text-primary text-center text-lg sm:text-2xl mt-4 mb-1 font-bold">
        Complete Booking
      </p>

      <hr className="mb-8" />
      {isLoading ? loading() : renderPaymentStatus()}
    </div>
  );
};

export default MyBookings;
