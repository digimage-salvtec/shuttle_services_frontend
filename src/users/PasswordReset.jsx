import React, { useState } from "react";
import logo from "../assets/logo/swift_shuttle_logo_main.png";
import axios_client from "../axios_client";
import { useStateContext } from "../context/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const PasswordReset = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [cellNumber, setCellNumber] = useState("");

  const navigate = useNavigate();

  const { dataDecode } = useStateContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      contact: cellNumber,
    };

    try {
      const { data } = await axios_client.post(
        "/bridgePasswordReset.php",
        JSON.stringify(payload)
      );

      const response = dataDecode(data);

      if (response.responseStatus == 200) {
        setMessage(response.message);
        navigate("/updatepassword");
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong. Contact admin...");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[80vh] flex items-center">
      <form
        onSubmit={handleSubmit}
        className="border border-accent rounded px-3 py-4 mt-10 mb-2 max-w-sm mx-auto">
        <h3 className="text-lg text-primary text-center mb-6">
          Reset your Password
        </h3>

        {message && <small className="block">{message}</small>}
        <div className="text-sm my-3" htmlFor="username">
          Cell Number
          <input
            type="text"
            value={cellNumber}
            onChange={(e) => setCellNumber(e.target.value)}
            className="w-full rounded border-2 border-accent"
          />
        </div>

        <div className="flex flex-col items-end">
          <button className="bg-primary w-full text-center rounded py-2 text-white">
            {isSubmitting ? "Verifying..." : "Send Reset Link"}
          </button>
          <Link
            to="/login"
            className="underline text-sm text-primary my-2 mr-1">
            Login
            <FontAwesomeIcon icon={faArrowRightLong} className="ml-2" />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
