import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// app layout
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";

// pages
import Home from "./views/Home.jsx";
import NotFound from "./views/NotFound.jsx";
import About from "./views/About.jsx";
import Login from "./users/Login.jsx";
import SignUp from "./users/SignUp.jsx";
import PasswordReset from "./users/PasswordReset.jsx";
import UpdatePassword from "./users/UpdatePassword.jsx";
import Profile from "./views/Profile.jsx";
import Checkout from "./views/Checkout.jsx";
import TripSearch from "./views/TripSearch.jsx";
import Trip from "./views/Trip.jsx";
import Support from "./views/Support.jsx";
import PartnerPortal from "./views/PartnerPortal.jsx";
import Trips from "./views/Trips.jsx";
import Providers from "./views/Providers.jsx";
import Passengers from "./views/Passengers.jsx";
import Booking from "./views/Booking.jsx";

// components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import MyBookings from "./views/MyBookings.jsx";

const App = () => {
  const shoudRenderHeader = (pathname) =>
    !["/login", "/signup", "/forgotpassword"].includes(pathname);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<PasswordReset />} />
        <Route path="/updatepassword" element={<UpdatePassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<About />} />
        <Route path="/privacy" element={<About />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/tripsearch" element={<TripSearch />} />
        <Route path="/passengers" element={<Passengers />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/trip/:trip" element={<Trip />} />
        <Route path="/support" element={<Support />} />
        <Route path="/become-a-partner" element={<PartnerPortal />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
