import React from "react";
import { LOGOS } from "../config.js";

export default function Header({ page, navigate }) {
  const handleNav = (e, path) => {
    if (navigate) {
      e.preventDefault();
      navigate(path);
    }
  };

  const interswitchSrc =
    LOGOS?.interswitch || (Array.isArray(LOGOS) ? LOGOS[0]?.src : "/logos/interswitch.webp");
  const lcuSrc =
    LOGOS?.lcu || (Array.isArray(LOGOS) ? LOGOS[1]?.src : "/logos/lcu.svg");

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          href="/"
          onClick={(e) => handleNav(e, "/")}
          className="brand-logos"
        >
          <span className="brand-cube" aria-hidden="true" />
          {interswitchSrc && (
            <img src={interswitchSrc} alt="Interswitch" className="brand-logo" />
          )}<i>X</i>
          {lcuSrc && <img src={lcuSrc} alt="LCU" className="brand-logo" />}
        </a>

        <nav className="header-nav">
          {page !== "register" && (
            <a
              href="/"
              onClick={(e) => handleNav(e, "/")}
              className="nav-pill"
            >
              Registration Form
            </a>
          )}
          {page !== "dashboard" && (
            <a
              href="/dashboard"
              onClick={(e) => handleNav(e, "/dashboard")}
              className="nav-pill"
            >
              Dashboard
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}