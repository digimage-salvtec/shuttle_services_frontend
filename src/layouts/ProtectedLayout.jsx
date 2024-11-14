import React, { useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const ProtectedLayout = () => {
  const { token } = useStateContext();

  if (!token) {
    const location = useLocation();

    return (
      <Navigate
        to="/login"
        replace={true}
        state={{ from: location.pathname }}
      />
    );
  }

  return (
    <div className="max-w-95p 2xs:max-w-90p xs:max-w-85p sm:max-w-85p md:max-w-80p xl:max-w-75p mx-auto">
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
