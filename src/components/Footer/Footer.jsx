import React from "react";
import { Mail, MapPin, Phone, Globe, ChevronRight, Heart } from "lucide-react";
import "./Footer.css";

const Facebook = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.64l.36-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Twitter = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const Instagram = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Linkedin = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Github = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.64 4.64 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.64 4.64 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="currentColor"
            fillOpacity="0.1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="footer-container">
        <div className="footer-content">
          {/* Column 1: Brand & Info */}
          <div className="footer-brand">
            <div className="footer-logo-wrapper">
              <Globe className="footer-logo-icon" size={32} />
              <h2 className="footer-logo">
                Explore<span className="gradient-text">World</span>
              </h2>
            </div>
            <p className="footer-description">
              Your ultimate guide to exploring the world. Discover countries,
              cultures, and exciting destinations for your next great adventure.
              Track your visited places and collect memories.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook" className="social-link">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="social-link">
                <Linkedin size={18} />
              </a>
              <a href="#" aria-label="Github" className="social-link">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links">
            <h3 className="footer-heading">Quick Links</h3>
            <ul>
              <li>
                <a href="/">
                  <ChevronRight size={14} />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="/countries">
                  <ChevronRight size={14} />
                  <span>All Countries</span>
                </a>
              </li>
              <li>
                <a href="/visited">
                  <ChevronRight size={14} />
                  <span>Visited Places</span>
                </a>
              </li>
              <li>
                <a href="/flags">
                  <ChevronRight size={14} />
                  <span>Flags Gallery</span>
                </a>
              </li>
              <li>
                <a href="/about">
                  <ChevronRight size={14} />
                  <span>About Us</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="footer-links">
            <h3 className="footer-heading">Resources</h3>
            <ul>
              <li>
                <a href="/blog">
                  <ChevronRight size={14} />
                  <span>Travel Blog</span>
                </a>
              </li>
              <li>
                <a href="/guides">
                  <ChevronRight size={14} />
                  <span>Travel Guides</span>
                </a>
              </li>
              <li>
                <a href="/tips">
                  <ChevronRight size={14} />
                  <span>Travel Tips</span>
                </a>
              </li>
              <li>
                <a href="/faq">
                  <ChevronRight size={14} />
                  <span>FAQ</span>
                </a>
              </li>
              <li>
                <a href="/support">
                  <ChevronRight size={14} />
                  <span>Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-contact">
            <h3 className="footer-heading">Get in Touch</h3>
            <div className="contact-item">
              <MapPin size={16} />
              <span>123 Travel Street, Global City, Earth</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <a href="mailto:hello@exploreworld.com">hello@exploreworld.com</a>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </div>
            <div className="newsletter">
              <h4>Stay Updated</h4>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} ExploreWorld. All Rights Reserved.</p>
          </div>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <span className="legal-divider">|</span>
            <a href="/terms">Terms of Service</a>
            <span className="legal-divider">|</span>
            <a href="/cookies">Cookie Policy</a>
          </div>
          <div className="footer-credit">
            <p>
              Made with <Heart size={14} className="heart-icon" /> for travelers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
