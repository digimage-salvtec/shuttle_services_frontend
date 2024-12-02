import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";
import Bottom from "../components/Bottom";
import ConfirmModal from "../components/ConfirmModal";
import axios_client from "../axios_client";
import { DateFormatter } from "../components/DateFormatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

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
    booking: null,
  });

  const params = new URLSearchParams(location.search);
  const paymentmethod_id = params.get("paymentmethod");
  const reservation_id = params.get("reservation");
  const trip_reference = params.get("trip_ref");
  const shuttle_id = params.get("shuttle");
  const cellNumber = params.get("cellNumber");

  const loadData = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const [reservationRes, paymentMethodRes, shuttleRes] = await Promise.all([
        axios_client.get(
          `/bridgeGetReservations.php?reservation_id=${reservation_id}`
        ),
        axios_client.get(
          `/bridgeGetPaymentMethods.php?paymentmethods_id=${paymentmethod_id}`
        ),
        axios_client.get(`/bridgeGetShuttles.php?shuttle_id=${shuttle_id}`),
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

    // const totalToPay = reservation.seats_reserved * reservation.trip.trip_cost;
    const totalToPay = 0.01;

    let payload = {
      shuttle_id: reservation.shuttle_id,
      provider_id: reservation.provider_id,
      phone: reservation.phone,
      email: reservation.email,
      trip_id: reservation.trip_id,
      reservation_id: reservation.id,
      reservation_no: reservation.reservation_no,
      seats_reserved: reservation.seats_reserved,
      paymentstatus_id: reservation.paymentstatus_id,
      payment_amount: reservation.trip.trip_cost,
      service_charge: reservation.trip.service_charge,
      total_amount: totalToPay,
      paymentmethod_id: Number(paymentmethod_id),
      booking_status: 1,
    };

    payload = JSON.stringify(payload);
    try {
      const response = await axios_client.post(
        "/bridgeReceiveBooking.php",
        payload
      );

      const booking = response.data.data;
      setState((prev) => ({
        ...prev,
        message: response.message,
        booking,
        loading: false,
      }));

      if (booking) {
        if (paymentmethod_id == 1) {
          window.open(gatewayLink, "_blank");
          navigate(`/my-bookings?bookingId=${booking.id}`);
        }
        if (paymentmethod_id == 2) {
          setState((prev) => ({
            ...prev,
            loading: true,
          }));
          let payload = {
            cartBalance: totalToPay,
            transactionNumber: reservation.reservation_no,
            cellNumber: cellNumber,
            paymentMethod: paymentmethod_id,
          };

          payload = JSON.stringify(payload);

          try {
            const response = await axios_client.post(
              "https://www.epaynetsz.com/swift_bridge/bridgeReceiveBookingTransaction.php",
              payload
            );
            console.log(response);
            navigate(`/my-bookings?bookingId=${booking.id}`);
          } catch (error) {
            console.log(error);
          } finally {
            setState((prev) => ({
              ...prev,
              loading: false,
            }));
          }
        }
      }
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
  }, [paymentmethod_id]);

  const {
    reservation,
    paymentMethod,
    modalVisible,
    loading,
    shuttle,
    booking,
    error,
    message,
  } = state;

  // const totalToPay = reservation
  //   ? reservation.seats_reserved * reservation.trip.trip_cost
  //   : 0;
  const totalToPay = 0.01;

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
      <hr className="my-4" />

      {loading ? (
        <div role="status" className="text-center my-20">
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
          <span className="ml-4 text-primary text-lg">
            Preparing your booking...
          </span>
          <span className="sr-only">Preparing your booking...</span>
        </div>
      ) : !reservation ? (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-alt text-4xl my-4"
          />
          <p className="text-primary text-lg my-4">
            We could not complete that process!
          </p>
          <a
            className="px-4 py-3 bg-primary text-white text-lg block my-3 w-1/3 sm:w-1/5 m-auto"
            href={`/trip/${trip_reference}`}>
            Try Again
          </a>
          <em className="mt-20 block">
            If problem persists, contact support on{" "}
            <span className="font-bold">(+268) 2404 0524</span>{" "}
          </em>
        </div>
      ) : (
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
                className="hidden sm:block text-primary bg-white p-1 text-2xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
              />
              <div className="border-2 border-accent rounded py-2 px-6 w-full sm:w-1/2">
                <p className="text-xs underline text-gray-500 italic">
                  Going To
                </p>
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
              <span className="underline text-primary">{shuttle?.type}</span>
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

            {paymentMethod?.name === "ePayNet" && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
