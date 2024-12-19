import React, { useEffect, useState } from "react";
import axios_client from "../axios_client";
import { useStateContext } from "../context/ContextProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Bottom from "../components/Bottom";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = () => {
  const { setUser, setToken, dataDecode } = useStateContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      email: username,
      password: password,
    };

    payload = JSON.stringify(payload);

    try {
      const { data } = await axios_client.post("/bridgeLogin.php", payload);

      if (data.errors) {
        setMessage(data.message);
        return;
      }

      setUser(data.user);
      setToken(data.token);

      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-lg pt-10 mb-20 mx-auto">
      <Bottom />
      {message && (
        <small className="text-gray-800 block mt-10 text-center bg-red-500 bg-opacity-10 border-l-4 border-red-500 p-2">
          {message}
        </small>
      )}
      <form
        onSubmit={handleSubmit}
        className="border border-accent rounded-sm p-4 sm:p-8 my-4">
        <h3 className="text-2xl mb-6 text-primary font-semibold">
          Sign in to Swift Bookings
        </h3>

        <label className="flex flex-col w-full" htmlFor="username">
          Email address
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            className="py-2 text-sm outline-none border-accent focus:border-accent"
          />
        </label>
        <label className="flex flex-col w-full" htmlFor="password">
          Password
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="py-2 text-sm outline-none border-accent focus:border-accent"
          />
        </label>

        <div className="flex flex-col items-end my-4">
          <button className="bg-primary w-full text-center rounded py-4 text-white hover:bg-opacity-90">
            {isSubmitting ? (
              <div className="text-center rtl:text-left">
                <FontAwesomeIcon
                  className="mr-3 animate-spin"
                  icon={faSpinner}
                />
                <span className="text-sm ml-4">Logging in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
          <Link
            to="/forgotpassword"
            className="underline text-xs text-primary my-2">
            Forgot Password?
          </Link>
        </div>
      </form>
      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-full h-[1px] my-4 bg-accent border-0 rounded dark:bg-gray-700" />
        <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
          or
        </div>
      </div>
      <a
        className="text-primary block w-full text-center underline"
        href="/signup">
        Create an Account
      </a>
    </div>
  );
};

export default Login;
