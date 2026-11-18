import React from "react";
import usePageHook, { usePage } from "./usePage.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const activeHook = typeof usePage === "function" ? usePage : usePageHook;
  const pageState = (typeof activeHook === "function" ? activeHook() : null) || {};

  const currentPath =
    pageState.pathname ||
    (typeof window !== "undefined"
      ? (window.location.pathname || "/").replace(/\/+$/, "") || "/"
      : "/");

  const page =
    pageState.page ||
    (currentPath === "/" || currentPath === "/register"
      ? "register"
      : currentPath === "/dashboard" || currentPath === "/admin"
      ? "dashboard"
      : currentPath === "/privacy"
      ? "privacy"
      : currentPath === "/terms"
      ? "terms"
      : "notfound");

  const navigate =
    pageState.navigate ||
    ((to) => {
      window.history.pushState({}, "", to);
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

  let ActivePage = NotFound;
  if (page === "register") ActivePage = Register;
  else if (page === "dashboard") ActivePage = Dashboard;
  else if (page === "privacy") ActivePage = Privacy;
  else if (page === "terms") ActivePage = Terms;

  return (
    <div className="app-shell">
      <Header page={page} navigate={navigate} />
      <main className="main-container">
        <ActivePage navigate={navigate} />
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}