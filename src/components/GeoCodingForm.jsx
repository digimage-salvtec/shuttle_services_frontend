import React, { useState } from "react";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "../assets/css/geocoding-forms.css";

const GeoCodingForm = ({ placeholder, onPlaceSelect, name }) => {
  const onSuggectionChange = (value) => {
    console.log(value);
  };

  return (
    <GeoapifyContext apiKey="5935dcb47e6a4deabf0e860da800059c">
      <GeoapifyGeocoderAutocomplete
        name={name}
        placeholder={placeholder}
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggectionChange}
      />
    </GeoapifyContext>
  );
};

export default GeoCodingForm;
