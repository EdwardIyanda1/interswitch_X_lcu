import React, { useState, useEffect, useMemo } from "react";
import { LEVELS, FOCUS_AREAS, LOGOS } from "../config.js";

const TOKEN_KEY = "discovery_admin_token";

function RocketArt() {
  return (
    <svg
      className="ref-rocket-svg"
      viewBox="0 0 420 620"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="exhaustBeamDash" x1="0" y1="0" x2="0" y2="1">
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
          fill="url(#exhaustBeamDash)"
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

        <rect x="-22" y="80" width="44" height="10" rx="3" fill="#1f2238" />

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
  );
}

export default function Dashboard() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [focusFilter, setFocusFilter] = useState("");

  const interswitchSrc = LOGOS?.interswitch || "/logos/interswitch.svg";
  const lcuSrc = LOGOS?.lcu || "/logos/lcu.svg";

  const fetchRegistrations = async (activeToken = token) => {
    if (!activeToken) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/registrations", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to load registrations");
      }
      const rows = Array.isArray(data)
        ? data
        : data.registrations || data.data || [];
      setRegistrations(rows);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRegistrations(token);
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const loginIdentifier = String(credentials.username || "").trim();
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginIdentifier,
          email: loginIdentifier,
          password: String(credentials.password || ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }
      const receivedToken = data.token || "authenticated";
      localStorage.setItem(TOKEN_KEY, receivedToken);
      setToken(receivedToken);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setRegistrations([]);
  };

  const filtered = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    return (Array.isArray(registrations) ? registrations : []).filter((item) => {
      if (!item) return false;
      const name = String(item.full_name || item.fullName || item.name || "");
      const email = String(item.email || "");
      const matric = String(item.matric_number || item.matricNumber || "");
      const dept = String(item.department || "");
      const level = String(item.level || "");
      const track = String(item.track || item.focus_area || item.focusArea || "");

      const matchesSearch =
        !q ||
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        matric.toLowerCase().includes(q) ||
        dept.toLowerCase().includes(q);

      const matchesLevel = !levelFilter || level === levelFilter;
      const matchesFocus = !focusFilter || track === focusFilter;

      return matchesSearch && matchesLevel && matchesFocus;
    });
  }, [registrations, search, levelFilter, focusFilter]);

  const exportCsv = () => {
    if (!filtered.length) return;
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Matric Number",
      "Department",
      "Level",
      "Focus Area",
      "Date",
    ];
    const lines = filtered.map((r) => [
      r.full_name || r.fullName || r.name || "",
      r.email || "",
      r.phone || "",
      r.matric_number || r.matricNumber || "",
      r.department || "",
      r.level || "",
      r.track || r.focus_area || r.focusArea || "",
      r.created_at || "",
    ]);
    const csvContent = [headers, ...lines]
      .map((row) =>
        row.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <section className="ref-page-wrap">
        <div className="ref-split-card">
          <div className="ref-form-pane">
            <div className="ref-brand-row">
              <span className="brand-cube" aria-hidden="true" />
              <div className="ref-brand-logos">
                <img src={interswitchSrc} alt="Interswitch" />
                <img src={lcuSrc} alt="LCU" />
              </div>
            </div>

            <h2 className="ref-card-heading">Login</h2>

            {authError && <div className="alert-error">{authError}</div>}

            <form onSubmit={handleLogin} className="ref-form">
              <label className="ref-field">
                <span className="ref-label">Username</span>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials((p) => ({ ...p, username: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="ref-field">
                <span className="ref-label">Password</span>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((p) => ({ ...p, password: e.target.value }))
                  }
                  required
                />
              </label>

              <div className="ref-submit-wrap">
                <button
                  type="submit"
                  className="ref-pill-btn"
                  disabled={authLoading}
                >
                  {authLoading ? "..." : "Login"}
                </button>
              </div>
            </form>
          </div>

          <div className="ref-art-pane" aria-hidden="true">
            <RocketArt />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ref-page-wrap">
      <div className="ref-white-card">
        <div className="dashboard-toolbar">
          <div className="ref-grid-3">
            <label className="ref-field">
              <span className="ref-label">Search</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <label className="ref-field">
              <span className="ref-label">Level</span>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="">All</option>
                {(LEVELS || []).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </label>

            <label className="ref-field">
              <span className="ref-label">Focus Area</span>
              <select
                value={focusFilter}
                onChange={(e) => setFocusFilter(e.target.value)}
              >
                <option value="">All</option>
                {(FOCUS_AREAS || []).map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="dashboard-actions">
            <button
              type="button"
              className="ref-pill-btn ref-btn-sm"
              onClick={() => fetchRegistrations(token)}
              disabled={loading}
            >
              Refresh
            </button>
            <button
              type="button"
              className="ref-pill-btn ref-btn-sm"
              onClick={exportCsv}
              disabled={!filtered.length}
            >
              CSV
            </button>
            <button
              type="button"
              className="ref-pill-btn ref-btn-sm ref-btn-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Matric</th>
                <th>Department</th>
                <th>Level</th>
                <th>Focus Area</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id || item.email || idx}>
                  <td>{item.full_name || item.fullName || item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.matric_number || item.matricNumber}</td>
                  <td>{item.department}</td>
                  <td>{item.level}</td>
                  <td>{item.track || item.focus_area || item.focusArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}