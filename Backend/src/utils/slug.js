export const toSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const uniqueSlug = (value) => {
  const base = toSlug(value) || "workspace";
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
};

export default {
  toSlug,
  uniqueSlug,
};
