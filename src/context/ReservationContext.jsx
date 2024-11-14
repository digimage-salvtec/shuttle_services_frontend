import { createContext, useEffect, useState } from "react";

// Create context
export const ReservationContext = createContext();

// Provider component
export const ReservationProvider = ({ children }) => {
  // Track reservations in localStorage or default to empty array
  const [reservations, setReservations] = useState(
    localStorage.getItem("RESERVATIONS")
      ? JSON.parse(localStorage.getItem("RESERVATIONS"))
      : []
  );

  // Add reservation (or increment passenger count if it already exists)
  const addReservation = (reservation) => {
    const isReservationExists = reservations.find(
      (res) => res.trip_id === reservation.trip_id
    );

    if (!isReservationExists) {
      setReservations([
        ...reservations,
        { ...reservation, passengers: 1 }, // Start with 1 passenger
      ]);
    } else {
      setReservations(
        reservations.map((res) =>
          res.trip_id === reservation.trip_id
            ? { ...res, passengers: res.passengers + 1 }
            : res
        )
      );
    }
  };

  // Update reservation (change passenger count)
  const updateReservation = (reservation, passengers = null) => {
    const isReservationExists = reservations.find(
      (res) => res.trip_id === reservation.trip_id
    );

    if (isReservationExists) {
      setReservations(
        reservations.map((res) =>
          res.trip_id === reservation.trip_id
            ? {
                ...res,
                passengers:
                  passengers !== null ? passengers : res.passengers + 1,
              }
            : res
        )
      );
    }
  };

  // Remove reservation (decrement passenger count or remove entirely)
  const removeReservation = (reservation) => {
    const isReservationExists = reservations.find(
      (res) => res.trip_id === reservation.trip_id
    );

    if (isReservationExists && isReservationExists.passengers === 1) {
      setReservations(
        reservations.filter((res) => res.trip_id !== reservation.trip_id)
      );
    } else {
      setReservations(
        reservations.map((res) =>
          res.trip_id === reservation.trip_id
            ? { ...res, passengers: res.passengers - 1 }
            : res
        )
      );
    }
  };

  // Clear all reservations
  const clearReservations = () => {
    setReservations([]);
  };

  // Calculate the total cost of all reservations
  const getTotalCost = () => {
    return reservations.reduce(
      (total, reservation) =>
        total + reservation.trip_cost * reservation.passengers,
      0
    );
  };

  // Sync reservations with localStorage on change
  useEffect(() => {
    localStorage.setItem("RESERVATIONS", JSON.stringify(reservations));
  }, [reservations]);

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        addReservation,
        updateReservation,
        removeReservation,
        clearReservations,
        getTotalCost,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
