import React from "react";
import { Link } from "react-router-dom";
import main_logo from "../assets/logo/swift_shuttle_logo_main.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const date = new Date();
  return (
    <div className="bg-primary text-white py-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 w-full max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
        <div className="logo-container">
          <div className="mb-2 flex  items-center gap-4">
            <img src={main_logo} alt="swift shuttle logo" className="w-16" />
            <a href="mailto:digimage@salvtec.co.sz">
              <FontAwesomeIcon className="text-gray-200" icon={faEnvelope} />
            </a>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <Link
              className="font-light text-sm underline text-gray-100"
              to="/privacy">
              Privacy Policy
            </Link>
            <Link
              className="font-light text-sm underline text-gray-100"
              to="/terms">
              Terms of Service
            </Link>            
          </div>
          <p className="font-light text-sm">
            &copy; {date.getFullYear()} Swift Shuttle. Powered by{" "}
            <a
              className="underline"
              href="https://salvtec.co.sz"
              target="_blank">
              Digimage
            </a>
          </p>
        </div>
        <div className="order-first sm:order-last text-end mb-6 sm:mb-0">
          <div className="mb-4 sm:m-0 mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Link
              className="font-light text-left text-sm underline text-gray-100"
              to="/about">
              About Us
            </Link>
            <Link
              className="font-light text-left text-sm underline text-gray-100"
              to="/knowledge-base">
              FAQs
            </Link>
            <Link
              className="font-light text-left text-sm underline text-gray-100"
              to="/providers">
              Providers
            </Link>
            <Link
              className="font-light text-left text-sm underline text-gray-100"
              to="/become-a-partner">
              Become a Partner
            </Link>
            <Link
              className="font-light text-left text-sm underline text-gray-100"
              to="/signup">
              Create Account
            </Link>
          </div>
          <a href="tel: +268 2404 0524">+268 2404 0524</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
