export const capitaliseFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
