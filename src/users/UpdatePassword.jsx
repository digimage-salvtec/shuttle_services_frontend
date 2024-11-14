import React, { useState } from "react";
import logo from "../assets/logo/swift_shuttle_logo_main.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axios_client from "../axios_client";
import { Datepicker } from "flowbite-react";

const SignUp = () => {
  const { setUser, setToken, dataDecode } = useStateContext();

  const [cellNumber, setCellNumber] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      code: resetCode,
      username: cellNumber,
      newPassword: plainPassword,
      confirmPassword: confirmPassword,
    };

    try {
      const { data } = await axios_client.post(
        "/bridgePasswordResetUpdate.php",
        JSON.stringify(payload)
      );

      const response = dataDecode(data);
      console.log(response);

      if (response.resetStatus == 200) {
        navigate("/login");
      } else if (response.resetStatus == 202) {
        setErrorMessage("Reset code, username or new password is missing");
      } else {
        setErrorMessage("Make sure your reset code is correct");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Something isn't right, but it's not your fault.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="max-w-44 mx-auto mt-12">
        <img className="w-full" src={logo} alt="swift shuttle main logo" />
      </div>

      {errorMessage && (
        <small className="text-primary block my-3 text-center bg-alt p-2">
          {errorMessage}
        </small>
      )}

      <form
        onSubmit={handleSubmit}
        className="border border-accent rounded-lg px-3 sm:px-6 py-4 my-6">
        <h3 className="text-sm sm:text-2xl text-center text-primary mb-6 font-bold">
          Update Your Password
        </h3>

        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="text-sm my-3 w-full" htmlFor="email">
            Password Reset Code
            <input
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full rounded-md border-2 border-accent"
            />
          </div>
          <div className="text-sm my-3 w-full" htmlFor="phone">
            Cell Number
            <input
              type="text"
              value={cellNumber}
              onChange={(e) => setCellNumber(e.target.value)}
              className="w-full rounded-md border-2 border-accent"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="text-sm my-3 w-full" htmlFor="password">
            Password
            <input
              type="password"
              value={plainPassword}
              onChange={(e) => setPlainPassword(e.target.value)}
              className="w-full rounded-md border-2 border-accent"
            />
          </div>
          <div className="text-sm my-3 w-full" htmlFor="password">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border-2 border-accent"
            />
          </div>
        </div>

        <small className="text-alt block my-3 text-center">
          You will be required to login after updating your password
        </small>

        <div className="flex flex-col items-end">
          <button className="bg-primary w-full text-center rounded py-2 text-white">
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
        </div>
        <small className="text-xs text-center block my-1 font-light text-primary">
          By updating your password, you agree to our{" "}
          <a
            target="_blank"
            className="underline"
            href="https://salvtec.co.sz/ticketlab/terms"
            rel="noreferrer">
            Terms of Use
          </a>{" "}
          &
          <a
            className="underline"
            href="https://salvtec.co.sz/ticketlab/privacy-policy">
            {" "}
            Privacy Policy.
          </a>
        </small>
      </form>
    </div>
  );
};

export default SignUp;
