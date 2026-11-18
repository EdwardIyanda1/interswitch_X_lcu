import { useState, useEffect, useCallback } from "react";

export function usePage(meta = {}) {
  const [pathname, setPathname] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname || "/" : "/"
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  useEffect(() => {
    if (!meta || typeof meta !== "object") return;

    if (meta.title && typeof document !== "undefined") {
      document.title = meta.title;
    }

    if (meta.description && typeof document !== "undefined") {
      let descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute("content", meta.description);
      }
    }
  }, [meta?.title, meta?.description]);

  const navigate = useCallback((to) => {
    if (!to || typeof window === "undefined") return;
    window.history.pushState({}, "", to);
    setPathname(window.location.pathname || "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const normalized = (pathname || "/").replace(/\/+$/, "") || "/";

  let page = "notfound";
  if (normalized === "/" || normalized === "/register") {
    page = "register";
  } else if (normalized === "/dashboard" || normalized === "/admin") {
    page = "dashboard";
  } else if (normalized === "/privacy") {
    page = "privacy";
  } else if (normalized === "/terms") {
    page = "terms";
  }

  return {
    pathname: normalized,
    page,
    navigate,
  };
}

export default usePage;