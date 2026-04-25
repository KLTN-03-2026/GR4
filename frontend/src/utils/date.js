// src/utils/date.js
export const toDateInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};