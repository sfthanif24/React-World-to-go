import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  Globe,
  Search,
  User,
  Home,
  Map,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Motion = motion;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? "dark" : "light";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const countriesQuery =
    location.pathname === "/countries"
      ? new URLSearchParams(location.search).get("q") || ""
      : "";
  const effectiveSearchTerm =
    location.pathname === "/countries" ? countriesQuery : searchTerm;

  const syncCountriesQuery = (value) => {
    const params = new URLSearchParams();
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }

    const search = params.toString();
    navigate(
      {
        pathname: "/countries",
        search: search ? `?${search}` : "",
      },
      { replace: true },
    );
  };

  // Sync theme to document and storage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    syncCountriesQuery(value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    syncCountriesQuery(effectiveSearchTerm);
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navItems = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/countries", label: "Countries", icon: Map },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      <Motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`navbar glass ${scrolled ? "navbar-scrolled" : ""}`}
      >
        <div className="navbar-container">
          {/* Left Side - Logo */}
          <Motion.button
            className="navbar-brand"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => navigate("/home")}
          >
            <span className="brand-mark">
              <Globe className="brand-icon" size={26} />
            </span>
            <h1 className="gradient-text">Explore the World</h1>
          </Motion.button>

          {/* Middle - Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="navbar-search desktop-only"
          >
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search countries by name..."
              value={effectiveSearchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`search-input ${isSearchFocused ? "search-focused" : ""}`}
            />
            {effectiveSearchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  syncCountriesQuery("");
                }}
                className="clear-search"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Right Side - Actions (Desktop) */}
          <div className="navbar-actions desktop-only">
            <Motion.button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle Theme"
              type="button"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === "light" ? (
                <Moon size={20} className="moon-icon" />
              ) : (
                <Sun size={20} className="sun-icon" />
              )}
            </Motion.button>

            <Motion.button
              className="profile-btn"
              type="button"
              onClick={() => navigate("/profile")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={16} />
              <span>Profile</span>
            </Motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn mobile-only">
            <Motion.button
              onClick={toggleMobileMenu}
              aria-label="Menu"
              type="button"
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Motion.button>
          </div>
        </div>
      </Motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu glass"
          >
            <div className="mobile-nav-links">
              <div className="mobile-brand-row">
                <Globe className="brand-icon" size={22} />
                <strong>Explore the World</strong>
              </div>

              <div className="mobile-nav-pill-grid">
                {navItems.map((item) => {
                  const NavIcon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `mobile-nav-link ${isActive ? "active" : ""}`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <NavIcon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <form
                onSubmit={handleSearchSubmit}
                className="mobile-search-wrap"
              >
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={effectiveSearchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {effectiveSearchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      syncCountriesQuery("");
                    }}
                    className="clear-search"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              <Motion.button
                onClick={toggleTheme}
                className="theme-toggle mobile-theme-btn"
                type="button"
                whileTap={{ scale: 0.95 }}
              >
                {theme === "light" ? (
                  <>
                    <Moon size={18} className="moon-icon" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={18} className="sun-icon" />
                    <span>Light Mode</span>
                  </>
                )}
              </Motion.button>

              <Motion.button
                className="profile-btn mobile-profile"
                type="button"
                onClick={() => {
                  navigate("/profile");
                  setMobileMenuOpen(false);
                }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={16} />
                <span>Profile</span>
              </Motion.button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
