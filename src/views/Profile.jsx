import React, { useContext, useState } from "react";
import { Tabs } from "flowbite-react";
import { useStateContext } from "../context/ContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faGear } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import PaymentMethods from "../components/PaymentMethods";
import axios_client from "../axios_client";

const Profile = () => {
  const { user, dataDecode } = useStateContext();

  // update profile
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [cellNumber, setCellnumber] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [passport, setPassport] = useState("");
  const [country, setCountry] = useState("");
  const [account, setAccount] = useState("");

  // update payment settings
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, showModal] = useState(false);

  const handlePaymentMethodSelection = (paymentMethod) => {
    switch (paymentMethod) {
      case "MoMo":
        setSelectedMethod("1");
        break;
      case "VISA":
        setSelectedMethod("2");
        break;
      case "eMali":
        setSelectedMethod("3");
        break;
      case "ePayNet":
        setSelectedMethod("4");
        break;
    }

    if (selectedMethod !== null) {
      showModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload = {
      paymentMethod: selectedMethod,
      accountNumber: accountNumber,
      appUserId: user[0].id,
    };

    try {
      const { data } = await axios_client.post(
        "/bridgeUpdateMobileAppUserAccountNumber.php",
        JSON.stringify(payload)
      );
      const response = dataDecode(data);

      const responseMessage = response?.message || response?.description;
      setMessage(responseMessage);

      const timeoutId = setTimeout(() => {
        setMessage(null);
      }, 7000);
    } catch (error) {
      console.log(error);
      setMessage("something went wrong...");
    } finally {
      setIsSubmitting(false);
    }

    // Cleanup function (optional, for handling unmounted components)
    useEffect(() => () => clearTimeout(timeoutId), []);
  };

  return (
    <Tabs
      className="max-w-2xl mx-auto"
      aria-label="Tabs with icons"
      style="underline">
      <Tabs.Item title="Profile">
        <form onSubmit={handleSubmit}>
          <h3 className="text-sm sm:text-lg mb-4 font-bold">Profile Details</h3>

          <div className="flex flex-col sm:flex-row sm:gap-4">
            <div className="text-sm my-2 w-full" htmlFor="username">
              Firstname
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full rounded-md border-2 border-accent text-xs text-gray-500"
              />
            </div>
            <div className="text-sm my-2 w-full" htmlFor="username">
              Lastname
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full rounded-md border-2 border-accent text-xs text-gray-500"
              />
            </div>
          </div>

          <div className="text-sm my-2" htmlFor="username">
            Username / email
            <input
              type="text"
              value={user[0].email}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border-2 border-accent text-xs text-gray-500"
            />
          </div>
          <div className="text-sm my-3" htmlFor="password">
            Mobile No.
            <input
              type="text"
              value={user[0].cellNumber}
              onChange={(e) => setCellnumber(e.target.value)}
              className="w-full rounded-md border-2 border-accent"
            />
          </div>

          <div className="flex flex-col items-end">
            <button className="bg-primary w-full text-center rounded py-2 text-white">
              {isSubmitting ? "Updating..." : "Update"}
            </button>
            <a href="/" className="underline text-xs text-primary my-2">
              Cancel
            </a>
          </div>
        </form>
      </Tabs.Item>
      <Tabs.Item active title="Payment Settings">
        <div className="notice border-l-4 border-primary bg-primary_opac mb-4">
          <p className="p-3 text-justify font-light text-black text-xs">
            Choose the default network account you wish to transact from.
            Available networks include ePayNet (MoMo), ePayNet, Swazi Mobile
            e-Mali & Visa (Credit Card)
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-primary mb-1">
          Connected Accounts
        </p>

        {message && (
          <small className="block py-1 text-primary bg-alt my-2 text-center rounded">
            {message}
          </small>
        )}

        <form
          className="px-3 py-6 border-2 rounded-md"
          action="/"
          method="post">
          <button
            type="button"
            onClick={() => showModal(true)}
            className="w-full mb-4 relative rounded px-6 py-2 text-left text-sm border-accent border-2 text-text_dark">
            Select Network Account
            <FontAwesomeIcon
              icon={faChevronDown}
              className="absolute text-primary right-4 top-3"
            />
          </button>

          <PaymentMethods
            heading={"Choose Network Account"}
            // onClose={}
            visible={modal}
            onSelectPaymentMethod={handlePaymentMethodSelection}
          />

          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full mb-4 rounded px-6 py-2 text-left text-sm border-accent border-2 text-gray"
            placeholder="Add account Number"
          />

          <button
            disabled={selectedMethod == null}
            type="button"
            onClick={handleSubmit}
            className="disabled:bg-accent w-full mt-4 rounded px-6 py-2 text-center text-sm bg-primary text-white">
            Update Accounts
          </button>
        </form>
      </Tabs.Item>
    </Tabs>
  );
};

export default Profile;
