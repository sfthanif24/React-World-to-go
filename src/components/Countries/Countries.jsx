import React from "react";
import Country from "../Country/Country";
import "./Countries.css";

const Countries = ({ countries, onOpenDetails }) => {
  if (!countries) return null;

  return (
    <div className="countries-section">
      <div className="countries-grid">
        {countries.map((country, index) => (
          <Country
            key={country.cca3 || country.name.common}
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
