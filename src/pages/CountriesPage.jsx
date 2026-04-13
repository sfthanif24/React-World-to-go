import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import Countries from "../components/Countries/Countries";
import "./CountriesPage.css";

const CountriesPage = () => {
  const [searchParams] = useSearchParams();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [visitedFlags, setVisitedFlags] = useState([]);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/all")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.countries || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleVisitedCountries = (country) => {
    const exists = visitedCountries.some((item) => item.cca3 === country.cca3);
    if (exists) {
      setVisitedCountries((prev) =>
        prev.filter((item) => item.cca3 !== country.cca3),
      );
      return;
    }
    setVisitedCountries((prev) => [...prev, country]);
  };

  const handleVisitedFlags = (flag) => {
    if (!visitedFlags.includes(flag)) {
      setVisitedFlags((prev) => [...prev, flag]);
    }
  };

  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

  const sidebarCountries = [...countries].sort((a, b) => {
    const nameA = a.name?.common || "";
    const nameB = b.name?.common || "";
    return nameA.localeCompare(nameB);
  });

  const filteredCountries = searchQuery
    ? countries.filter((country) => {
        const commonName = country.name?.common?.toLowerCase() || "";
        const officialName = country.name?.official?.toLowerCase() || "";
        return (
          commonName.includes(searchQuery) || officialName.includes(searchQuery)
        );
      })
    : countries;

  const matchedCountries = [...filteredCountries].sort((a, b) => {
    const nameA = a.name?.common || "";
    const nameB = b.name?.common || "";
    return nameA.localeCompare(nameB);
  });

  return (
    <section className="page-container">
      {loading ? (
        <div className="loading-state">Loading amazing places...</div>
      ) : (
        <div className="countries-layout">
          <aside className="countries-sidebar">
            <ul>
              {sidebarCountries.map((country) => (
                <li key={`list-${country.cca3 || country.name?.common}`}>
                  <div className="country-list-item">
                    <img
                      src={country.flags?.flags?.png}
                      alt={
                        country.flags?.flags?.alt ||
                        `${country.name?.common} flag`
                      }
                      loading="lazy"
                    />
                    <span>{country.name?.common}</span>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {matchedCountries.length ? (
            <Countries
              countries={matchedCountries}
              handleVisitedCountries={handleVisitedCountries}
              handleVisitedFlags={handleVisitedFlags}
            />
          ) : (
            <div className="no-country-state">
              <SearchX size={40} />
              <span>No country available</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CountriesPage;
