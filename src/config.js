// Backend URL. Set VITE_API_URL in Netlify/Vercel env (no trailing slash).
// Falls back to the deployed Render API in production builds so a missing
// env var never silently points the live site at localhost.
const PROD_FALLBACK = "https://learningmanagementserver.onrender.com";

export const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PROD_FALLBACK : "http://localhost:5000")
).replace(/\/+$/, "");

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

export const BRAND = "LMS";
