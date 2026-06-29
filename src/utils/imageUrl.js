export const getImageUrl = (image) => {
  if (!image) return "/placeholder-course.svg";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${base}/${image}`;
};
