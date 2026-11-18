import React, { useState } from "react";
import { HACKATHON_OPTIONS, LEVELS, LOGOS } from "../config.js";
import PrivacyDialog from "../components/PrivacyDialog.jsx";

const INITIAL_FORM = {
  firstName: "",
  secondName: "",
  matricNumber: "",
  email: "",
  phone: "",
  department: "",
  level: "",
  hackathonParticipation: "",
  consent: true,
};

export default function Register() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const interswitchSrc = LOGOS?.interswitch || "/logos/interswitch.svg";
  const lcuSrc = LOGOS?.lcu || "/logos/lcu.svg";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const fullName = `${form.firstName} ${form.secondName}`.trim();

    const payload = {
      ...form,
      fullName,
      full_name: fullName,
      name: fullName,
      matric_number: form.matricNumber,
      hackathon_participation: form.hackathonParticipation,
      track: form.hackathonParticipation,
      focus_area: form.hackathonParticipation,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.message || "Registration failed");
      }

      setSuccess(data.message || "Registered");
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ref-page-wrap">
      <div className="ref-split-card">
        <div className="ref-form-pane">

          <h2 className="ref-card-heading">Registration Form</h2>

          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="ref-form">
            <div className="ref-grid-2">
              <label className="ref-field">
                <span className="ref-label">First Name</span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />
              </label>

              <label className="ref-field">
                <span className="ref-label">Second Name</span>
                <input
                  type="text"
                  name="secondName"
                  value={form.secondName}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />
              </label>
            </div>

            <div className="ref-grid-2">
              <label className="ref-field">
                <span className="ref-label">Matric Number</span>
                <input
                  type="text"
                  name="matricNumber"
                  value={form.matricNumber}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="ref-field">
                <span className="ref-label">Department</span>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label className="ref-field">
              <span className="ref-label">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="ref-field">
              <span className="ref-label">Phone Number</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </label>

            <div className="ref-grid-2">
              <label className="ref-field">
                <span className="ref-label">Level</span>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled></option>
                  {(LEVELS || []).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ref-field">
                <span className="ref-label">Pitch / Participate in Hackathon</span>
                <select
                  name="hackathonParticipation"
                  value={form.hackathonParticipation}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled></option>
                  {(HACKATHON_OPTIONS || ["Yes", "No"]).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="ref-consent">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                required
              />
              <span>
                <button
                  type="button"
                  className="inline-link"
                  onClick={() => setPrivacyOpen(true)}
                >
                  Privacy
                </button>
              </span>
            </label>

            <div className="ref-submit-wrap">
              <button type="submit" className="ref-pill-btn" disabled={loading}>
                {loading ? "..." : "Register"}
              </button>
            </div>
          </form>
        </div>

        <div className="ref-art-pane" aria-hidden="true">
          <svg
            className="ref-rocket-svg"
            viewBox="0 0 420 620"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="exhaustBeam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#17192e" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect width="420" height="620" fill="#17192e" />

            <path
              d="M0 280 Q130 335 235 440 T420 515 L420 620 L0 620 Z"
              fill="#21243d"
              opacity="0.82"
            />
            <path
              d="M0 485 Q140 430 260 492 T420 440 L420 620 L0 620 Z"
              fill="#595c73"
              opacity="0.6"
            />

            <polygon
              points="75,165 114,142 104,188"
              fill="none"
              stroke="#38d2d9"
              strokeWidth="3"
            />
            <polygon
              points="350,222 374,262 326,262"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
            />
            <polygon
              points="318,388 360,412 320,438"
              fill="none"
              stroke="#e86393"
              strokeWidth="3"
            />
            <polygon
              points="372,72 420,92 388,142"
              fill="none"
              stroke="#e6a964"
              strokeWidth="2.5"
            />
            <polygon
              points="174,38 190,48 175,58"
              fill="none"
              stroke="#e6a964"
              strokeWidth="2.5"
            />
            <polygon
              points="282,78 298,68 300,86"
              fill="none"
              stroke="#47628f"
              strokeWidth="2.2"
            />
            <polygon
              points="74,342 104,330 92,362"
              fill="none"
              stroke="#636682"
              strokeWidth="2.5"
            />
            <polygon
              points="162,436 176,428 174,444"
              fill="none"
              stroke="#636682"
              strokeWidth="2"
            />

            <line
              x1="52"
              y1="64"
              x2="60"
              y2="54"
              stroke="#e86393"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <line
              x1="355"
              y1="42"
              x2="364"
              y2="32"
              stroke="#e86393"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <line
              x1="86"
              y1="238"
              x2="94"
              y2="228"
              stroke="#e86393"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <line
              x1="182"
              y1="115"
              x2="188"
              y2="128"
              stroke="#38d2d9"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <line
              x1="68"
              y1="418"
              x2="74"
              y2="430"
              stroke="#38d2d9"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            <g transform="translate(210, 255)">
              <path
                d="M-24 95 L-34 305 L34 305 L24 95 Z"
                fill="url(#exhaustBeam)"
              />
              <path d="M-16 88 Q0 175 16 88 Z" fill="#f25c54" />
              <path d="M-8 88 Q0 140 8 88 Z" fill="#f7b267" />

              <path
                d="M-36 14 Q-78 58 -52 124 Q-36 90 -24 82 Z"
                fill="#3e4c80"
              />
              <path
                d="M36 14 Q78 58 52 124 Q36 90 24 82 Z"
                fill="#3e4c80"
              />

              <path
                d="M0 -102 C38 -102 48 -24 32 82 L-32 82 C-48 -24 -38 -102 0 -102 Z"
                fill="#2e3354"
              />
              <path
                d="M0 -102 C21 -102 33 -68 37 -50 L-37 -50 C-33 -68 -21 -102 0 -102 Z"
                fill="#43486e"
              />

              <rect
                x="-22"
                y="80"
                width="44"
                height="10"
                rx="3"
                fill="#1f2238"
              />

              <circle
                cx="0"
                cy="-18"
                r="22"
                fill="#72a8f7"
                stroke="#3d446b"
                strokeWidth="5"
              />
              <circle cx="-5" cy="-23" r="13" fill="#99c4ff" opacity="0.65" />
            </g>

            <path
              d="M0 462 C55 468 78 520 128 516 C175 512 198 484 245 508 C295 532 332 542 368 522 C395 506 408 492 420 492 L420 620 L0 620 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  );
}