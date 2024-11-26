import React from "react";
import Bottom from "../components/Bottom";
import we_are_building from "../assets/we_are_building.jpg";
import { Link } from "react-router-dom";

const PartnerPortal = () => {
  return (
    <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
      <Bottom />

      <div className="text-3xl flex flex-col items-center justify-center my-4">
        <img
          src={we_are_building}
          alt="we are still building"
          className="my-4 w-1/3 border-2 border-primary rounded-2xl"
        />
        <h3 className="my-8 text-gray-500 ">We're still builiding</h3>
        <p className="text-center my-6">
          Sooner, than later, you will be able to onboard yourself on Swift
          Shuttle
        </p>
        <br />
        <Link to="/" className="block p-4 bg-primary text-white">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default PartnerPortal;
