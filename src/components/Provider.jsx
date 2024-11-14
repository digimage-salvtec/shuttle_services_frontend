import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCab,
  faClockFour,
  faEnvelope,
  faGlobe,
  faGlobeAfrica,
  faLocationPin,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import provider_img from "../assets/unknown_provider_thumbnail.svg";
import TimeConverter from "./TimeConverter";
import { DateFormatter } from "./DateFormatter";

const Provider = ({ provider }) => {
  return (
    <div className="rounded-lg shadow-lg py-2 px-3 border-t-2 border-primary flex gap-6">
      <img src={provider_img} alt="Provider Logo" className="w-1/3" />
      <div className="w-2/3">
        <p className="text-lg text-primary font-semibold">{provider.name}</p>
        <div className="flex items-center my-1 gap-2">
          <FontAwesomeIcon
            icon={faLocationPin}
            className="text-xs text-primary"
          />
          <small className="text-gray-600">{provider.location}</small>
        </div>
        <div className="flex items-center my-1 gap-2">
          <FontAwesomeIcon icon={faCab} className="text-xs text-primary" />
          <small className="text-gray-600">{provider.available_vehicles}</small>
        </div>
        <div className="mt-3 px-2 pt-1 border-t-[1px] border-accent rounded">
          <p className="text-[10px]">Book directly</p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${provider.email}`}>
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-sm text-primary hover:text-alt"
              />
            </a>
            <a href={`tel:${provider.contact}`}>
              <FontAwesomeIcon
                icon={faPhone}
                className="text-sm text-primary hover:text-alt"
              />
            </a>
            {provider?.website && (
              <a href={`${provider?.website}`}>
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="text-sm text-primary hover:text-alt"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Provider;
