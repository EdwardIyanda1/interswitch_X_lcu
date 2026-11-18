import { useState, useEffect, useCallback } from "react";

export function usePage() {
  const [pathname, setPathname] = useState(() => window.location.pathname || "/");

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((to) => {
    if (!to) return;
    window.history.pushState({}, "", to);
    setPathname(window.location.pathname || "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const normalized = pathname.replace(/\/+$/, "") || "/";
  let page = "notfound";
  if (normalized === "/" || normalized === "/register") page = "register";
  else if (normalized === "/dashboard" || normalized === "/admin") page = "dashboard";
  else if (normalized === "/privacy") page = "privacy";
  else if (normalized === "/terms") page = "terms";

  return {
    pathname: normalized,
    page,
    navigate,
  };
}

export default usePage;