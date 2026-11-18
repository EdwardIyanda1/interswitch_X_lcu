import React from "react";

export default function NotFound({ navigate }) {
  return (
    <section className="ref-page-wrap">
      <h1 className="ref-top-heading">
        <strong>404</strong>
      </h1>
      <div className="ref-white-card notfound-box">
        <button
          type="button"
          className="ref-pill-btn"
          onClick={() => (navigate ? navigate("/") : (window.location.href = "/"))}
        >
          Registration Form
        </button>
      </div>
    </section>
  );
}