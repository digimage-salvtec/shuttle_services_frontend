import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const PrivacyNotice = () => {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (cookieConsent) {
      setIsAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookieConsent", "accepted", {
      expires: 365,
    });
    setIsAccepted(true);
  };

  const handleDecline = () => {
    Cookies.set("cookieConsent", "declined", {
      expires: 365,
    });
    setIsAccepted(true);
  };

  if (isAccepted) return null;
  return (
    <div style={styles.banner}>
      <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
        <p>
          We collect personal data to personalize, & improve your experience. By
          using our website and services, you agree to our use of cookies as
          described in our {" "}
          <a href="/privacy" style={styles.link}>
            Privacy Policy
          </a>
        </p>
        <div style={styles.buttons}></div>
        <button onClick={handleAccept} style={styles.button_accept}>
          Accept
        </button>
        <button onClick={handleDecline} style={styles.button_decline}>
          Decline
        </button>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#ccc",
    color: "#333",
    padding: "30px 10px",
    textAlign: "center",
    zIndex: 1000,
    borderTop: "4px solid #42826B",
    borderRadius: "30px 30px 0 0",
  },
  buttons: {
    margin: "30px 0",
  },
  button_accept: {
    backgroundColor: "#42826B",
    color: "white",
    border: "none",
    padding: "7px 20px",
    margin: "0 10px",
    cursor: "pointer",
  },
  button_decline: {
    backgroundColor: "#FFC83E",
    color: "#333",
    border: "none",
    padding: "7px 20px",
    margin: "0 10px",
    cursor: "pointer",
  },
  link: {
    color: "#42826B",
    textDecoration: "underline",
  },
};

export default PrivacyNotice;
