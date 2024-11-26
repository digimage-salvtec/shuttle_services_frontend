import React from "react";
import {
  faEnvelope,
  faMousePointer,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Bottom from "../components/Bottom.jsx";

const About = () => {
  return (
    <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
      <Bottom />
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-sm sm:text-2xl font-bold">Powered by Digimage (Pty) Ltd</h3>
      </div>
      <hr className="h-px border-0 bg-accent my-1" />

      <div className="mt-6 ">
        <h4 className="text-sm sm:text-lg font-bold underline">Legal</h4>
        <p className="my-1 font-light text-xs sm:text-sm text-justify">
          A private company with limited liability, incorporated in the Kingdom
          of Eswatini
        </p>
      </div>
      <hr className="h-px border-0 bg-accent my-4 w-full sm:w-1/2" />
      <p className="my-1 font-light text-xs sm:text-sm text-justify w-2/3">
        Our primary goal is customer satisfaction. If you have any suggestion
        on, are not satisfied, or you are displeased by the quality of the this
        product, we are always ready to assist accordingly. Reach out to us on
        the following platforms:
      </p>

      <div className="contacts my-8">
        <div className="flex items-center justify-start gap-6 my-4">
          <div className="icon w-1/5">
            <FontAwesomeIcon icon={faPhone} className="text-primary text-3xl" />
          </div>
          <div className="w-4/5">
            <p className="font-light">Telephone no.</p>
            <a className="font-bold text-xs sm:text-lg" href="tel:24040524">
              (+268) 2404 0524
            </a>
          </div>
        </div>
        <div className="flex items-center justify-start gap-6 my-4">
          <div className="icon w-1/5">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-primary text-3xl"
            />
          </div>
          <div className="w-4/5">
            <p className="font-light">Email Address</p>
            <a
              className="font-bold text-xs sm:text-lg text-primary underline"
              href="mailto:digimage@salvtec.co.sz">
              digimage@salvtec.co.sz
            </a>
          </div>
        </div>
        <div className="flex items-center justify-start gap-6 my-4">
          <div className="icon w-1/5">
            <FontAwesomeIcon
              icon={faMousePointer}
              className="text-primary text-3xl"
            />
          </div>
          <div className="w-4/5">
            <p className="font-light">Website</p>
            <a
              className="font-bold text-xs sm:text-lg text-primary underline"
              href="https://salvtec.co.sz">
              www.salvtec.co.sz
            </a>
          </div>
        </div>
      </div>

      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-full h-1 my-8 bg-gray-200 border-0 rounded dark:bg-gray-700" />
        <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
          or
        </div>
      </div>

      <div className="mt-1">
        <p className="text-center font-light">Visit our Offices</p>
        <p className="text-center text-xs sm:text-lg mt-2 font-light">
          Office #54 Mbandzeni House, Karl Grant St, Mbabane
        </p>
        <a
          target="_blank"
          href="https://maps.app.goo.gl/wsL9rzwXUDNeRnET9"
          className="w-full sm:w-1/2 block p-4 my-4 mb-4 bg-primary text-center mx-auto text-white text-lg cursor-pointer"
          rel="noreferrer">
          Locate on Google Maps
        </a>
      </div>
    </div>
  );
};

export default About;
