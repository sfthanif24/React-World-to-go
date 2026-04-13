import React, { useState } from "react";
import { Map, Users } from "lucide-react";
import "./Country.css";

const Country = ({ country, onOpenDetails, style }) => {
  const [visited, setVisited] = useState(false);
  const populationValue = country.population?.population || country.population;
  const areaValue = country.area?.area || country.area;

  const formatNumber = (value) =>
    typeof value === "number" ? value.toLocaleString() : "N/A";

  return (
    <article
      className="country"
      style={style}
      onClick={() => onOpenDetails?.(country)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetails?.(country);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${country.name.common}`}
    >
      <img src={country.flags.flags.png} alt={country.flags.flags.alt} />
      <h3 className="country-name">{country.name.common}</h3>
      <p className="country-meta">
        <span className="country-meta-label">
          <Users size={14} />
          Population
        </span>
        <strong>{formatNumber(populationValue)}</strong>
      </p>
      <p className="country-meta">
        <span className="country-meta-label">
          <Map size={14} />
          Area
        </span>
        <strong>{formatNumber(areaValue)} km²</strong>
      </p>
      <button
        type="button"
        className={`country-visit-btn ${visited ? "is-visited" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          setVisited((prev) => !prev);
        }}
      >
        {visited ? "Visited" : "Not Visited"}
      </button>
    </article>
  );
};

export default Country;
