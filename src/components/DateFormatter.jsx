import React from "react";

export const DateFormatter = ({ dateString }) => {
  const formatDate = (string) => {
    const date = new Date(string);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return <span className="inline my-1">{formatDate(dateString)}</span>;
};
