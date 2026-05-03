const isEmailValid = (email) => {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const isPositiveNumber = (value) => Number.isFinite(value) && value > 0;

const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

module.exports = {
  isEmailValid,
  isNonEmptyString,
  isPositiveNumber,
  isValidDate
};
