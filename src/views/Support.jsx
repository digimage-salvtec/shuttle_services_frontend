import React, { useState } from "react";
import Bottom from "../components/Bottom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCheck,
  faCheckDouble,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios_client from "../axios_client";

const Support = () => {
  const [email, setEmail] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const requestCancellation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      email: email,
      booking_ref: bookingRef,
    };

    payload = JSON.stringify(payload);

    try {
      const { data } = await axios_client.post(
        "/bridgeReceiveCancellationRequest.php",
        payload
      );

      if (data.message == "success") {
        setMessage("Your request to cancel the booking has been sent");
      }
    } catch (error) {
      console.log(error);
      setMessage("An unknown error occured");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
      <Bottom />
      <h3 className="mt-8 text-lg font-semibold text-primary">
        Cancelling a trip booking
      </h3>
      <hr className="h-px border-0 bg-accent my-1" />
      <form onSubmit={requestCancellation}>
        <p className="w-full sm:w-2/3 my-2 font-light">
          You can cancel a booking not late than{" "}
          <span className="font-bold text-primary">48 hours</span> before trip
          date. Cancellations are not automated. Send a cancellation request to
          us, and representative will contact you. For more details, please
          refer to our{" "}
          <a
            target="_blank"
            className="underline text-primary"
            href="/swift_bookings_terms_of_use.pdf">
            Terms of Use
          </a>
        </p>
        <div className="flex flex-col sm:flex-row items-end gap-6 w-full sm:2/3 my-4">
          {message ? (
            <div className="bg-primary rounded-lg p-4 text-center">
              <FontAwesomeIcon
                icon={faCheck}
                className="text-white text-3xl mb-4"
              />
              <p className=" text-white ">{message}</p>
            </div>
          ) : (
            <>
              <label htmlFor="email" className="flex flex-col w-full">
                Email Address
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  placeholder="Your email address"
                  className="py-2 text-sm outline-none border-accent focus:border-accent"
                />
              </label>
              <label htmlFor="bookingRef" className="flex flex-col w-full">
                Booking Reference
                <input
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  type="text"
                  id="bookingRef"
                  placeholder="Your booking reference"
                  className="py-2 text-sm outline-none border-accent focus:border-accent"
                />
              </label>
              <div className="flex items-end justify-end gap-2 w-full">
                <button
                  disabled={isSubmitting}
                  className={`text-center w-full p-2 rounded-sm ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-opacity-90"
                  }`}>
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon
                        className="mr-3 animate-spin"
                        icon={faSpinner}
                      />
                      Sending request...
                    </>
                  ) : (
                    <>
                      Request cancellation{" "}
                      <FontAwesomeIcon
                        className="ml-3 hidden sm:inline"
                        icon={faArrowRightLong}
                      />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </form>

      <h3 className="mt-8 text-lg font-semibold text-primary">
        Other inquiries
      </h3>
      <hr className="h-px border-0 bg-accent my-1" />
      <div className="w-full sm:w-2/3 my-2">
        For further assistance, contact us on:
        <ul className="space-y-1 text-gray-500 list-inside my-1">
          <li className="flex items-center">
            <svg
              className="w-3.5 h-3.5 me-2 text-alt dark:text-green-400 flex-shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <a
              className="underline text-primary"
              href="mailto:digimage@salvtec.co.sz">
              digimage@salvtec.co.sz
            </a>
          </li>
        </ul>
        <ul>
          <li className="flex items-center">
            <svg
              className="w-3.5 h-3.5 me-2 text-alt dark:text-green-400 flex-shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            (+268) 2404 0524
          </li>
        </ul>
      </div>
      <Bottom />
    </div>
  );
};

export default Support;
