import React from "react";
import Country from "../Country/Country";
import "./Countries.css";

const Countries = ({ countries, onOpenDetails }) => {
  if (!countries) return null;

  const getCountryKey = (country, index) => {
    const cca3 = typeof country?.cca3 === "string" ? country.cca3.trim() : "";
    const cca2 = typeof country?.cca2 === "string" ? country.cca2.trim() : "";
    const commonName =
      typeof country?.name?.common === "string"
        ? country.name.common.trim()
        : "country";
    return cca3 || cca2 || `${commonName}-${index}`;
  };

  return (
    <div className="countries-section">
      <div className="countries-grid">
        {countries.map((country, index) => (
          <Country
            key={`${getCountryKey(country, index)}-${index}`}
            country={country}
            onOpenDetails={onOpenDetails}
            style={{ "--card-index": index }}
          />
        ))}
      </div>
    </div>
  );
};

export default Countries;
