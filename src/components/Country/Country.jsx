import React, { useMemo, useState } from "react";
import { Map, Users } from "lucide-react";
import { isVisited, toggleVisited } from "../../utils/travelStorage";
import "./Country.css";

const Country = ({ country, onOpenDetails, style }) => {
  const countryName =
    typeof country?.name?.common === "string"
      ? country.name.common
      : typeof country?.name?.official === "string"
        ? country.name.official
        : "Unknown Country";
  const countryId = useMemo(
    () =>
      (typeof country?.cca3 === "string" && country.cca3) ||
      (typeof country?.cca2 === "string" && country.cca2) ||
      countryName ||
      "",
    [country, countryName],
  );
  const [visited, setVisited] = useState(() =>
    countryId ? isVisited(countryId) : false,
  );
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
      aria-label={`View details for ${countryName}`}
    >
      <img
        src={country?.flags?.flags?.png || country?.flags?.png || ""}
        alt={country?.flags?.flags?.alt || `${countryName} flag`}
      />
      <h3 className="country-name">{countryName}</h3>
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
          const nextVisited = toggleVisited(countryId);
          setVisited(nextVisited);
        }}
      >
        {visited ? "Visited" : "Not Visited"}
      </button>
    </article>
  );
};

export default Country;
