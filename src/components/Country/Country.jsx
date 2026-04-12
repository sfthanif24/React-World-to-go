import React, { useState } from "react";
import "./Country.css";

const Country = ({ country, handleVisitedCountries, handleVisitedFlags }) => {
  const [visited, setVisited] = useState(false);
  const handleVisit = () => {
    //Basic System
    // if (visited) {
    //   setVisited(false);
    // } else {
    //   setVisited(true);
    // }

    //Second System
    // setVisited(visited ? false : true);

    //Third System
    setVisited(!visited);
    handleVisitedCountries(country);
  };
  return (
    <div className="country">
      <img src={country.flags.flags.png} alt={country.flags.flags.alt} />
      <h3>Name: {country.name.common}</h3>
      <p>Population: {country.population.population}</p>
      <p>Area: {country.area.area} km²</p>
      <button
        className={visited ? "country-visited" : ""}
        onClick={handleVisit}
      >
        {visited ? "Visited" : "Not visited"}
      </button>
      <button onClick={() => handleVisitedFlags(country.flags.flags.png)}>
        Add Visited Flag
      </button>
    </div>
  );
};

export default Country;
