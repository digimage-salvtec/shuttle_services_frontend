import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  faArrowRightLong,
  faClockFour,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import axios_client from "../axios_client";
import seat_icon from "../assets/seat_icon.png";
import Bottom from "../components/Bottom";
import TimeConverter from "../components/TimeConverter";

// vehicles
import bus from "../assets/vehicles/bus-illustration.png";
import Sprinter from "../assets/vehicles/van-illustration.png";
import sedan from "../assets/vehicles/sedan-illustration.png";
import suv from "../assets/vehicles/suv-illustration.png";
import seven_seater from "../assets/vehicles/7-seater-illustration.png";
import { DateFormatter } from "../components/DateFormatter";

const MyBookings = () => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SZ", {
      style: "currency",
      currency: "SZL",
    }).format(amount);
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const bookingId = params.get("bookingId");
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const donwnloadAsTicket = () => {
    const bookingContainer = document.getElementById("booking-container");

    html2canvas(bookingContainer, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const doc = jsPDF();

      doc.addImage(imgData, "PNG", 10, 10, 180, 0);
      doc.save("booking_ticket.pdf");
    });
  };

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

  useEffect(() => {
    if (booking) {
      switch (booking.booking_status) {
        case 1:
          setMessage("Payment pending approval...");
          break;
        case 2:
          setMessage("Payment succesfully completed");
          break;
        case 3:
          setMessage("Payment failed. Try again...");
          break;
        default:
          setIsLoading(true);
          break;
      }
    }
  }, [booking]);

  const vehicleImages = {
    Bus: bus,
    Sprinter: Sprinter,
    Sedan: sedan,
    SUV: suv,
    Family: seven_seater,
  };

  const vehicleImage = vehicleImages[booking?.shuttle?.type];

  return (
    <div className="my-4 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
      <Bottom />

      <p className="text-primary text-lg sm:text-2xl mt-4 mb-1 font-bold">
        My Bookings
      </p>

      <hr />
      {isLoading ? (
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
            <span className="ml-4 text-primary text-lg">Loading...</span>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : booking?.booking_status === 2 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 auto-cols-fr gap-8">
          <div
            id="booking-container"
            className="rounded-lg shadow-lg py-2 px-6 border-t-2 border-primary ">
            {booking.trip.pickups ? (
              <div className="py-2 flex items-center relative text-center">
                <p className="text-ellipsis text-nowrap overflow-hidden w-full sm:w-1/2 rounded-full bg-accent px-3 py-[1px] text-xs">
                  Pick up from {booking.trip.from}
                </p>
              </div>
            ) : (
              <div className="py-2 flex items-center relative text-center">
                <p className="text-ellipsis text-nowrap overflow-hidden w-full sm:w-1/2 rounded-l-full bg-accent px-3 py-[1px] text-xs">
                  {booking.trip.from}
                </p>
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500"
                />
                <p className="text-ellipsis text-nowrap overflow-hidden w-full sm:w-1/2 rounded-r-full bg-primary_opac bg-opacity-90 px-3 py-[1px] text-xs">
                  {booking.trip.to}
                </p>
              </div>
            )}

            <div className="flex flex-wrap pb-2">
              <div className="w-2/5 sm:w-1/5">
                <img
                  src={vehicleImage}
                  alt={booking?.shuttle?.type}
                  className="w-20 rounded shadow-md mr-4 bg-gray-50"
                />
              </div>

              <div className="w-3/5 sm:w-2/5">
                <h2 className="text-primary font-bold text-2xl text-ellipsis text-nowrap overflow-hidden">
                  {booking?.provider?.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <p className="border-[1px] border-primary text-primary rounded text-[10px] sm:text-xs px-2">
                    {booking?.shuttle?.type}
                  </p>
                  {!booking.trip.pickups && (
                    <div className="mx-2 gap-1 text-ellipsis text-nowrap overflow-hidden">
                      <FontAwesomeIcon
                        icon={faClockFour}
                        className="text-xs text-primary"
                      />
                      <small className="inline mx-1 font-light ">
                        <TimeConverter time={booking.trip.trip_time} />
                      </small>
                    </div>
                  )}
                </div>
                <div className="flex items-center mt-2">
                  <img
                    className="inline"
                    src={seat_icon}
                    alt="seat icon"
                    width={"15px"}
                  />

                  <small className="inline mx-2 font-light">
                    {booking.seats_reserved} seats reserved
                  </small>
                </div>
                {!booking.trip.pickups && (
                  <small className="mt-2 block font-light">
                    Booked for:{" "}
                    <span className="underline">
                      <DateFormatter dateString={booking.trip.pickupdate} />
                    </span>
                  </small>
                )}
              </div>

              <div className="w-full sm:w-2/5 mt-5 sm:mt-0  flex flex-col items-start sm:items-end justify-between">
                <h2 className="text-primary font-bold text-2xl">
                  {formatCurrency(booking.trip.fee)}
                </h2>
                {booking.booking_status === 1 && (
                  <span className="text-xs font-light mt-2">
                    Status: <span className="text-primary underline">Paid</span>
                  </span>
                )}

                <span className="text-xs font-light mt-2">
                  Ref:{" "}
                  <span className="text-primary underline">
                    {booking.booking_reference}
                  </span>
                </span>
                <p className="text-xs font-light my-3">
                  Free cancellation up to{" "}
                  {booking?.provider?.cancellation_policy} hrs
                </p>
                <button
                  onClick={donwnloadAsTicket}
                  className="w-full text-center bg-primary rounded-full px-4 font-semibold py-2 text-white hover:bg-opacity-80 mt-3">
                  Download as Ticket
                  <FontAwesomeIcon icon={faDownload} className="ml-2 text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg">{message}</p>
      )}
    </div>
  );
};

export default MyBookings;
