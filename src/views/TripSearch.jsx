import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios_client from "../axios_client";
import Trip from "../components/Trip";
import Bottom from "../components/Bottom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpWideShort,
  faInfo,
  faInfoCircle,
  faLocation,
  faLocationArrow,
  faLocationPin,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { DateFormatter } from "../components/DateFormatter";
import Loading from "../components/Loading";
import ShareButton from "../components/ShareButton";

const TripSearch = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const pickupLocation = params.get("pickup");
  const dropoffLocation = params.get("dropoff");
  const pickupdate = params.get("pickupdate");

  const [trips, setTrips] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const search_trips = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios_client.get(
        `/bridgeTripSearch.php?pickup=${pickupLocation}&dropoff=${dropoffLocation}&pickupdate=${pickupdate}`
      );

      if (data.data) {
        if (data.data.length > 0) {
          setTrips(data.data);
        } else {
          setError(
            "We don't have trips to that destination, yet. Please try again later..."
          );
        }
      } else {
        if (data.errors) {
          const validation_errors = data.errors;
          navigate("/", { state: { validation_errors } }); // Redirect back with errors
        } else {
          setError("Couldn't load trips. Try again...");
        }
      }
    } catch (err) {
      if (err.response) {
        const error = err.response;
        if (error.status === 422) {
          const validation_errors = error.data.errors;
          navigate("/", { state: { validation_errors } }); // Redirect back with errors
        } else {
          setError("Couldn't load trips. Try again...");
        }
      } else {
        console.error("Unexpected error:", err);
        setError("Couldn't load trips. Please check your network connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    search_trips();
  }, []);

  return (
    <div>
      <Bottom />

      <div className="py-4 mt-6">
        <div className="my-4 max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
          <div className="relative flex flex-wrap sm:flex-nowrap items-center sm:gap-6">
            <div className="border-b-2 border-gray-200 flex flex-col w-1/2 sm:w-1/3">
              <p className="text-gray-500 text-xs underline">
                <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
                Leaving from
              </p>
              <p className="text-gray-400 text-ellipsis text-nowrap overflow-hidden ">
                {pickupLocation}
              </p>
            </div>
            <div className="border-b-2 border-gray-200 flex flex-col w-1/2 sm:w-1/3">
              <p className="text-gray-500 text-xs underline">
                <FontAwesomeIcon icon={faLocation} className="mr-2" />
                Going to
              </p>
              <p className="text-gray-400 text-ellipsis text-nowrap overflow-hidden ">
                {dropoffLocation}
              </p>
            </div>
            <div className="border-b-2 border-gray-200 flex flex-col items-center sm:items-start my-2 w-full sm:w-1/3">
              <p className="text-gray-500 text-xs underline">Pickup Date</p>
              <p className="text-gray-400 ">
                <DateFormatter dateString={pickupdate} />
              </p>
            </div>
          </div>
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
          <div className="mt-4 text-center">
            <FontAwesomeIcon icon={faInfoCircle} className="text-5xl mb-6 text-alt"/>
            <p className="text-center my-4 text-2xl font-light">{error}</p>
          </div>
        </div>
      ) : (
        <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
          <span className="italic mt-3 text-sm block">
            Results include related trips...
          </span>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 auto-cols-fr gap-8">
            {trips?.length > 0 &&
              trips.map((trip, index) => <Trip key={index} trip={trip} />)}
          </div>
        </div>
      )}

      <Bottom />
    </div>
  );
};

export default TripSearch;
