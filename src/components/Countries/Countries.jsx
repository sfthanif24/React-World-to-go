import React from "react";
import Country from "../Country/Country";
import "./Countries.css";

const Countries = ({ countries, onOpenDetails }) => {
  return (
    <div className="countries-grid">
      {countries.map((country, index) => {
        // Create a unique string identifier to avoid [object Object]
        const countryId =
          typeof country?.cca3 === "string"
            ? country.cca3
            : typeof country?.cca2 === "string"
              ? country.cca2
              : typeof country?.name?.common === "string"
                ? country.name.common
                : `country-key-${index}`;
        return (
          <Country
            key={countryId}
            country={country}
            onOpenDetails={onOpenDetails}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default Countries;
