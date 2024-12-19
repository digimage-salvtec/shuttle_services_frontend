import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faClockFour,
} from "@fortawesome/free-solid-svg-icons";
import seat_icon from "../assets/seat_icon.png";
import TimeConverter from "./TimeConverter";

// vehicles
import bus from "../assets/vehicles/bus-illustration.png";
import Sprinter from "../assets/vehicles/van-illustration.png";
import sedan from "../assets/vehicles/sedan-illustration.png";
import suv from "../assets/vehicles/suv-illustration.png";
import seven_seater from "../assets/vehicles/7-seater-illustration.png";
import { DateFormatter } from "./DateFormatter";
import { ReservationContext } from "../context/ReservationContext";
import { Link } from "react-router-dom";

const Trip = ({ trip }) => {
  const { addReservation } = useContext(ReservationContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SZ", {
      style: "currency",
      currency: "SZL",
    }).format(amount);
  };

  const vehicleImages = {
    Bus: bus,
    Sprinter: Sprinter,
    Private: sedan,
    SUV: suv,
    Family: seven_seater,
  };

  const vehicleImage = vehicleImages[trip?.shuttle?.type];

  return (
    <div className="rounded-lg shadow-lg py-2 px-6 border-t-2 border-primary ">
      <div className="py-2 flex items-center relative text-center">
        <p className="text-ellipsis text-nowrap overflow-hidden w-full sm:w-1/2 rounded-l-full bg-accent px-3 py-[2px] text-xs">
          {trip.from}
        </p>
        <FontAwesomeIcon
          icon={faArrowRightLong}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500"
        />
        <p className="text-ellipsis text-nowrap overflow-hidden w-full sm:w-1/2 rounded-r-full bg-primary_opac bg-opacity-90 px-3 py-[2px] text-xs">
          {trip.to}
        </p>
      </div>

      <div className="flex flex-wrap pb-2">
        <div className="w-2/5 sm:w-1/5">
          <img
            src={vehicleImage}
            alt={trip?.shuttle?.type}
            className="w-20 rounded shadow-md mr-4 bg-gray-50"
          />
        </div>

        <div className="w-3/5 sm:w-2/5">
          <h2 className="text-primary font-bold text-2xl text-ellipsis text-nowrap overflow-hidden">
            {trip?.provider?.name}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="border-[1px] border-primary text-primary rounded text-[10px] sm:text-xs px-2">
              {trip?.shuttle?.type}
            </p>

            {!trip.pickups && (
              <div className="mx-2 gap-1 text-ellipsis text-nowrap overflow-hidden">
                <FontAwesomeIcon
                  icon={faClockFour}
                  className="text-xs text-primary"
                />
                <small className="inline mx-1 font-light ">
                  <TimeConverter time={trip.trip_time} />
                </small>
              </div>
            )}
          </div>
          <span className="text-xs font-light italic">
            {trip?.category?.cat_name}
          </span>
          <div className="flex items-center">
            <img
              className="inline"
              src={seat_icon}
              alt="seat icon"
              width={"15px"}
            />
            {trip.pickups ? (
              <small className="inline mx-2 font-light">
                {trip.seats} seats, w/ luggage carrier
              </small>
            ) : (
              <small className="inline mx-2 font-light">
                {trip.seats} seats remaining
              </small>
            )}
          </div>
        </div>

        <div className="w-full sm:w-2/5 mt-5 sm:mt-0  flex flex-col items-start sm:items-end justify-between">
          <h2 className="text-primary font-bold text-2xl">
            {formatCurrency(trip.fee)}
          </h2>
          {trip.pickups === 0 && (
            <small className="my-2 block font-light underline">
              Leaves <DateFormatter dateString={trip.pickupdate} />
            </small>
          )}

          <Link
            to={`/trip/${trip.trip_reference}`}
            onClick={() => addReservation(trip)}
            className="mt-4 w-full sm:w-2/3 text-center bg-alt rounded-full px-4 font-semibold py-2 text-gray-700 hover:bg-opacity-70">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Trip;
