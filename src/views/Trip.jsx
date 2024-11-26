import React, { useContext, useEffect, useState } from "react";
import axios_client from "../axios_client";
import TimeConverter from "../components/TimeConverter";
import Bottom from "../components/Bottom";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationArrow,
  faLocation,
  faUser,
  faBriefcase,
  faInfoCircle,
  faCreditCard,
  faArrowRightLong,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { DateFormatter } from "../components/DateFormatter";
import { ReservationContext } from "../context/ReservationContext";

// vehicles
import bus from "../assets/vehicles/bus-illustration.png";
import sprinter from "../assets/vehicles/van-illustration.png";
import sedan from "../assets/vehicles/sedan-illustration.png";
import suv from "../assets/vehicles/suv-illustration.png";
import family from "../assets/vehicles/7-seater-illustration.png";
import ShareButton from "../components/ShareButton";

const Trip = () => {
  const { trip } = useParams();
  const { addReservation, removeReservation, updateReservation } =
    useContext(ReservationContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-SZ", {
      style: "currency",
      currency: "SZL",
    }).format(amount);
  };

  const vehicleImages = {
    Bus: bus,
    Sprinter: sprinter,
    Sedan: sedan,
    SUV: suv,
    Family: family,
  };

  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tripData, setTripData] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  // passenger information
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [passportExp, setPassportExp] = useState(new Date());
  const [extras, setExtras] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [totalToPay, setTotalToPay] = useState(0);

  const increment = () => {
    if (passengerCount < tripData.seats) {
      handleAddPassenger();

      setPassengerCount((prevCount) => {
        const newCount = prevCount + 1;
        handleUpdatePassengerCount(newCount);
        return newCount;
      });
    } else {
      setError(`This trip only accepts ${tripData.seats} passengers`);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        setError("");
      }, 3000);
    }
  };

  const decrement = () => {
    if (passengerCount > 1) {
      handleRemovePassenger();

      setPassengerCount((prevCount) => {
        const newCount = prevCount - 1;
        handleUpdatePassengerCount(newCount);
        return newCount;
      });
    } else {
      setError("Cannot remove primary passenger");
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        setError("");
      }, 3000);
    }
  };

  const handlePassengerCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10);
    if (!isNaN(newCount) && newCount >= 1 && newCount <= tripData.seats) {
      setPassengerCount(newCount);
      handleUpdatePassengerCount(newCount);
    } else {
      setPassengerCount(1);
    }
  };

  const handleAddPassenger = () => {
    addReservation({ ...tripData, trip_cost: tripData.trip_cost });
  };

  const handleRemovePassenger = () => {
    removeReservation({ ...tripData, trip_cost: tripData.trip_cost });
  };

  const handleUpdatePassengerCount = (newCount) => {
    updateReservation({ ...tripData, trip_cost: tripData.trip_cost }, newCount);
  };

  const getPaymentMethods = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios_client.get("/bridgeGetPaymentMethods.php");
      setPaymentMethods(data.data);
    } catch (err) {
      const error = err.response;
      if (error?.status === 404) {
        setError("Requested resource could not be found");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTrip = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data } = await axios_client.get(
        `/bridgeGetTrips.php?trip_reference=${trip}`
      );
      setTripData(data.data);
    } catch (err) {
      const error = err.response;
      if (error?.status === 404) {
        setError("Requested trip could not be found. Try again...");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTrip();
    getPaymentMethods();
  }, [trip]);

  useEffect(() => {
    if (tripData?.trip_cost) {
      setTotalToPay(tripData.trip_cost * passengerCount);
    }
  }, [passengerCount, tripData]);

  const vehicleImage = vehicleImages[tripData?.shuttle?.type];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      phone: phone,
      email: email,
      trip_id: tripData.id,
      shuttle_id: tripData.shuttle.id,
      provider_id: tripData.provider.id,
      pickupdate: tripData.pickupdate,
      seats_reserved: passengerCount,
      payment_method_id: Number(selectedOption),
    };

    payload = JSON.stringify(payload);
    const MAX_RETRIES = 3;
    let attempt = 0;

    const submitReservation = async () => {
      try {
        const response = await axios_client.post(
          "/bridgeReceiveReservation.php",
          payload
        );

        if (response.message === "Server error")
          setError(
            "Opps! Please try that again. If problem persists, contact support, on (+268) 2404 0524"
          );
        else return response.data;
      } catch (err) {
        if (attempt < MAX_RETRIES) {
          attempt++;
          return submitReservation();
        } else {
          const error = err.response;
          if (error.status === 422) {
            const validationErrors = error.data.errors;
            navigate(`/trip/${trip}`, { state: { validationErrors } }); // Redirect back with errors
          } else {
            setError("Error adding passengers. Try again...");
          }
        }
      }
    };

    try {
      let reservationData = await submitReservation();

      let passenger = {
        reservation_id: reservationData.id,
        trip_id: tripData.id,
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        passport_no: passportNo,
        passport_expiry: passportExp,
        extras: extras,
      };

      const { data } = await axios_client.post(
        "/bridgeReceivePassenger.php",
        JSON.stringify(passenger)
      );

      if (passengerCount > 1) {
        navigate(
          `/passengers?reservation=${reservationData.id}&trip=${tripData.id}&trip_ref=${tripData.trip_reference}&paymentmethod=${selectedOption}&cellNumber=${phone}&passengers=${passengerCount}&shuttle=${tripData?.shuttle.id}`
        );
      } else {
        navigate(
          `/booking?reservation=${reservationData.id}&trip=${tripData.id}&trip_ref=${tripData.trip_reference}&paymentmethod=${selectedOption}&cellNumber=${phone}&passengers=${passengerCount}&shuttle=${tripData?.shuttle.id}`
        );
      }
    } catch (err) {
      const error = err.response;

      if (error.status === 422) {
        const validationErrors = error.data.errors;
        navigate(`/trip/${trip}`, { state: { validationErrors } }); // Redirect back with errors
      } else {
        setError("Error adding trip. Try again...");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (location.state?.validationErrors) {
      setValidationErrors(location.state.validationErrors);
    }
  }, [location]);

  return (
    <div>
      {isLoading ? (
        <div className="text-center m-20">
          <Bottom />
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
            <span className="ml-4 text-primary text-sm sm:text-lg">
              Setting up your trip...
            </span>
            <span className="sr-only">Setting up your trip...</span>
          </div>
        </div>
      ) : tripData ? (
        <div>
          <Bottom />
          <div className="my-4 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
            <div className="relative flex flex-wrap sm:flex-nowrap items-center sm:gap-6">
              <div className="border-b-2 border-gray-200 flex flex-col w-1/2 sm:w-1/3">
                <p className="text-gray-500 text-xs underline">
                  <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
                  Leaving from
                </p>
                <p className="text-gray-400 text-ellipsis text-nowrap overflow-hidden ">
                  {tripData.from}
                </p>
              </div>
              <div className="border-b-2 border-gray-200 flex flex-col w-1/2 sm:w-1/3">
                <p className="text-gray-500 text-xs underline">
                  <FontAwesomeIcon icon={faLocation} className="mr-2" />
                  Going to
                </p>
                <p className="text-gray-400 text-ellipsis text-nowrap overflow-hidden ">
                  {tripData.to}
                </p>
              </div>
              <div className="border-b-2 border-gray-200 flex flex-col items-center sm:items-start my-2 w-full sm:w-1/3">
                <p className="text-gray-500 text-xs underline">Pickup Date</p>
                <p className="text-gray-400 ">
                  <DateFormatter dateString={tripData.pickupdate} />
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4 bg-primary">
            <div className="flex items-center justify-between py-4 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
              <p className="bg-accent rounded-full text-sm border-2 border-accent px-2">
                One Way
              </p>
              <ShareButton />
            </div>
          </div>

          {modalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-alt text-2xl"
                />
                <p className="text-center mt-3">{error}</p>
              </div>
            </div>
          )}

          <div className="my-8 items-start grid grid-cols-1 sm:grid-cols-3 auto-cols-fr gap-8 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
            <div className="col-span-1 sm:col-span-2">
              <div className="rounded-full flex items-center justify-between">
                <p className="p-0 flex items-center gap-3 sm:w-72 bg-accent rounded-full text-xs sm:text-sm border-2 border-accent sm:pr-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="m-0 bg-primary p-2 w-12 rounded-full text-white"
                  />
                  <span className="hidden sm:inline">
                    Passenger Information
                  </span>
                </p>
                <div className="flex items-center rounded-full bg-accent">
                  <button
                    type="button"
                    onClick={decrement}
                    className="bg-primary text-lg text-white rounded-full w-8 h-8">
                    -
                  </button>
                  <input
                    type="text"
                    value={passengerCount}
                    onChange={handlePassengerCountChange}
                    className="text-center px-2 w-8 h-8 border-none bg-transparent text-lg"
                  />
                  <button
                    type="button"
                    onClick={increment}
                    className="bg-primary text-lg text-white rounded-full w-8 h-8">
                    +
                  </button>
                </div>
              </div>

              <form className="my-6" onSubmit={handleFormSubmit}>
                <div className="mb-6 border-2 rounded-md px-3 py-2 flex flex-wrap items-start sm:items-center justify-between">
                  <p className="w-1/2 sm:w-1/5 text-sm">
                    Already have an Account?
                  </p>
                  <p className="w-1/2 sm:w-2/5 text-xs sm:text-sm text-gray-600">
                    Sign in for a faster & easier checkout process.
                  </p>
                  <Link
                    to="/login"
                    className="mt-4 sm:m-0 w-full sm:w-1/5 text-center bg-primary px-4 py-2 rounded text-white hover:bg-opacity-90">
                    Sign In
                  </Link>
                </div>

                <span className="bg-alt bg-opacity-30 border-l-4 border-red-500 inline-block px-3 py-1 text-xs text-gray-700 mt-1 mb-4">
                  We will use provided phone number for MoMo payments. Please
                  make sure it's registered, & correct
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full mb-4">
                  <label htmlFor="firstname" className="flex flex-col w-full">
                    First name
                    <input
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      type="text"
                      id="firstname"
                      placeholder="First name"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                    {validationErrors.firstname && (
                      <span className="block italic text-[10px] text-red-600">
                        {validationErrors.firstname}
                      </span>
                    )}
                  </label>
                  <label htmlFor="lastname" className="flex flex-col w-full">
                    Last name
                    <input
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      type="text"
                      id="lastname"
                      placeholder="Last name"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                    {validationErrors.lastname && (
                      <span className="block italic text-[10px] text-red-600">
                        {validationErrors.lastname}
                      </span>
                    )}
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                  <label htmlFor="email" className="flex flex-col w-full">
                    Email Address
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      id="email"
                      placeholder="Email address"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                    {validationErrors.email && (
                      <span className="block italic text-[10px] text-red-600">
                        {validationErrors.email}
                      </span>
                    )}
                  </label>
                  <label htmlFor="phone" className="flex flex-col w-full">
                    Mobile phone number
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="text"
                      id="phone"
                      placeholder="Mobile phone number"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                    {validationErrors.phone && (
                      <span className="block italic text-[10px] text-red-600">
                        {validationErrors.phone}
                      </span>
                    )}
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full mb-4">
                  <label
                    htmlFor="passport-number"
                    className="flex flex-col w-full">
                    Passport number
                    <input
                      value={passportNo}
                      onChange={(e) => setPassportNo(e.target.value)}
                      type="text"
                      id="passport-number"
                      placeholder="Passport number"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                    {validationErrors.passport_no && (
                      <span className="block italic text-[10px] text-red-600">
                        {validationErrors.passport_no}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="passport-expiry"
                    className="flex flex-col w-full">
                    Expiry date
                    <input
                      value={passportExp}
                      onChange={(e) => setPassportExp(e.target.value)}
                      type="date"
                      id="passport-expiry"
                      placeholder="Passport expiry date"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                    {validationErrors.passport_expiry && (
                      <span className="block italic text-[10px] text-red-600">
                        {validationErrors.passport_expiry}
                      </span>
                    )}
                  </label>
                </div>

                <div className="flex items-center gap-2 w-full mb-4">
                  <label htmlFor="exras" className="flex flex-col w-full">
                    Extras
                    <textarea
                      value={extras}
                      onChange={(e) => setExtras(e.target.value)}
                      name="extra"
                      id="exras"
                      rows={5}
                      className="py-1 text-sm outline-none border-accent"></textarea>
                  </label>
                </div>

                <div className="rounded-full flex items-center justify-between mt-6">
                  <p className="flex items-center gap-3 sm:w-72 bg-accent rounded-full text-xs sm:text-sm border-2 border-accent pr-2">
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      className="m-0 bg-primary p-2 rounded-full text-white"
                    />
                    <span className="inline">Choose Payment Method</span>
                  </p>
                </div>
                <div className="my-2">
                  {paymentMethods.map((method, index) => (
                    <label
                      key={index}
                      htmlFor={`payment_method-${index}`}
                      className="flex items-center w-full gap-4 py-2 px-6 my-2 cursor-pointer rounded border-[1px] border-accent">
                      <input
                        type="radio"
                        name="payment_method"
                        id={`payment_method-${index}`}
                        value={method.id}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      />
                      <div className="flex flex-col">
                        <span>{method.name} </span>
                        <span className="text-xs italic text-gray-400">
                          {method.description}{" "}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full mb-4">
                  <button
                    disabled={isSubmitting}
                    className={`text-center text-lg w-full p-4 rounded-sm ${
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
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue{" "}
                        <FontAwesomeIcon
                          className="ml-3"
                          icon={faArrowRightLong}
                        />
                      </>
                    )}
                  </button>
                </div>

                {passengerCount > 1 && (
                  <span className="italic text-xs font-light">
                    Add additional passengers in the next screen
                  </span>
                )}
              </form>
            </div>
            <div className="order-first sm:order-last col-span-1 sm:col-span-1 mt-16 border-b-4 border-primary bg-accent rounded relative">
              <img
                src={vehicleImage}
                alt={vehicleImage}
                className="-mt-16 left-1/2 -translate-x-1/2 absolute w-1/3 border-2 border-accent rounded-full bg-transparent"
              />

              <div className="text-center mt-16 mb-6">
                <p className="text-2xl font-bold text-primary">
                  {tripData?.provider?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {tripData?.shuttle?.type}, or similar
                </p>
              </div>

              <div className="border-y-[1px] border-white p-4 flex items-center justify-around">
                <div>
                  <div className="flex items-center justify-center gap-6">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-2xl text-primary"
                    />
                    <span className="text-2xl">{tripData.seats}</span>
                  </div>
                  <small className="block mt-2 text-lg font-light">
                    Passenger
                  </small>
                </div>
                <div className="inline-block min-h-[1em] w-0.5 self-stretch bg-gray-50"></div>
                <div>
                  <div className="flex items-center justify-center gap-6">
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      className="text-2xl text-primary"
                    />
                    <span className="text-2xl">
                      {Math.ceil(tripData.seats / 2)}
                    </span>
                  </div>
                  <small className="block mt-2 text-lg font-light">
                    Luggage
                  </small>
                </div>
              </div>

              <div className="border-b-[1px]  border-white p-4 flex items-center justify-between">
                <p className="text-center font-light w-1/2">
                  Estimated Trip Time
                </p>
                <p className="text-center w-1/2">
                  <TimeConverter time={tripData.trip_time} />
                </p>
              </div>
              <div className="border-b-[1px]  border-white p-4 flex items-center justify-between">
                <p className="text-center font-light w-1/2">Ride Price</p>
                <p className="text-center w-1/2 text-sm">
                  {formatCurrency(tripData.fee)} per seat
                </p>
              </div>

              <div className="border-b-[1px] border-white p-4 flex items-center justify-between">
                <p className="text-center font-light w-1/2">Services & Taxes</p>
                <p className="text-center w-1/2 text-sm">
                  {formatCurrency(tripData.service_charge)} per seat
                </p>
              </div>

              <div className="border-b-[1px] border-white p-4 flex items-center justify-between">
                <p className="text-center font-light w-1/2">Total to Pay</p>
                <div>
                  <p className="text-center w-1/2 font-bold text-primary text-2xl">
                    {formatCurrency(totalToPay)}
                  </p>
                  <span className="block text-xs font-light italic">
                    Incl. tax & services fees
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Trip;
