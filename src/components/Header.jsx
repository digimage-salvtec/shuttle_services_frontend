import React, { useContext, useState, useEffect } from "react";
import {
  faArrowLeftLong,
  faCartShopping,
  faDoorOpen,
  faGear,
  faHome,
  faInfoCircle,
  faTicket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStateContext } from "../context/ContextProvider";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button, Drawer, Dropdown } from "flowbite-react";
import logo from "../assets/logo/swift_shuttle_logo_main.png";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";

const Header = () => {
  const { setUser, token, setToken } = useStateContext();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const location = useLocation();

  useEffect(() => {
    if (isLoggedOut) {
      const timeoutId = setTimeout(() => {
        hideMessage();
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoggedOut]);

  const onLogout = (e) => {
    // e.preventDefault();

    setTimeout(() => {
      setIsLoggedOut(true);
    }, 2000);

    setUser({});
    setToken(null);

    handleClose();
  };

  const hideMessage = () => {
    setIsLoggedOut(false);
  };

  return (
    <div className="fixed top-0 w-full bg-primary rounded-b-3xl shadow-lg py-2 z-10">
      <div className="flex h-12 text-white items-center justify-between text-primary gap-4 w-full max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
        <div className="flex items-center gap-2">
          <button
            className="block sm:hidden"
            type="button"
            onClick={() => setIsOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 sm:w-8 sm:h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <a href="/">
            <img
              src={logo}
              alt="Shuttle Services Logo"
              className="w-16 sm:w-24"
            />
          </a>
        </div>

        <nav className="hidden sm:block">
          <ul className="flex items-center justify-between gap-6">
            <li className="hover:underline hover:opacity-90">
              <Link to="/trips">Trips</Link>
            </li>
            <li className="hover:underline hover:opacity-90">
              <Link to="/support">Support</Link>
            </li>
            <li className="hover:underline hover:opacity-90">
              <Link to="/become-a-partner">Get Listed</Link>
            </li>
          </ul>
        </nav>
        <Link
          to="/login"
          className="rounded-full px-3 sm:px-5 py-1 sm:py-2 bg-white text-primary">
          Sign In
        </Link>
      </div>

      <Drawer className="relatt" open={isOpen} onClose={handleClose}>
        <Drawer.Header title="Swift Shuttle - Options" />

        <Drawer.Items>
          <ul className="space-y-2 font-medium">
            <li onClick={handleClose}>
              <Link
                to="/trips"
                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <FontAwesomeIcon icon={faArrowRight} className="text-primary" />
                <span className="flex-1 ms-3 whitespace-nowrap">Trips</span>
              </Link>
            </li>
            <li onClick={handleClose}>
              <Link
                to="/support"
                className="flex items-center p-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <FontAwesomeIcon icon={faArrowRight} className="text-primary" />
                <span className="flex-1 ms-3 whitespace-nowrap">Support</span>
              </Link>
            </li>
            <li onClick={handleClose}>
              <Link
                to="/become-a-partner"
                className="flex items-center p-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <FontAwesomeIcon icon={faArrowRight} className="text-primary" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Get Listed
                </span>
              </Link>
            </li>
          </ul>
        </Drawer.Items>
        <div className="absolute py-3 bottom-0 w-full">
          <hr className="border-primary my-1 w-full" />
          <Link onClick={handleClose}
            to="/login"
            className="flex items-center py-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <FontAwesomeIcon icon={faGear} className="text-primary" />
            <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
          </Link>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
