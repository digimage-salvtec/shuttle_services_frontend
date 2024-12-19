import React, { useState } from "react";
import logo from "../assets/logo/swift_shuttle_logotype_rgb.png";
import axios_client from "../axios_client";
import { useStateContext } from "../context/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import Bottom from "../components/Bottom";

const PasswordReset = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      email: emailAddress,
    };

    try {
      const { data } = await axios_client.post(
        "/bridgeReceiveForgotPassword.php",
        JSON.stringify(payload)
      );

      if (data.message) {
        setMessage(data.message);
        setEmailAddress('')
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-lg mx-auto pt-20">
      <Bottom />

      {message && (
        <small className="block text-center my-2 border-l-4 border-primary bg-primary bg-opacity-20 p-2">
          {message}
        </small>
      )}
      <form
        onSubmit={handleSubmit}
        className="border border-accent rounded p-4">
        <h3 className="text-2xl text-primary font-semibold">
          Reset your Password
        </h3>
        <small className="font-light text-gray-600 text-xs">
          To reset your password, enter the email address you used at
          registration
        </small>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full my-4">
          <label className="flex flex-col w-full" htmlFor="email">
            Email Address
            <input
              type="text"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
          </label>
        </div>

        <div className="flex flex-col items-end">
          <button className="bg-primary w-full text-center rounded py-4 text-white">
            {isSubmitting ? "Verifying..." : "Send Reset Link"}
          </button>
          
        </div>
      </form>
      <Bottom />
    </div>
  );
};

export default PasswordReset;
