import React from "react";
import Country from "../Country/Country";
import "./Countries.css";

const Countries = ({ countries, handleVisitedCountries, handleVisitedFlags }) => {
  if (!countries) return null;
  
  return (
    <div className="countries-section">
      <div className="countries-grid">
        {countries.map((country) => (
          <Country
            key={country.cca3 || country.name.common}
            country={country}
            handleVisitedCountries={handleVisitedCountries}
            handleVisitedFlags={handleVisitedFlags}
          />
        ))}
      </div>
    </div>
  );
};

export default Countries;

