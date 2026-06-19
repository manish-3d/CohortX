import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page transition
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!auth) return null;
  const { user, logout } = auth;

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      logout();
      setMobileMenuOpen(false);
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  }

  return (
    <nav className={`galaxy-nav-wrapper ${scrolled ? "is-scrolled" : ""}`}>
      <div className="galaxy-nav-container">
        
        {/* Brand / Logo */}
        <Link to="/feed" className="galaxy-nav-logo">
          <span className="gradient-brand-text">CohortX</span>
        </Link>

        {/* Desktop Interface Links */}
        <div className="galaxy-nav-links-center">
          <Link 
            to="/feed" 
            className={`nav-cosmic-link ${location.pathname === "/feed" ? "is-active" : ""}`}
          >
            Feed
          </Link>
          <Link 
            to="/explore" 
            className={`nav-cosmic-link ${location.pathname === "/explore" ? "is-active" : ""}`}
          >
            Explore
          </Link>
          <Link 
            to="/search" 
            className={`nav-cosmic-link ${location.pathname === "/search" ? "is-active" : ""}`}
          >
            Discover
          </Link>
        </div>

        {/* Action Controls Section (Desktop) */}
        <div className="galaxy-nav-actions">
          
          {/* Dropdown Controller Container */}
          <div className="create-dropdown-wrapper">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className={`nav-create-btn ${dropdownOpen ? "is-active" : ""}`}
            >
              <span>+ Create</span>
              <span className="arrow-indicator">{dropdownOpen ? "▲" : "▼"}</span>
            </button>
            
            {dropdownOpen && (
              <div className="create-dropdown-menu">
                <div className="dropdown-mega-header">
                  Create New
                </div>
                <Link to="/create" className="dropdown-item">
                  <div className="dropdown-text">
                    <strong>New Project</strong>
                    <small>Share your build details</small>
                  </div>
                </Link>
                <Link to="/story/create" className="dropdown-item">
                  <div className="dropdown-text">
                    <strong>New Story</strong>
                    <small>Broadcast highlights</small>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* User Avatar Identity Circle */}
          <Link to={`/profile/${user?.username}`} className="nav-avatar-link">
            <img
              src={user?.avatar || `https://placehold.co/80x80?text=${encodeURIComponent(user?.username?.[0]?.toUpperCase() || "U")}`}
              alt="avatar"
              className="nav-user-avatar"
            />
          </Link>

          <button onClick={handleLogout} className="nav-logout-btn">
            Logout
          </button>
        </div>

        {/* Mobile Interactive Toggle Trigger */}
        <button 
          className={`mobile-menu-trigger ${mobileMenuOpen ? "is-active" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span className="burger-line line-1"></span>
          <span className="burger-line line-2"></span>
          <span className="burger-line line-3"></span>
        </button>

      </div>

      {/* Responsive Mobile Layout Expansion Overlay */}
      <div className={`mobile-cosmic-overlay ${mobileMenuOpen ? "is-expanded" : ""}`}>
        <div className="mobile-overlay-links">
          
          {/* Profile Quick Insight badge on mobile */}
          <Link to={`/profile/${user?.username}`} className="mobile-profile-badge">
            <img src={user?.avatar || `https://placehold.co/80x80?text=${encodeURIComponent(user?.username?.[0]?.toUpperCase() || "U")}`} alt="avatar" />
            <span>@{user?.username || 'profile'}</span>
          </Link>
          
          <hr className="cosmic-divider" />

          <Link to="/feed" className="mobile-link">Feed</Link>
          <Link to="/explore" className="mobile-link">Explore</Link>
          <Link to="/search" className="mobile-link">Discover</Link>
          <Link to="/profile/edit" className="mobile-link">Edit Profile</Link>
          
          <hr className="cosmic-divider" />
          
          {/* Mobile Creation Inline Channels */}
          <Link to="/create" className="mobile-create-action-link">
            New Project
          </Link>
          <Link to="/story/create" className="mobile-create-action-link">
            New Story
          </Link>

          <hr className="cosmic-divider" />

          <button onClick={handleLogout} className="mobile-logout-action-btn">
            Disconnect System
          </button>
        </div>
      </div>
    </nav>
  );
}
