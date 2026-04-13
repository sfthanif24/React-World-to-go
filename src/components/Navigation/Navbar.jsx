import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Globe, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Motion = motion;

const Navbar = ({ onSearch }) => {
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

  useEffect(() => {
    if (location.pathname !== "/countries") {
      return;
    }

    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("q") || "");
  }, [location.pathname, location.search]);

  const syncCountriesQuery = (value) => {
    const params = new URLSearchParams(location.search);
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
    if (location.pathname === "/countries") {
      syncCountriesQuery(value);
    } else if (onSearch) {
      onSearch(value);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname === "/countries") {
      syncCountriesQuery(searchTerm);
    } else if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

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
          <Motion.div
            className="navbar-brand"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe className="brand-icon" size={28} />
            <h1 className="gradient-text">Explore the World</h1>
          </Motion.div>

          {/* Middle - Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="navbar-search desktop-only"
          >
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search countries by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`search-input ${isSearchFocused ? "search-focused" : ""}`}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  if (location.pathname === "/countries") {
                    syncCountriesQuery("");
                  } else if (onSearch) {
                    onSearch("");
                  }
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={16} />
              <span>View Profile</span>
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
              <form
                onSubmit={handleSearchSubmit}
                className="mobile-search-wrap"
              >
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      if (location.pathname === "/countries") {
                        syncCountriesQuery("");
                      } else if (onSearch) {
                        onSearch("");
                      }
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
                whileTap={{ scale: 0.95 }}
              >
                <User size={16} />
                <span>View Profile</span>
              </Motion.button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
