import React, { useEffect, useState } from "react";
import Bottom from "../components/Bottom";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Provider from "../components/Provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faShare } from "@fortawesome/free-solid-svg-icons";
import axios_client from "../axios_client";
import ShareButton from "../components/ShareButton";

const Providers = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchForProvider = (e) => {
    e.preventDefault()
  }

  const get_providers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios_client.get("/providers");
      setProviders(data.data);
      console.log(providers)
    } catch (err) {
      console.log(err)
      const error = err.response;

      if (error.status === 422) {
        const validation_errors = error.data.errors;
        navigate("/", { state: { validation_errors } }); // Redirect back with errors
      } else {
        setError("Couldn't load shuttle providers. Try again...");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    get_providers();
  }, []);

  return (
    <div>
      <Bottom />

      <div className="py-4 mt-6">
        <div className="relative max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto ">
          <p className="text-center text-md sm:text-3xl text-primary w-1/2 mx-auto">
          Book Your Airport Shuttle, Local Transfer or Cross-border transport with Swift Shuttle
          </p>
        </div>
      </div>
      <div className="py-2 bg-primary">
        <div className="text-white max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto flex flex-col sm:flex-row items-center justify-between">
          <form onSubmit={searchForProvider} className="relative" >
            <input type="search" name="search" id="search" placeholder="Search providers..." className="text-sm bg-primary_opac rounded-full border-none py-1 text-white" />
            <FontAwesomeIcon icon={faSearch} className="absolute right-0 top-1/2 -translate-y-1/2 mr-4"/>
          </form>
          <ShareButton />
        </div>
      </div>
      {isLoading ? (
        <div className="flex gap-3 w-full max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
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
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 auto-cols-fr gap-8">
            {providers.length > 0 &&
              providers.map((provider, index) => <Provider key={index} provider={provider} />)}
          </div>
        </div>
      )}

      <Bottom />
    </div>
  );
};

export default Providers;
