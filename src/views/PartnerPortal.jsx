import React from "react";
import Bottom from "../components/Bottom";
import get_listed from "../assets/get-listed.jpg";
import { Link } from "react-router-dom";
import GeoCodingForm from "../components/GeoCodingForm";

const PartnerPortal = () => {
  return (
    <div>
      <section className="bg-diagonal-hero rounded-b-3xl py-12 sm:py-16">
        <Bottom />
        <div className="max-w-90p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto flex flex-col items-start text-white">
          <h2 className="text-lg font-bold border-l-4 border-primary pl-4 my-4">
            Onboarding
          </h2>
          <p className="my-2 text-3xl sm:text-5xl w-full sm:w-1/2">
            Expand your reach & let travellers find your services with ease.
          </p>
        </div>
      </section>
      <div className="my-4 sm:my-10 flex flex-col sm:flex-row items-center gap-20 justify-between max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
        <div className="hidden sm:block relative w-64 h-96 mx-auto my-8 perspective-1000">
          <div className="absolute w-full h-full top-0 left-0 transform rotate-3 translate-y-4 z-10">
            <img
              className="w-full h-full object-cover shadow-lg"
              src={get_listed}
              alt="Card 1"
            />
          </div>

          <div className="absolute w-full h-full top-0 left-0 transform rotate-1 translate-y-8 z-20">
            <img
              className="w-full h-full object-cover shadow-lg"
              src={get_listed}
              alt="Card 2"
            />
          </div>

          <div className="absolute w-full h-full top-0 left-0 transform rotate-[-2] translate-y-12 z-30">
            <img
              className="w-full h-full object-cover shadow-lg"
              src={get_listed}
              alt="Card 3"
            />
          </div>

          <div className="absolute w-full h-full top-0 left-0 transform rotate-[-4] translate-y-16 z-40">
            <img
              className="w-full h-full object-cover shadow-lg"
              src={get_listed}
              alt="Card 4"
            />
          </div>

          <div className="absolute bottom-0 w-full h-24 opacity-30 z-5">
            <img
              className="w-full h-full object-cover transform rotate-x-180 scale-y-100"
              src={get_listed}
              alt="Reflection 1"
            />
          </div>

          <div className="absolute bottom-0 w-full h-24 opacity-20 z-4">
            <img
              className="w-full h-full object-cover transform rotate-x-180 scale-y-90"
              src={get_listed}
              alt="Reflection 2"
            />
          </div>

          <div className="absolute bottom-0 w-full h-24 opacity-10 z-3">
            <img
              className="w-full h-full object-cover transform rotate-x-180 scale-y-80"
              src={get_listed}
              alt="Reflection 3"
            />
          </div>
        </div>

        <div className="w-full sm:w-2/3 py-10">
          <h2 className="font-bold text-primary text-2xl">
            Why list with Swift Bookings?
          </h2>

          <ul className="space-y-1 text-gray-500 list-inside my-4">
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-alt dark:text-green-400 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Instant access to a wide community of travellers
            </li>
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-alt dark:text-green-400 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Get listed instantly
            </li>
            <li className="flex items-center">
              <svg
                className="w-3.5 h-3.5 me-2 text-alt dark:text-green-400 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Flexible cancellation policy
            </li>
          </ul>

          <div className="text-2xl mt-8 font-light pl-4 border-l-4 border-primary">
            Sooner than later, you'll be able to onboard yourself. To get
            listed, contact us on:
            <ul className="mt-4">
              <li className="flex items-center">
                <svg
                  className="w-3.5 h-3.5 me-2 text-primary dark:text-green-400 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>

                <a
                  className="underline text-primary text-sm"
                  href="mailto:swiftshuttle@salvsystems.com">
                  swiftshuttle@salvsystems.com
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-3.5 h-3.5 me-2 text-primary dark:text-green-400 flex-shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>

                <a
                  className="underline text-primary text-sm"
                  href="tel:+268 2404 0524">
                  +268 2404 0524
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPortal;
