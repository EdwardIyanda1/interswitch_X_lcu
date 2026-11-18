export const LOGOS = {
  interswitch: "/logos/interswitch.webp",
  lcu: "/logos/lcu.png",
};

export const LEVELS = [
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "500 Level",
];

export const HACKATHON_OPTIONS = ["Yes", "No"];
export const FOCUS_AREAS = HACKATHON_OPTIONS;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function apiUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export default {
  LOGOS,
  LEVELS,
  HACKATHON_OPTIONS,
  FOCUS_AREAS,
  API_BASE_URL,
  apiUrl,
};