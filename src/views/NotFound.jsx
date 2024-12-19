import React from "react";
import { SearchOff } from "@mui/icons-material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto flex items-center flex-col justify-center h-[80vh]">
      <SearchOff sx={{ fontSize: "130px" }} className="text-primary" />
      <h3 className="my-4 text-gray-500 ">
        The resource you're trying to access isn't available on this server
      </h3>
      <br />
      <Link to="/" className="block px-4 py-2 bg-primary text-white">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
