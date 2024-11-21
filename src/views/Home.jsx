import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import hero_image from "../assets/shuttle_services_hero_alt.png";
import artwork from "../assets/deco-brush.svg";
import GeoCodingForm from "../components/GeoCodingForm";
import Trip from "../components/Trip";
import Loading from "../components/Loading";
import axios_client from "../axios_client";

const Home = () => {
  const { user, token } = useStateContext();

  const [trips, setTrips] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  const [validationErrors, setValidationErrors] = useState({});
  const location = useLocation();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(
      `/tripsearch?pickup=${pickupLocation}&dropoff=${dropoffLocation}&pickupdate=${pickupDate}`
    );
  };

  const getAllTrips = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios_client.get("/trips");
      setTrips(data.data);

      if(data.data.length <= 0)
        setError('No Trips Found')
    } catch (err) {
      console.log(err);
      if (err.code === "ERR_NETWORK") setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTrips();
  }, []);

  useEffect(() => {
    if (location.state?.validation_errors) {
      setValidationErrors(location.state.validation_errors);
    }
  }, [location]);

  return (
    <div>
      <section className="bg-diagonal-stripes h-[60vh] sm:h-[70vh] flex items-center w-full rounded-b-3xl pb-5">
        <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto flex flex-col-reverse sm:flex-row items-center justify-between h-full gap-5 sm:gap-10 pt-16">
          <div className="p-5 sm:p-10 bg-white w-full sm:w-3/5 rounded-3xl shadow-lg shadow-primary">
            <div className="relative">
              <img
                src={artwork}
                alt=""
                className="absolute w-24 sm:w-48 top-[-8px] left-[-10px]"
              />
              <h1
                style={{ lineHeight: "40px" }}
                className="relative z-2 font-bold leading-10 text-gray-600 text-lg sm:text-3xl text-center">
                Seamless travel starts here! Book your shuttle with ease, and
                explore more!
              </h1>
            </div>

            <div className="my-4 sm:my-7">
              <hr className="my-1 w-1/3 mx-auto border-primary border-[1px]" />
              <hr className="my-1 w-1/4 mx-auto border-primary border-[1px]" />
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <GeoCodingForm
                  name="pickuplocation"
                  placeholder="Pickup Location"
                  onPlaceSelect={(location) =>
                    setPickupLocation(location.properties.formatted)
                  }
                  className="p-2 rounded-md border border-accent border-2"
                />
                {validationErrors.pickup && (
                  <span className="block italic text-[10px] text-red-600">
                    {validationErrors.pickup}
                  </span>
                )}
              </div>

              <div>
                <GeoCodingForm
                  name="dropofflocation"
                  placeholder="Drop-off Location"
                  onPlaceSelect={(location) =>
                    setDropoffLocation(location.properties.formatted)
                  }
                  className="p-2 rounded-md border border-accent border-2"
                />
                {validationErrors.dropoff && (
                  <span className="block italic text-[10px] text-red-600">
                    {validationErrors.dropoff}
                  </span>
                )}
              </div>

              <div>
                <input
                  name="pickupdate"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="p-2 w-full rounded-md border border-accent border-2"
                />
                {validationErrors.pickupdate && (
                  <span className="block italic text-[10px] text-red-600">
                    {validationErrors.pickupdate}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="bg-primary text-white font-semibold p-2 rounded-md w-full col-span-1 md:col-span-3">
                Search Trips
              </button>
            </form>
          </div>

          <img
            className="hidden sm:block rounded-full w-1/3"
            src={hero_image}
            alt="young man and woman getting off a bus"
          />
        </div>
      </section>

      {/* Services Overview */}
      <section className="container max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto py-8">
        <h2 className="text-2xl font-bold mb-10 text-primary">Popular Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
          {isLoading ? (
            <>
              <Loading />
              <Loading />
            </>
          ) : error ? (
            <>{error}</>
          ) : (
            trips.map((trip, index) => {
              return <Trip key={index} trip={trip} />;
            })
          )}
        </div>
      </section>

      {/* Invitation to list CTA */}
      <section className="bg-gray-100 text-white py-10 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-20 items-center justify-center max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
          <img
            className="hidden sm:block rounded-3xl w-1/3"
            src={hero_image}
            alt="young man and woman getting off a bus"
          />

          <div className="w-full sm:w-1/3">
            <h2 className="font-bold text-primary text-2xl pl-4 border-l-4 border-primary">
              Become a partner.
            </h2>
            <p className="my-5 font-light text-gray-700 text-3xl">
              Expand your reach and let travellers find you with ease. Get
              listed on Swift Shuttle today
            </p>

            <Link
              className="inline-block rounded-full bg-primary text-white text-lg px-7 py-3 mt-6 hover:bg-accent hover:text-black"
              to="/become-a-partner">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
