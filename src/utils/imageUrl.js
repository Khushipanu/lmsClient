import { API_URL } from "../config";

export const PLACEHOLDER = "/placeholder-course.svg";

/** Turns a stored path ("uploads/x.png") or full URL into a usable src. */
export const getImageUrl = (path) => {
  if (!path) return PLACEHOLDER;
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${API_URL}/${path.replace(/^\/+/, "").replace(/\\/g, "/")}`;
};

export const onImageError = (e) => {
  if (!e.currentTarget.src.endsWith(PLACEHOLDER)) e.currentTarget.src = PLACEHOLDER;
};

export const formatPrice = (price) => (!price || Number(price) <= 0 ? "Free" : `₹${Number(price).toLocaleString("en-IN")}`);

export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

export const ownsCourse = (course, user) =>
  Boolean(user && course && String(course.createdBy?._id || course.createdBy) === String(user._id));

export const isEnrolled = (user, courseId) =>
  Boolean(user?.subscription?.some((id) => String(id) === String(courseId)));

export const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  const units = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of units) {
    const n = Math.floor(s / secs);
    if (n >= 1) return `${n} ${label}${n > 1 ? "s" : ""} ago`;
  }
  return "";
};
