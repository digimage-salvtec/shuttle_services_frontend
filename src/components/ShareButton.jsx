import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ShareButton = () => {
  const shareTrip = () => {
    const tripLink = window.location.href;

    if (navigator.share) {
      // Use the Web Share API if available
      navigator
        .share({
          title: "Check out this quick and cheap trip on Swift Bookings",
          url: tripLink,
        })
        .then(() => {
          console.log("Shared successful");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      // Fallback for specific apps
      const encodedLink = encodeURIComponent(tripLink);
      const message = "Check out this quick and cheap trip on Swift Bookings";

      const whatsappUrl = `https://api.whatsapp.com/send?text=${message} ${encodedLink}`;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;

      window.open(whatsappUrl, "_blank");
      // window.open(facebookUrl, "_blank");
    }
  };

  return (
    <button
      onClick={() => shareTrip()}
      className="bg-white bg-opacity-50 rounded-full px-3 py-1 text-sm">
      <FontAwesomeIcon icon={faShare} className="text-white sm:mr-2" />
      <span className="hidden sm:inline">Share this result</span>
    </button>
  );
};

export default ShareButton;
