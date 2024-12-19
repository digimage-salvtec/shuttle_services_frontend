import React, { useEffect, useState } from "react";
import Bottom from "../components/Bottom";
import { useStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import axios_client from "../axios_client";
import { Link } from "react-router-dom";

// vehicles
import bus from "../assets/vehicles/bus-illustration.png";
import sprinter from "../assets/vehicles/van-illustration.png";
import sedan from "../assets/vehicles/sedan-illustration.png";
import suv from "../assets/vehicles/suv-illustration.png";
import family from "../assets/vehicles/7-seater-illustration.png";
import ShareButton from "../components/ShareButton";
import { DateFormatter } from "../components/DateFormatter";

const Profile = () => {
  const { user, setToken, setUser } = useStateContext();
  const [bookings, setBookings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserBookings = async () => {
    setLoading(true);

    try {
      const { data } = await axios_client.get(
        `/bridgeGetUserBookings.php?email=${user.email}`
      );
      setBookings(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserBookings();
  }, [user]);

  const onLogout = (e) => {
    e.preventDefault();

    setTimeout(() => {
      setIsLoggedOut(true);
    }, 2000);

    setUser({});
    setToken(null);
  };

  const vehicleImages = {
    Bus: bus,
    Sprinter: sprinter,
    Private: sedan,
    SUV: suv,
    Family: family,
  };

  return (
    <>
      <Bottom />
      <div className="my-6">
        <div className="rounded-2xl bg-accent shadow-lg py-3 px-6 mb-6 flex items-center justify-between">
          <p className="font-semibold text-lg">Hi {user.firstname}</p>
          <button
            onClick={onLogout}
            className="rounded-full px-4 py-2 bg-white text-primary">
            Sign out
            <FontAwesomeIcon icon={faSignOut} className="ml-2" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="p-4 rounded-2xl bg-primary bg-opacity-20 w-full">
            <p className="font-bold mb-4">All My Bookings</p>
            {bookings?.length > 0 ? (
              bookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center my-2 bg-white rounded-lg shadow-lg py-3">
                  <img
                    src={vehicleImages[booking.shuttle?.type]}
                    alt={vehicleImages[booking.shuttle?.type]}
                    className="w-1/2 sm:w-1/4"
                  />

                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <tbody>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            From
                          </th>
                          <td className="px-2 py-1">{booking.trip.from}</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            To
                          </th>
                          <td className="px-2 py-1">{booking.trip.to}</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Shuttle
                          </th>
                          <td className="px-2 py-1">{booking.provider.name}</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Booking Ref
                          </th>
                          <td className="px-2 py-1 text-primary underline">
                            {booking.booking_reference}
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Date of Booking
                          </th>
                          <td className="px-2 py-1">
                            <DateFormatter dateString={booking.created_at} />
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Trip date
                          </th>
                          <td className="px-2 py-1">
                            <DateFormatter
                              dateString={booking.trip.pickupdate}
                            />
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Passengers
                          </th>
                          <td className="px-2 py-1">
                            Total: {booking.passengers.length}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <>
                <p>You have not made any bookings</p>
                <Link
                  className="rounded my-2 block w-full sm:w-1/3 bg-primary text-center text-white py-2 px-4 "
                  to="/trips">
                  Start your journey
                </Link>
              </>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-alt bg-opacity-20 w-full">
            <p className="font-bold mb-4">All My Reservations</p>
            {reservations?.length > 0 ? (
              reservations.map((booking, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center my-2 bg-white rounded-lg shadow-lg py-3">
                  <img src={bus} alt="" className="w-1/2 sm:w-1/4" />

                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <tbody>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            From
                          </th>
                          <td className="px-2 py-1">{booking.trip.from}</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            To
                          </th>
                          <td className="px-2 py-1">{booking.trip.to}</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Shuttle
                          </th>
                          <td className="px-2 py-1">{booking.provider.name}</td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Booking Ref
                          </th>
                          <td className="px-2 py-1 text-primary underline">
                            {booking.booking_reference}
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Trip date
                          </th>
                          <td className="px-2 py-1">
                            <DateFormatter
                              dateString={booking.trip.pickupdate}
                            />
                          </td>
                        </tr>
                        <tr className="bg-white dark:bg-gray-800">
                          <th
                            scope="row"
                            className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Passengers
                          </th>
                          <td className="px-2 py-1">
                            Total: {booking.passengers.length}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <>
                <p>You have 0 pending reservations</p>
                <Link
                  className="rounded my-2 block w-full sm:w-1/3 bg-primary text-center text-white py-2 px-4 "
                  to="/trips">
                  Start your journey
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
