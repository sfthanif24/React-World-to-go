import React from "react";
import { motion } from "framer-motion";
import { Compass, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const Motion = motion;

const HomePage = ({ onExploreClick }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    navigate("/countries");
  };

  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left Side - Content */}
        <div className="hero-content">
          {/* Title */}
          <Motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
          >
            Discover the <span className="gradient-text">World</span>
            <br />
            Without Leaving Home
          </Motion.h1>

          {/* Description */}
          <Motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-description"
          >
            Track your visited countries, collect beautiful flags, and explore
            amazing destinations from around the globe. Start your journey today
            and become a true world explorer.
          </Motion.p>

          {/* Two Buttons */}
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-buttons"
          >
            <button className="hero-btn-primary" onClick={handleExplore}>
              <Compass size={18} />
              <span>Start Exploring</span>
              <ArrowRight size={16} className="btn-arrow" />
            </button>
            <button
              className="hero-btn-secondary"
              onClick={() => navigate("/profile")}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </Motion.div>

          {/* Stats */}
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-stats"
          >
            <div className="stat-item">
              <div className="stat-number">195+</div>
              <div className="stat-label">Countries</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">8B+</div>
              <div className="stat-label">Population</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Languages</div>
            </div>
          </Motion.div>
        </div>

        {/* Right Side - Image */}
        <Motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-image-wrapper"
        >
          <div className="hero-image-container">
            <img src="/world.avif" alt="World map" className="hero-image" />
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default HomePage;
