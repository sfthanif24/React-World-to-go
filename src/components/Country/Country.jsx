import React from "react";
import "./Country.css";

const Country = ({ country }) => {
    const handleVisit = () => {
        console.log("")
    };
  return (
    <div className="country">
      <img src={country.flags.flags.png} alt={country.flags.flags.alt} />
      <h3>Name: {country.name.common}</h3>
      <p>Population: {country.population.population}</p>
      <p>Area: {country.area.area} km²</p>
      <button onClick={handleVisit}>Not visited</button>

    </div>
  );
};

export default Country;
