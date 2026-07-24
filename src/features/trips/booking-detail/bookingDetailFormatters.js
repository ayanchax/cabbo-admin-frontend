import { DEFAULT_CURRENCY_CODE, humanReadableDateTime, formatMoney } from "@/utils";

const EMPTY_VALUE = "--";

const formatDateTime = (value, timezone) => {
  if (!value) return EMPTY_VALUE;
  const normalizedDatetime = !/Z$|[+-]\d{2}:\d{2}$/.test(value)
    ? `${value}Z`
    : value;
  return humanReadableDateTime(normalizedDatetime, undefined, timezone);
};

const formatCurrency = (value, currencyCode = DEFAULT_CURRENCY_CODE) => {
  return formatMoney(value, currencyCode)
};

export { EMPTY_VALUE, formatCurrency, formatDateTime };
