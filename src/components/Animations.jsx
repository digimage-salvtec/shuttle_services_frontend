import React from "react";

const Checkmark = () => {
  return (
    <div className="w-24 h-24 bg-gray-300 rounded-full flex justify-center items-center">
      <svg
        className="checkmark animate-draw-checkmark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="50"
        height="50">
        <path d="M12 25L20 33L38 13" />
      </svg>
    </div>
  );
};

const XMark = () => {
  return (
    <div className="w-24 h-24 bg-gray-300 rounded-full flex justify-center items-center">
      <svg
        className="x-mark animate-draw-x"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="50"
        height="50">
        <path d="M10 10L40 40M40 10L10 40" />
      </svg>
    </div>
  );
};

export { Checkmark, XMark };
