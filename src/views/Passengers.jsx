import React, { useState } from "react";
import Bottom from "../components/Bottom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const Passengers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const reservation_id = params.get("reservation_id");
  const trip_ref = params.get("trip_ref");
  const number_of_passengers = params.get("number_of_passengers");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passenger_count, setPassenger_count] = useState(1);
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
    if (passenger_count < number_of_passengers) {
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
      setPassenger_count(passenger_count + 1);
    }
  };

  const handleRemovePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
    setPassenger_count(passenger_count - 1);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Passengers: ", passengers);
    return;
    setIsSubmitting(true);

    const payload = {
      reservation_id: reservation_id,
      trip_id: trip_id,
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      passport_no: passportNo,
      passport_expiry: passportExp,
    };

    try {
      const { data } = await axios_client.post("/passengers", payload);
      console.log(data);
    } catch (err) {
      const error = err.response;

      if (error.status === 422) {
        const validation_errors = error.data.errors;
        navigate(`/trip/${trip}`, { state: { validation_errors } }); // Redirect back with errors
      } else {
        setError("Error adding passengers. Try again...");
      }
    }
  };

  return (
    <div className="my-4 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
      <Bottom />
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 auto-cols-fr gap-8">
        <div className="col-span-1 sm:col-span-2">
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
                      type="text"
                      id={`passport-expiry-${index}`}
                      placeholder="Passport expiry date"
                      className="py-2 text-sm outline-none border-accent focus:border-accent"
                    />
                  </label>
                </div>
                {passengers.length >= number_of_passengers && (
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
            {passenger_count < number_of_passengers && (
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
            <div className="flex items-center gap-2 w-full mb-4">
              <button
                disabled={isSubmitting}
                className="bg-primary text-center text-lg w-full p-4 text-white rounded-sm hover:bg-opacity-90">
                {isSubmitting ? "Adding passengers..." : "Submit & Proceed"}
              </button>
            </div>
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
                <td className="p-3">{number_of_passengers}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Passengers;
