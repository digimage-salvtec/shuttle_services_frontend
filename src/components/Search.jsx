import { faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import axios_client from "../axios_client";
import { Link } from "react-router-dom";

const Search = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchForEvents = async () => {
    try {
      const { data } = await axios_client.post(
        `/bridgeSearch.php?search=${searchTerm}`
      );

      if (data.length > 0) {
        setSearchResults(data);
      } else {
        setErrorMessage(`No results for "${searchTerm}"`);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Something isn't right, but it's not your fault.");
    }
  };

  useEffect(() => {
    if (searchTerm.length > 3) {
      searchForEvents();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="relative border-2 rounded-md border-accent">
      <input
        className="w-full rounded-md focus:border-primary focus:outline-none focus:ring-primary text-sm px-3 py-2 sm:px-4 sm:py-3 text-primary"
        type="text"
        id="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by venue, or artist..."
      />
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute right-2 sm:right-5 top-3 sm:top-4 sm:text-lg text-primary"
      />

      {searchResults.length > 0 ? (
        <div className="py-1 text-sm bg-accent p-0">
          <Link
            to={`/search/${searchTerm}`}
            className="px-2 block my-1 font-light text-sm hover:bg-white w-full text-black pr-2 flex items-center justify-between">
            View all results for "{searchTerm}"
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>

          <hr className="my-2 bg-white" />

          <Link to={`/event/${searchResults[0]?.events_id}`}>
            <div className="mt-4 flex align-end justify-start gap-4 px-2">
              <img
                className="w-1/5"
                src={searchResults[0]?.image}
                alt="event image"
              />
              <div className="flex flex-col gap-2">
                <p>{searchResults[0]?.eventName}</p>
                <div className="flex flex-row gap-2">
                  <p className="text-xs font-light">
                    {searchResults[0]?.eventDate}
                  </p>
                  <p className="text-xs font-light">
                    {searchResults[0]?.venue}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        errorMessage && (
          <small className="px-3 py-2 block text-xs sm:text-lg">
            {errorMessage}
          </small>
        )
      )}
    </div>
  );
};

export default Search;
