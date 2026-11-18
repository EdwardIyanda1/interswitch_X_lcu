import React from "react";

export default function LegalLayout({ title, children }) {
  return (
    <section className="ref-page-wrap">
      {title && (
        <h1 className="ref-top-heading">
          <strong>{title}</strong>
        </h1>
      )}
      <div className="ref-white-card">{children}</div>
    </section>
  );
}