import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios_client from "../axios_client";
import Trip from "../components/Trip";
import Bottom from "../components/Bottom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/Loading";
import ShareButton from "../components/ShareButton";

const Trips = () => {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const get_trips = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios_client.get("/bridgeGetTrips.php");
      setTrips(data.data);
      console.log(data.data);
    } catch (err) {
      const error = err.response;

      if (error.status === 422) {
        const validation_errors = error.data.errors;
        navigate("/", { state: { validation_errors } });
      } else {
        setError("Couldn't load trips. Try again...");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    get_trips();
  }, []);

  return (
    <div>
      <Bottom />
      <div className="py-4 mt-6">
        <div className="relative max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto ">
          <p className="text-center text-2xl text-primary">
            Start Your Journey
          </p>
        </div>
      </div>
      <div className="py-2 bg-primary">
        <div className="text-white max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto flex items-center justify-between">
          <button className="bg-white bg-opacity-50 rounded-full px-3 py-1 text-sm">
            <FontAwesomeIcon icon={faArrowUpWideShort} className="mr-2" />{" "}
            <span className="text-gray-600">Price: Low to High</span>
          </button>
          <ShareButton />
        </div>
      </div>
      {isLoading ? (
        <div className="flex flex-col sm:flex-row gap-5 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
          <Loading />
          <Loading />
        </div>
      ) : error ? (
        <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
          <Bottom />
          <h1 className="mt-4">{error}</h1>
        </div>
      ) : (
        <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 auto-cols-fr gap-8">
            {trips.length > 0 &&
              trips.map((trip, index) => <Trip key={index} trip={trip} />)}
          </div>
        </div>
      )}

      <Bottom />
    </div>
  );
};

export default Trips;
