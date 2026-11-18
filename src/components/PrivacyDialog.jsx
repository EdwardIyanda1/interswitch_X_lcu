import React from "react";

export default function PrivacyDialog({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="ref-brand-row">
            <span className="brand-cube" aria-hidden="true" />
            <h3 className="modal-title">Privacy</h3>
          </div>
          <button
            type="button"
            className="ref-pill-btn ref-btn-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}