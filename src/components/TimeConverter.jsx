import React from "react";

const TimeConverter = ({ time }) => {
  const convertTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    let timeString = "";

    if (hours > 0) {
      timeString += `${hours} hr${hours > 1 ? "s" : ""}`;
    }

    if (remainingMinutes > 0) {
      if (hours > 0) {
        timeString += ", ";
      }
      timeString += `${remainingMinutes} min`;
    }

    return timeString || "0 min";
  };
  return <span>{convertTime(time)}</span>;
};

export default TimeConverter;
