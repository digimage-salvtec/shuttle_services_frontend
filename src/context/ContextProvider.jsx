import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  hashData: () => {},
});

export const ContextProvider = ({ children }) => {
  // method to safely parse JSON
  const parseJSON = (value) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error("Parsing error on: ", value, error);
      return [];
    }
  };

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("USER");

    return savedUser ? parseJSON(savedUser) : [];
  });

  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [notification, _setNotification] = useState("");

  const dataDecode = function (givenData) {
    var algorithm = `${import.meta.env.VITE_APP_INTER_ALGO}`;

    var algorithm = eval(algorithm.split("").reverse().join(""));

    return algorithm;
  };

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  useEffect(() => {
    localStorage.setItem("USER", JSON.stringify(user));
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      notification,
      setNotification,
      dataDecode,
    }),
    [token]
  );

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export const useStateContext = () => {
  return useContext(StateContext);
};
