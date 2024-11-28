import React, { useState } from "react";
import Bottom from "../components/Bottom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faMinus, faPlus, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios_client from "../axios_client";

const Passengers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const reservation_id = params.get("reservation");
  const paymentmethod_id = params.get("paymentmethod");
  const shuttle_id = params.get("shuttle");
  const cellNumber = params.get("cellNumber");
  const numberOfPassengers = params.get("passengers");
  const trip_ref = params.get("trip_ref");
  const trip_id = params.get("trip");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([
    {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      passportNo: "",
      passportExp: "",
    },
  ]);

  const handlePassengerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index][name] = value;
    setPassengers(updatedPassengers);
  };

  const handleAddPassenger = () => {
    if (passengerCount < numberOfPassengers) {
      setPassengers((prev) => [
        ...prev,
        {
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          passportNo: "",
          passportExp: "",
        },
      ]);
      setPassengerCount(passengerCount + 1);
    }
  };

  const handleRemovePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
    setPassengerCount(passengerCount - 1);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      passengers: passengers.map((passenger) => ({
        reservation_id: reservation_id,
        trip_id: trip_id,
        firstname: passenger.firstname,
        lastname: passenger.lastname,
        email: passenger.email,
        phone: passenger.phone,
        passport_no: passenger.passportNo,
        passport_expiry: passenger.passportExp,
      })),
    };

    payload = JSON.stringify(payload);

    try {
      const response = await axios_client.post(
        "bridgeReceivePassenger.php",
        payload
      );

      if (response.data.data) {
        navigate(
          `/booking?reservation=${reservation_id}&trip=${trip_id}&trip_ref=${trip_ref}&paymentmethod=${paymentmethod_id}&cellNumber=${cellNumber}&passengers=${numberOfPassengers}&shuttle=${shuttle_id}`
        );
      } else {
        setError("Could not add passengers. Please try again...");
      }
    } catch (err) {
      const error = err.response;
      console.log(err);

      if (error.status === 422) {
        const validation_errors = error.data.errors;
        navigate(`/trip/${trip}`, { state: { validation_errors } }); // Redirect back with errors
      } else {
        setError("Could not add passengers. Please try again...");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-4 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
      <Bottom />
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 auto-cols-fr gap-8">
        <div className="col-span-1 sm:col-span-2">
          {error && (
            <p className="border-l-2 border-alt px-4 py-2 bg-alt bg-opacity-70">
              {error}
            </p>
          )}
          <h2 className="text-2xl text-primary font-semibold mb-1">
            Who are you travelling with?
          </h2>
          <hr className="mb-6" />
          <form className="my-6" onSubmit={handleFormSubmit}>
            {passengers.map((passenger, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full mb-4">
                  <label
                    htmlFor={`firstname-${index}`}
                    className="flex flex-col w-full">
                    First name
                    <input
                      value={passenger.firstname}
                      onChange={(e) => handlePassengerChange(index, e)}
                      type="text"
                      name="firstname"
                      id={`firstname-${index}`}
                      placeholder="First name"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                  </label>
                  <label
                    htmlFor={`lastname-${index}`}
                    className="flex flex-col w-full">
                    Last name
                    <input
                      value={passenger.lastname}
                      onChange={(e) => handlePassengerChange(index, e)}
                      type="text"
                      name="lastname"
                      id={`lastname-${index}`}
                      placeholder="Last name"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full mb-4">
                  <label
                    htmlFor={`email-${index}`}
                    className="flex flex-col w-full">
                    Email Address
                    <input
                      value={passenger.email}
                      onChange={(e) => handlePassengerChange(index, e)}
                      type="email"
                      name="email"
                      id={`email-${index}`}
                      placeholder="Email address"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                  </label>
                  <label
                    htmlFor={`phone-${index}`}
                    className="flex flex-col w-full">
                    Mobile phone number
                    <input
                      value={passenger.phone}
                      onChange={(e) => handlePassengerChange(index, e)}
                      type="text"
                      name="phone"
                      id={`phone-${index}`}
                      placeholder="Mobile phone number"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full mb-4">
                  <label
                    htmlFor={`passport-number-${index}`}
                    className="flex flex-col w-full">
                    Passport number
                    <input
                      value={passenger.passportNo}
                      onChange={(e) => handlePassengerChange(index, e)}
                      type="text"
                      name="passportNo"
                      id={`passport-number-${index}`}
                      placeholder="Passport number"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                  </label>
                  <label
                    htmlFor={`passport-expiry-${index}`}
                    className="flex flex-col w-full">
                    Expiry date
                    <input
                      value={passenger.passportExp}
                      onChange={(e) => handlePassengerChange(index, e)}
                      type="date"
                      name="passportExp"
                      id={`passport-expiry-${index}`}
                      placeholder="Passport expiry date"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                  </label>
                </div>
                {passengers.length >= numberOfPassengers && (
                  <button
                    className="my-2 flex items-center gap-2"
                    onClick={() => handleRemovePassenger(index)}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="bg-alt p-2 rounded-full text-xs text-gray-2"
                    />
                    <span className="text-[11px]">Remove this entry</span>
                  </button>
                )}
              </div>
            ))}
            {passengerCount < numberOfPassengers && (
              <button
                className="my-4 flex items-center gap-2"
                onClick={handleAddPassenger}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className="bg-primary p-1 rounded-full text-xs text-white"
                />
                <span className="text-[11px]">Add new entry</span>
              </button>
            )}
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
                  Submit & Proceed
                  <FontAwesomeIcon className="ml-3" icon={faArrowRightLong} />
                </>
              )}
            </button>
          </form>
        </div>
        <div className="col-span-1 sm:col-span-1 bg-accent rounded-lg p-4 mt-8">
          <table className="w-full text-sm text-left rtl:text-right">
            <tbody>
              <tr className="odd:bg-gray-200 ">
                <td className="p-3">Reservation No.</td>
                <td className="p-3">{reservation_id}</td>
              </tr>
              <tr className="odd:bg-gray-200 ">
                <td className="p-3">Trip Ref.</td>
                <td className="p-3">{trip_ref}</td>
              </tr>
              <tr className="odd:bg-gray-200 ">
                <td className="p-3">No. of Passengers</td>
                <td className="p-3">{numberOfPassengers}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Passengers;
