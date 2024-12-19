import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios_client from "../axios_client";
import Bottom from "../components/Bottom";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const token = params.get("token");
  const [emailAddress, setEmailAddress] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      token: token,
      email: emailAddress,
      password: plainPassword,
      password_confirmation: confirmPassword,
    };

    payload = JSON.stringify(payload);

    try {
      const response = await axios_client.post(
        "/bridgeReceivePasswordReset.php",
        payload
      );

      console.log(reponse.data);

      if (response.status == 200) {
        setMessage(response.data.message);
        navigate("/login");
      } else if (response.status == 400) {
        setMessage(response.data.message);
      } else {
        setMessage("An unknown error occured. Please try again...");
      }
    } catch (err) {
      console.log(err);
      setMessage("An unknown error occured. Please try again...");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-lg mx-auto pt-20">
      <Bottom />

      {message && (
        <small className="text-primary block my-3 text-center bg-alt p-2">
          {message}
        </small>
      )}

      <form
        onSubmit={handleSubmit}
        className="border border-accent rounded px-3 sm:px-6 py-6 mb-12">
        <h3 className="text-sm sm:text-2xl text-primary mb-6 font-bold">
          Update Your Password
        </h3>
        <small className="text-black font-light block px-2 py-1 my-6 text-left border-l-4 border-primary bg-primary bg-opacity-20">
          You will be required to sign in again after updating your password
        </small>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full my-2">
          <label className="flex flex-col w-full" htmlFor="phone">
            Email Address
            <input
              type="text"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-4 mb-6">
          <label className="flex flex-col w-full" htmlFor="password">
            New Password
            <input
              type="password"
              value={plainPassword}
              onChange={(e) => setPlainPassword(e.target.value)}
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
          </label>
          <label className="flex flex-col w-full" htmlFor="password">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
          </label>
        </div>

        <button className="bg-primary w-full text-center rounded py-4 text-white text-lg">
          {isSubmitting ? (
            <div className="text-center rtl:text-left">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-accent animate-spin dark:text-gray-600 fill-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="text-sm ml-4">Updating password...</span>
                <span className="sr-only">Updating password...</span>
              </div>
            </div>
          ) : (
            "Reset Password"
          )}
        </button>
        <small className="text-xs pt-2 text-center block my-1 font-light text-primary">
          By updating your password, you agree to our{" "}
          <Link className="underline" to="/terms">
            Terms of Use
          </Link>{" "}
          &{" "}
          <Link className="underline" to="/privacy">
            Privacy Policy.
          </Link>
        </small>
      </form>
    </div>
  );
};

export default UpdatePassword;
