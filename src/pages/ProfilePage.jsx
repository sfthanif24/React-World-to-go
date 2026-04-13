import React, { useEffect, useMemo, useState } from "react";
import {
  Compass,
  Flag,
  Globe,
  MapPinned,
  MapPlus,
  Plane,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  getPlannedIds,
  getVisitedIds,
  removePlanned,
  removeVisited,
  seedRandomTravelState,
} from "../utils/travelStorage";
import "./ProfilePage.css";

const Motion = motion;

const DEMO_COUNTRIES = {
  JPN: {
    cca3: "JPN",
    name: { common: "Japan" },
    flags: {
      flags: {
        png: "https://flagcdn.com/w320/jp.png",
        alt: "Flag of Japan",
      },
    },
  },
  FRA: {
    cca3: "FRA",
    name: { common: "France" },
    flags: {
      flags: {
        png: "https://flagcdn.com/w320/fr.png",
        alt: "Flag of France",
      },
    },
  },
  ARE: {
    cca3: "ARE",
    name: { common: "United Arab Emirates" },
    flags: {
      flags: {
        png: "https://flagcdn.com/w320/ae.png",
        alt: "Flag of United Arab Emirates",
      },
    },
  },
  CAN: {
    cca3: "CAN",
    name: { common: "Canada" },
    flags: {
      flags: {
        png: "https://flagcdn.com/w320/ca.png",
        alt: "Flag of Canada",
      },
    },
  },
  AUS: {
    cca3: "AUS",
    name: { common: "Australia" },
    flags: {
      flags: {
        png: "https://flagcdn.com/w320/au.png",
        alt: "Flag of Australia",
      },
    },
  },
};

const ProfilePage = () => {
  const location = useLocation();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitedIds, setVisitedIds] = useState([]);
  const [plannedIds, setPlannedIds] = useState([]);

  const syncProfileStateFromStorage = () => {
    setVisitedIds(getVisitedIds());
    setPlannedIds(getPlannedIds());
  };

  const seedRandomDataIfEmpty = (allCountries) => {
    const currentVisited = getVisitedIds();
    const currentPlanned = getPlannedIds();
    if (currentVisited.length || currentPlanned.length) return;
    if (!Array.isArray(allCountries) || !allCountries.length) return;
    seedRandomTravelState(allCountries);
    syncProfileStateFromStorage();
  };

  useEffect(() => {
    syncProfileStateFromStorage();
  }, [location.pathname]);

  useEffect(() => {
    syncProfileStateFromStorage();

    fetch("https://openapi.programming-hero.com/api/all")
      .then((res) => res.json())
      .then((data) => {
        const allCountries = data?.countries || [];
        setCountries(allCountries);
        seedRandomDataIfEmpty(allCountries);
        setLoading(false);
      })
      .catch(() => {
        setCountries([]);
        setLoading(false);
      });

    window.addEventListener("storage", syncProfileStateFromStorage);
    window.addEventListener(
      "travel-storage-updated",
      syncProfileStateFromStorage,
    );
    return () => {
      window.removeEventListener("storage", syncProfileStateFromStorage);
      window.removeEventListener(
        "travel-storage-updated",
        syncProfileStateFromStorage,
      );
    };
  }, []);

  const countryMap = useMemo(() => {
    const map = new Map();
    countries.forEach((country) => {
      const cca3 = country?.cca3;
      const cca2 = country?.cca2;
      const commonName = country?.name?.common;
      if (cca3) map.set(String(cca3).toUpperCase(), country);
      if (cca2) map.set(String(cca2).toUpperCase(), country);
      if (commonName) map.set(String(commonName).toUpperCase(), country);
    });
    return map;
  }, [countries]);

  const visitedCountries = useMemo(
    () =>
      visitedIds.map((id) => {
        const normalizedId = String(id || "").toUpperCase();
        const matched = countryMap.get(normalizedId);
        if (matched) return matched;
        const demo = DEMO_COUNTRIES[normalizedId];
        if (demo) return demo;
        return {
          cca3: id,
          name: { common: id },
          flags: { flags: { png: "", alt: id } },
        };
      }),
    [visitedIds, countryMap],
  );

  const plannedCountries = useMemo(
    () =>
      plannedIds.map((id) => {
        const normalizedId = String(id || "").toUpperCase();
        const matched = countryMap.get(normalizedId);
        if (matched) return matched;
        const demo = DEMO_COUNTRIES[normalizedId];
        if (demo) return demo;
        return {
          cca3: id,
          name: { common: id },
          flags: { flags: { png: "", alt: id } },
        };
      }),
    [plannedIds, countryMap],
  );

  const totalCountries = countries.length;
  const visitedCount = visitedIds.length;
  const plannedCount = plannedIds.length;
  const leftCount = Math.max(totalCountries - visitedCount, 0);
  const profileName = "ABU HANIF";
  const myCountry = "Bangladesh";
  const sectionMotion = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.45, ease: "easeOut" },
  };

  return (
    <section className="profile-page">
      <Motion.div className="profile-personal-card" {...sectionMotion}>
        <div className="profile-personal-layout">
          <div className="profile-avatar-ring">
            <img
              src="/hanif.jpg"
              alt="Profile avatar"
              className="profile-avatar"
            />
          </div>

          <div className="profile-avatar-copy">
            <h3>{profileName}</h3>
            <p className="profile-location-line">
              <MapPinned size={16} />
              <span className="profile-country-flag" aria-hidden="true">
                <span className="profile-country-flag-dot" />
              </span>
              <span>{myCountry}</span>
            </p>
          </div>
        </div>
      </Motion.div>

      <div className="profile-stats-grid">
        <Motion.article className="profile-stat-card" {...sectionMotion}>
          <div className="profile-stat-icon">
            <Globe size={18} />
          </div>
          <span>Total Countries</span>
          <strong>{loading ? "..." : totalCountries}</strong>
        </Motion.article>

        <Motion.article
          className="profile-stat-card"
          {...sectionMotion}
          transition={{ duration: 0.45, delay: 0.06, ease: "easeOut" }}
        >
          <div className="profile-stat-icon">
            <Flag size={18} />
          </div>
          <span>Visited</span>
          <strong>{visitedCount}</strong>
        </Motion.article>

        <Motion.article
          className="profile-stat-card"
          {...sectionMotion}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        >
          <div className="profile-stat-icon">
            <MapPlus size={18} />
          </div>
          <span>Next Plan</span>
          <strong>{plannedCount}</strong>
        </Motion.article>

        <Motion.article
          className="profile-stat-card"
          {...sectionMotion}
          transition={{ duration: 0.45, delay: 0.14, ease: "easeOut" }}
        >
          <div className="profile-stat-icon">
            <Compass size={18} />
          </div>
          <span>Countries Left</span>
          <strong>{leftCount}</strong>
        </Motion.article>
      </div>

      <div className="profile-lists-grid">
        <Motion.article
          className="profile-list-card"
          {...sectionMotion}
          transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
        >
          <h3>
            <Plane size={16} /> Visited Countries
          </h3>
          {visitedCountries.length ? (
            <ul>
              {visitedCountries.map((country) => {
                const countryId = country?.cca3 || country?.name?.common || "";
                return (
                  <li key={country.cca3 || country.name?.common}>
                    {country.flags?.flags?.png ? (
                      <img
                        src={country.flags?.flags?.png}
                        alt={country.flags?.flags?.alt || country.name?.common}
                      />
                    ) : (
                      <span className="profile-flag-fallback">🏳️</span>
                    )}
                    <span className="profile-country-name">
                      {country.name?.common}
                    </span>
                    <button
                      type="button"
                      className="profile-delete-btn"
                      onClick={() => removeVisited(countryId)}
                      aria-label={`Remove ${country.name?.common} from visited`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="profile-empty">No visited countries yet.</p>
          )}
        </Motion.article>

        <Motion.article
          className="profile-list-card"
          {...sectionMotion}
          transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
        >
          <h3>
            <MapPlus size={16} /> Next Plan To Visit
          </h3>
          {plannedCountries.length ? (
            <ul>
              {plannedCountries.map((country) => {
                const countryId = country?.cca3 || country?.name?.common || "";
                return (
                  <li key={country.cca3 || country.name?.common}>
                    {country.flags?.flags?.png ? (
                      <img
                        src={country.flags?.flags?.png}
                        alt={country.flags?.flags?.alt || country.name?.common}
                      />
                    ) : (
                      <span className="profile-flag-fallback">🏳️</span>
                    )}
                    <span className="profile-country-name">
                      {country.name?.common}
                    </span>
                    <button
                      type="button"
                      className="profile-delete-btn"
                      onClick={() => removePlanned(countryId)}
                      aria-label={`Remove ${country.name?.common} from next plan`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="profile-empty">No planned countries yet.</p>
          )}
        </Motion.article>
      </div>
    </section>
  );
};

export default ProfilePage;
