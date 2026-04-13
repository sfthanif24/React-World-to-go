import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock3,
  Coins,
  Globe2,
  Info,
  Landmark,
  Languages,
  LoaderCircle,
  MapPinned,
  Map,
  ShieldCheck,
  Users,
  Waypoints,
  X,
} from "lucide-react";
import Countries from "../components/Countries/Countries";
import { getPlannedIds, togglePlanned } from "../utils/travelStorage";
import "./CountriesPage.css";

const CountriesPage = () => {
  const [searchParams] = useSearchParams();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [plannedIds, setPlannedIds] = useState([]);

  const readText = (value, fallback = "") => {
    if (value == null) return fallback;
    if (typeof value === "string" || typeof value === "number") {
      const text = String(value).trim();
      return text || fallback;
    }
    if (typeof value === "object") {
      if (typeof value.common === "string") return value.common;
      if (typeof value.official === "string") return value.official;
      if (typeof value.name === "string") return value.name;
    }
    return fallback;
  };

  const getCountryName = (country) =>
    readText(country?.name?.common || country?.name, "Unknown Country");

  const getCountryId = (country, index = 0) => {
    const cca3 = readText(country?.cca3);
    const cca2 = readText(country?.cca2);
    const commonName = getCountryName(country);
    return cca3 || cca2 || `${commonName}-${index}`;
  };

  useEffect(() => {
    setPlannedIds(getPlannedIds());
  }, []);

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

  const getField = (value) => {
    if (value == null || value === "") return "N/A";
    return value;
  };

  const formatNumber = (value) => {
    if (typeof value !== "number") return "N/A";
    return value.toLocaleString();
  };

  const getCountryDetails = (country) => {
    if (!country) return null;

    const languages = country.languages
      ? Object.values(country.languages).join(", ")
      : "N/A";

    const currencies = country.currencies
      ? Object.values(country.currencies)
          .map((item) => item?.name || item?.symbol)
          .filter(Boolean)
          .join(", ")
      : "N/A";

    return {
      name: getField(country.name?.common),
      officialName: getField(country.name?.official),
      flag: country.flags?.flags?.png || country.flags?.png,
      flagAlt:
        country.flags?.flags?.alt || country.flags?.alt || "Country flag",
      description: getField(country.flags?.flags?.alt || country.flags?.alt),
      capital: getField(country.capital?.capital || country.capital?.[0]),
      region: getField(country.region?.region || country.region),
      subregion: getField(country.subregion?.subregion || country.subregion),
      population: formatNumber(
        country.population?.population || country.population,
      ),
      area: `${formatNumber(country.area?.area || country.area)} km²`,
      languages,
      currencies,
      timezones: country.timezones?.length
        ? country.timezones.join(", ")
        : "N/A",
      borders: country.borders?.length ? country.borders.join(", ") : "N/A",
      independent:
        typeof country.independent === "boolean"
          ? country.independent
            ? "Yes"
            : "No"
          : "N/A",
      status: getField(country.status),
      maps: country.maps?.googleMaps || country.maps?.openStreetMaps,
    };
  };

  const flattenCountryData = (value, currentPath = "", rows = []) => {
    const isPrimitive =
      value == null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean";

    if (isPrimitive) {
      rows.push({
        key: currentPath,
        value: value == null || value === "" ? "N/A" : String(value),
      });
      return rows;
    }

    if (Array.isArray(value)) {
      if (!value.length) {
        rows.push({ key: currentPath, value: "N/A" });
        return rows;
      }

      const allPrimitive = value.every(
        (item) =>
          item == null ||
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean",
      );

      if (allPrimitive) {
        rows.push({ key: currentPath, value: value.join(", ") });
        return rows;
      }

      value.forEach((item, index) => {
        const path = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
        flattenCountryData(item, path, rows);
      });

      return rows;
    }

    const entries = Object.entries(value);
    if (!entries.length) {
      rows.push({ key: currentPath, value: "N/A" });
      return rows;
    }

    entries.forEach(([key, nestedValue]) => {
      const nextPath = currentPath ? `${currentPath}.${key}` : key;
      flattenCountryData(nestedValue, nextPath, rows);
    });

    return rows;
  };

  const toTitleCase = (text) =>
    text
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const formatDetailLabel = (key) => {
    const normalizedParts = key
      .split(".")
      .map((part) =>
        part
          .replace(/\[(\d+)\]/g, " $1")
          .replace(/_/g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/\s+/g, " ")
          .trim(),
      )
      .filter(Boolean);

    const dedupedParts = normalizedParts.filter(
      (part, index, parts) =>
        index === 0 || part.toLowerCase() !== parts[index - 1].toLowerCase(),
    );

    return dedupedParts.map((part) => toTitleCase(part)).join(" / ");
  };

  const getAllDetailRows = (country) => {
    const allRows = flattenCountryData(country);
    const excludedKeys = new Set([
      "name.common",
      "name.official",
      "flags.alt",
      "flags.flags.alt",
      "flags.png",
      "flags.flags.png",
      "flags.svg",
      "flags.flags.svg",
    ]);

    return allRows.filter((row) => !excludedKeys.has(row.key));
  };

  const getDetailDisplayLines = (label, value) => {
    const parts = label.split(" / ");

    if (parts.length < 2) {
      return {
        firstLine: null,
        secondLineLabel: label,
        secondLineValue: value,
      };
    }

    return {
      firstLine: `${parts.slice(0, -1).join(" / ")} /`,
      secondLineLabel: parts[parts.length - 1],
      secondLineValue: value,
    };
  };

  const getDetailIcon = (key, label) => {
    const source = `${key} ${label}`.toLowerCase();

    if (source.includes("population")) return <Users size={16} />;
    if (source.includes("area")) return <Map size={16} />;
    if (source.includes("capital")) return <Landmark size={16} />;
    if (source.includes("region") || source.includes("subregion")) {
      return <Globe2 size={16} />;
    }
    if (source.includes("language")) return <Languages size={16} />;
    if (source.includes("currenc")) return <Coins size={16} />;
    if (source.includes("timezone")) return <Clock3 size={16} />;
    if (source.includes("border")) return <Waypoints size={16} />;
    if (source.includes("independent") || source.includes("status")) {
      return <ShieldCheck size={16} />;
    }
    if (source.includes("map")) return <MapPinned size={16} />;

    return <Info size={16} />;
  };

  const handleTogglePlan = (country) => {
    const countryId = country?.cca3 || country?.name?.common;
    if (!countryId) return;
    togglePlanned(countryId);
    setPlannedIds(getPlannedIds());
  };

  useEffect(() => {
    if (!selectedCountry) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedCountry(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selectedCountry]);

  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

  const sidebarCountries = [...countries].sort((a, b) => {
    const nameA = getCountryName(a);
    const nameB = getCountryName(b);
    return nameA.localeCompare(nameB);
  });

  const filteredCountries = searchQuery
    ? countries.filter((country) => {
        const commonName = readText(country?.name?.common).toLowerCase();
        const officialName = readText(country?.name?.official).toLowerCase();
        return (
          commonName.includes(searchQuery) || officialName.includes(searchQuery)
        );
      })
    : countries;

  const matchedCountries = [...filteredCountries].sort((a, b) => {
    const nameA = getCountryName(a);
    const nameB = getCountryName(b);
    return nameA.localeCompare(nameB);
  });

  return (
    <section className="page-container">
      {loading ? (
        <div className="loading-state" role="status" aria-live="polite">
          <LoaderCircle className="loading-spinner" size={42} />
          <span>Loading amazing places...</span>
        </div>
      ) : (
        <div className="countries-layout">
          <aside className="countries-sidebar">
            <ul>
              {sidebarCountries.map((country, index) => (
                <li key={`list-${getCountryId(country, index)}-${index}`}>
                  <div className="country-list-item">
                    <img
                      src={country.flags?.flags?.png}
                      alt={
                        country.flags?.flags?.alt ||
                        `${getCountryName(country)} flag`
                      }
                      loading="lazy"
                    />
                    <span>{getCountryName(country)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {matchedCountries.length ? (
            <Countries
              countries={matchedCountries}
              onOpenDetails={setSelectedCountry}
            />
          ) : (
            <div className="no-country-state">
              <svg
                className="no-country-icon"
                viewBox="0 0 100 100"
                width="80"
                height="80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="6"
                />
                <line
                  x1="20"
                  y1="80"
                  x2="80"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
              <span>No Country Available</span>
            </div>
          )}
        </div>
      )}

      {selectedCountry && (
        <div
          className="country-modal-overlay"
          onClick={() => setSelectedCountry(null)}
          role="presentation"
        >
          <div
            className="country-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Country details"
          >
            <button
              type="button"
              className="country-modal-close"
              onClick={() => setSelectedCountry(null)}
              aria-label="Close country details"
            >
              <X size={18} />
            </button>

            {(() => {
              const details = getCountryDetails(selectedCountry);
              const allDetailRows = getAllDetailRows(selectedCountry);
              const countryId =
                selectedCountry?.cca3 || selectedCountry?.name?.common || "";
              const planned = countryId
                ? plannedIds.includes(countryId)
                : false;
              return (
                <>
                  <div className="country-modal-content">
                    <div className="country-modal-left">
                      <img src={details.flag} alt={details.flagAlt} />
                      <div className="country-modal-name-block">
                        <h2>{details.name}</h2>
                        <p>{details.officialName}</p>
                      </div>
                      <div className="country-modal-description">
                        <h3>Description</h3>
                        <p>{details.description}</p>
                      </div>
                    </div>

                    <div className="country-modal-right">
                      <div className="country-modal-right-head">
                        <h3>Country Details</h3>
                      </div>

                      <div className="country-modal-grid">
                        {allDetailRows.map((row) => {
                          const label = formatDetailLabel(row.key);
                          const lines = getDetailDisplayLines(label, row.value);

                          return (
                            <p key={row.key} className="detail-row">
                              <span className="detail-icon">
                                {getDetailIcon(row.key, label)}
                              </span>
                              <span className="detail-content">
                                {lines.firstLine && (
                                  <span className="detail-first-line">
                                    {lines.firstLine}
                                  </span>
                                )}
                                <span className="detail-second-line">
                                  <strong>{lines.secondLineLabel}:</strong>{" "}
                                  {lines.secondLineValue}
                                </span>
                              </span>
                            </p>
                          );
                        })}
                      </div>

                      {details.maps && (
                        <a
                          className="country-map-link"
                          href={details.maps}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open in Maps
                        </a>
                      )}

                      <button
                        type="button"
                        className={`country-plan-link ${planned ? "is-planned" : ""}`}
                        onClick={() => handleTogglePlan(selectedCountry)}
                      >
                        {planned ? "Remove from Next Plan" : "Add to Next Plan"}
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
};

export default CountriesPage;
