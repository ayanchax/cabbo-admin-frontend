import { DEFAULT_CURRENCY_SYMBOL } from "@/utils";
export const isPhoneNumberValid = (phone) => {
  // Basic validation: check if it's 10 digits and only contains numbers
  // Phone numbers are generally 10 digits long (without country code) in most countries, including India, plus this is again checked in backend per country rules, so we can show a generic error message for all countries.
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
}

export const sanitizePhoneNumber = (input, countryCode) => {
  if (!input) return "";

  let phone = input.trim();

  // Remove spaces, dashes, etc
  phone = phone.replace(/\D/g, "");

  // Remove leading zeros
  phone = phone.replace(/^0+/, "");

  // Remove country code if user typed it
  const numericCountryCode = countryCode ? countryCode.replace("+", "") : "";

  // If the phone number starts with the country code, remove it
  if (
    phone.length > 10 &&
    phone.startsWith(numericCountryCode)
  ) {
    phone = phone.slice(numericCountryCode.length);
  }

  return phone;
};

export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const parseUtcDate = (timestamp) => {
  if (!timestamp) return null;

  try {
    return timestamp.endsWith("Z") || timestamp.includes("+")
      ? new Date(timestamp)
      : new Date(timestamp + "Z");
  } catch {
    return null;
  }
};

export const utcOffsetStringToMinutes = (offsetStr) => {
  const match = /^([+-])(\d{2})(\d{2})$/.exec(offsetStr);
  if (!match) return null;
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  return sign * (hours * 60 + minutes);
}

export const formatCurrency = (val, currency_symbol) =>
  `${currency_symbol || DEFAULT_CURRENCY_SYMBOL}${val}`;

export function titleCase(value) {
  if (!value) return "";
  return value
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
