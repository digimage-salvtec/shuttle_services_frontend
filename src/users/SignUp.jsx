import React, { useState } from "react";
import logo from "../assets/logo/swift_shuttle_logotype_rgb.png";
import Bottom from "../components/Bottom.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios_client from "../axios_client";
import { faArrowRightLong, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStateContext } from "../context/ContextProvider.jsx";

const SignUp = () => {
  const { user, setUser, token, setToken } = useStateContext();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [passportExp, setPassportExp] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [plainPassword, setPlainPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phone: phone,
      gender: gender,
      passport_no: passportNo,
      passport_exp: passportExp,
      date_of_birth: dateOfBirth,
      password: plainPassword,
      password_confirmation: confirmPassword,
    };

    payload = JSON.stringify(payload);

    try {
      const { data } = await axios_client.post(
        "/bridgeReceiveUserRegistration.php",
        payload
      );

      if (data.errors) {
        setValidationErrors(data.errors);
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
      setErrorMessage(`Failed, with error: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-2xl mx-auto">
      <Bottom />

      <form className="my-6" onSubmit={handleSubmit}>
        <h3 className="text-2xl text-center text-primary mb-3 font-bold">
          Create an account
        </h3>
        <hr />

        <span className="bg-primary bg-opacity-30 border-l-4 border-primary inline-block px-3 py-1 text-xs text-gray-700 mt-2 mb-4">
          We will use registered phone number for MoMo & ePayNet payments.
          Please make sure it's registered, & correct
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full my-2">
          <label htmlFor="firstname" className="flex flex-col w-full">
            First name
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              id="firstname"
              placeholder="First name"
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
            {validationErrors.firstname && (
              <span className="block italic text-[10px] text-red-600">
                {validationErrors.firstname}
              </span>
            )}
          </label>
          <label htmlFor="lastname" className="flex flex-col w-full">
            Last name
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              id="lastname"
              placeholder="Last name"
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
            {validationErrors.lastname && (
              <span className="block italic text-[10px] text-red-600">
                {validationErrors.lastname}
              </span>
            )}
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full my-2">
          <label htmlFor="email" className="flex flex-col w-full">
            Email Address
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Email address"
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
            {validationErrors.email && (
              <span className="block italic text-[10px] text-red-600">
                {validationErrors.email}
              </span>
            )}
          </label>
          <label htmlFor="phone" className="flex flex-col w-full">
            Mobile phone number
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              id="phone"
              placeholder="Mobile phone number"
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
            {validationErrors.phone && (
              <span className="block italic text-[10px] text-red-600">
                {validationErrors.phone}
              </span>
            )}
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full my-2">
          <label htmlFor="passport-number" className="flex flex-col w-full">
            Passport number
            <input
              value={passportNo}
              onChange={(e) => setPassportNo(e.target.value)}
              type="text"
              id="passport-number"
              placeholder="Passport number"
              required
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
            {validationErrors.passport_no && (
              <span className="block italic text-[10px] text-red-600">
                The passport number field is required
              </span>
            )}
          </label>
          <label htmlFor="passport-expiry" className="flex flex-col w-full">
            Expiry date
            <input
              value={passportExp}
              onChange={(e) => setPassportExp(e.target.value)}
              type="date"
              id="passport-expiry"
              placeholder="Passport expiry date"
              required
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
            {validationErrors.passport_exp && (
              <span className="block italic text-[10px] text-red-600">
                {validationErrors.passport_exp}
              </span>
            )}
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full my-2">
          <label className="flex flex-col w-full" htmlFor="gender">
            Gender
            <select
              onChange={(e) => setGender(e.target.value)}
              className="py-2 text-sm outline-none border-accent focus:border-accent">
              <option>&mdash; select &mdash;</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {validationErrors.gender && (
              <span className="block italic text-[10px] text-red-600">
                {validationErrors.gender}
              </span>
            )}
          </label>
          <label className="flex flex-col w-full" htmlFor="phone">
            Date of Birth
            <input
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              type="date"
              id="passport-expiry"
              placeholder="Date of birth"
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
            {validationErrors.date_of_birth && (
              <span className="block italic text-[10px] text-red-600">
                {validationErrors.date_of_birth}
              </span>
            )}
          </label>
        </div>

        <small className="block mt-6 mb-2 underline text-gray-700">
          Setup a password you will remember
        </small>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full mb-4">
          <label className="flex flex-col w-full" htmlFor="password">
            Password
            <input
              type="password"
              value={plainPassword}
              onChange={(e) => setPlainPassword(e.target.value)}
              placeholder="Password"
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
            {validationErrors.password && (
              <span className="block italic text-[10px] text-red-600">
                {validationErrors.password}
              </span>
            )}
          </label>
          <label className="flex flex-col w-full" htmlFor="password">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="py-2 text-sm outline-none border-accent focus:border-accent"
            />
            {validationErrors.password_confirmation && (
              <span className="block italic text-[10px] text-red-600">
                {validationErrors.password_confirmation}
              </span>
            )}
          </label>
        </div>

        <div className="flex items-center gap-2 w-full my-6">
          <button
            disabled={isSubmitting}
            className={`text-center text-lg w-full p-4 rounded-sm ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-opacity-90"
            }`}>
            {isSubmitting ? (
              <>
                <FontAwesomeIcon
                  className="mr-3 animate-spin"
                  icon={faSpinner}
                />
                Processing...
              </>
            ) : (
              <>
                Submit{" "}
                <FontAwesomeIcon className="ml-3" icon={faArrowRightLong} />
              </>
            )}
          </button>
        </div>

        <small className="text-xs text-center block my-1 font-light text-primary">
          By creating an account, you agree to our{" "}
          <a
            target="_blank"
            className="underline"
            href="/swift_bookings_terms_of_use.pdf"
            rel="noreferrer">
            Terms of Use
          </a>{" "}
          &
          <a className="underline" href="/privacy">
            {" "}
            Privacy Policy.
          </a>
        </small>

        <div className="inline-flex items-center justify-center w-full">
          <hr className="w-full h-1 my-8 bg-gray-200 border-0 rounded dark:bg-gray-700" />
          <div className="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
            or
          </div>
        </div>
        <div className="text-center font-light text-sm">
          Already have an account?
          <Link
            className="undeline block w-full text-center font-bold underline rounded py-2 text-primary"
            to="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
