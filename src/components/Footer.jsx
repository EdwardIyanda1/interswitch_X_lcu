import React from "react";

export default function Footer({ navigate }) {
  const handleNav = (e, path) => {
    if (navigate) {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a href="/" onClick={(e) => handleNav(e, "/")}>
          Registration Form
        </a>
        <span>•</span>
        <a href="/privacy" onClick={(e) => handleNav(e, "/privacy")}>
          Privacy
        </a>
        <span>•</span>
        <a href="/terms" onClick={(e) => handleNav(e, "/terms")}>
          Terms
        </a>
        <span>•</span>
        <a href="/dashboard" onClick={(e) => handleNav(e, "/dashboard")}>
          Dashboard
        </a>
      </div>
    </footer>
  );
}