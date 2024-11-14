import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";
import Bottom from "../components/Bottom";
import ConfirmModal from "../components/ConfirmModal";
import axios_client from "../axios_client";
import { DateFormatter } from "../components/DateFormatter";
import TimeConverter from "../components/TimeConverter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearReservations } = useContext(ReservationContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SZ", {
      style: "currency",
      currency: "SZL",
    }).format(amount);
  };

  const [state, setState] = useState({
    error: "",
    message: "",
    gatewayURL: "",
    loading: false,
    modalVisible: false,
    paymentMethod: null,
    reservation: null,
    shuttle: null,
  });

  const params = new URLSearchParams(location.search);
  const paymentmethod_id = params.get("paymentmethod");
  const reservation_id = params.get("reservation");
  const shuttle_id = params.get("shuttle");

  const loadData = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const [reservationRes, paymentMethodRes, shuttleRes] = await Promise.all([
        axios_client.get(`/reservations/${reservation_id}`),
        axios_client.get(`/payment-methods/${paymentmethod_id}`),
        axios_client.get(`/shuttles/${shuttle_id}`),
      ]);

      setState((prev) => ({
        ...prev,
        reservation: reservationRes.data.data,
        paymentMethod: paymentMethodRes.data.data,
        shuttle: shuttleRes.data.data,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: `An error: ${error} occured`,
        loading: false,
      }));
    }
  };

  const handleCancelBooking = () =>
    setState((prev) => ({ ...prev, modalVisible: true }));

  const handleConfirm = () => {
    clearReservations();
    localStorage.removeItem("RESERVATIONS");
    navigate("/trips", { state: { message: "Booking has been canceled" } });
    setState((prev) => ({ ...prev, modalVisible: false }));
  };

  const handleCancel = () =>
    setState((prev) => ({
      ...prev,
      modalVisible: false,
    }));

  const makeBooking = async () => {
    const { reservation, paymentMethod } = state;
    if (!reservation || !paymentMethod) return;

    setState((prev) => ({ ...prev, loading: true }));
    const totalToPay = reservation.seats_reserved * reservation.trip.trip_cost;

    let payload = {
      shuttle_id: reservation.shuttle_id,
      provider_id: reservation.provider_id,
      phone: reservation.phone,
      email: reservation.email,
      reservation_id: reservation.id,
      seats_reserved: reservation.seats_reserved,
      paymentstatus_id: reservation.paymentstatus_id,
      payment_amount: reservation.trip.trip_cost,
      service_charge: reservation.trip.service_charge,
      total_amount: totalToPay,
      paymentmethod_id: paymentmethod_id,
      booking_status: 2,
    };

    try {
      const response = await axios_client.post("/bookings", payload);
      setState((prev) => ({
        ...prev,
        message: response.message,
        loading: false,
      }));

      if (response.status === 201) {
        window.open(gatewayLink, "_blank"); 
      }
      // handleConfirm();
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev) => ({
        ...prev,
        error: "An error occurred",
        loading: false,
      }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const {
    reservation,
    paymentMethod,
    modalVisible,
    loading,
    shuttle,
    error,
    message,
  } = state;

  const totalToPay = reservation
    ? reservation.seats_reserved * reservation.trip.trip_cost
    : 0;
  let gatewayLink = `https://www.epaynetsz.com/ePayNetCart/gt00001.php?c=39303530&2c=37&3c=3132&tb=${totalToPay}&tn=${reservation?.reservation_no}`;

  return (
    <div className="my-4 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
      <Bottom />

      {modalVisible && (
        <ConfirmModal
          message="Are you sure you want to cancel this booking?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      <p className="text-center text-primary text-2xl font-bold mt-4">
        Review Booking & Pay
      </p>
      <div className="my-8 items-start grid grid-cols-1 sm:grid-cols-5 auto-cols-fr gap-8">
        <div className="col-span-1 sm:col-span-3 rounded shadow-lg p-4">
          <p className="text-primary font-smibold text-lg underline">
            Your Reservation Details
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full relative">
            <div className="border-2 border-accent rounded py-2 px-6 w-full sm:w-1/2">
              <p className="text-xs underline text-gray-500 italic">
                Leaving From
              </p>
              <p className="text-lg font-bold text-primary my-2">
                {reservation?.trip?.from}
              </p>
            </div>
            <FontAwesomeIcon
              icon={faArrowRightLong}
              className="hidden sm:block text-primary bg-white p-1 text-3xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
            />
            <div className="border-2 border-accent rounded py-2 px-6 w-full sm:w-1/2">
              <p className="text-xs underline text-gray-500 italic">Going To</p>
              <p className="text-lg font-bold text-primary my-2">
                {reservation?.trip?.to}
              </p>
            </div>
          </div>
          <p className="mt-2 border-l-2 border-accent text-sm px-2">
            Pickup date:{" "}
            <DateFormatter dateString={reservation?.trip?.pickupdate} />
          </p>
          <p className="mt-2 border-l-2 border-accent text-sm px-2">
            Ride type:{" "}
            <span className="underline text-primary">{shuttle.type}</span>
          </p>
          <p className="mt-2 border-l-2 border-accent text-sm px-2">
            Trip Ref:{" "}
            <span className="underline text-primary">
              {reservation?.trip.trip_reference}
            </span>
          </p>
          <p className="mt-2 border-l-2 border-accent text-sm px-2">
            Reservation No:{" "}
            <span className="underline text-primary">
              {reservation?.reservation_no}
            </span>
          </p>

          <button
            className="underline text-red-700 hover:text-red-500 text-sm mt-8"
            onClick={handleCancelBooking}>
            Cancel
          </button>
        </div>
        <div className="col-span-1 sm:col-span-2 rounded shadow-lg p-4">
          <p className="text-primary font-semibold text-lg ">
            Paying with{" "}
            <span className="bg-accent text-gray-700 px-2">
              {paymentMethod?.name}
            </span>
          </p>
          {paymentMethod?.description && (
            <small className="text-xs italic">
              {paymentMethod.description}
            </small>
          )}

          <hr className="my-1" />

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <tbody>
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Trip Cost
                  </th>
                  <td className="px-6 py-4">
                    {formatCurrency(reservation?.trip.trip_cost)}
                  </td>
                </tr>
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Total Passengers
                  </th>
                  <td className="px-6 py-4">{reservation?.seats_reserved}</td>
                </tr>
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Total to Pay
                  </th>
                  <td className="px-6 py-4 font-bold text-lg text-primary">
                    {formatCurrency(totalToPay)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={makeBooking}
            className="text-center w-full my-6 py-4 bg-primary hover:bg-opacity-70 text-white text-lg"
            disabled={loading}>
            {loading ? "Processing..." : `Pay with ${paymentMethod?.name}`}
          </button>

          <small className="text-xs text-center block">
            Not registered with ePayNet?{" "}
            <a
              className="text-primary underline hover:text-gray-500"
              href="https://www.epaynetsz.com/ePayNetWeb/"
              target="_blank"
              rel="noopener noreferrer">
              Create Account Here
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Booking;
