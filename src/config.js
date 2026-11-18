export const LOGOS = {
  interswitch: "/logos/interswitch.webp",
  lcu: "/logos/lcu.png",
};

export const LEVELS = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
];

export const FOCUS_AREAS = [
  "Software Engineering",
  "Product Design (UI/UX)",
  "Product Management",
  "Data Science & AI",
  "Cybersecurity",
  "Cloud & DevOps",
  "Fintech & Payments",
];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function apiUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export default {
  LOGOS,
  LEVELS,
  FOCUS_AREAS,
  API_BASE_URL,
  apiUrl,
};