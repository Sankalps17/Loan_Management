import { addMonths, format, isAfter, parseISO, startOfDay } from 'date-fns';

export const formatDate = (value, pattern = 'dd MMM yyyy') => {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return format(date, pattern);
};

export const getISODate = (value) => {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return startOfDay(date).toISOString();
};

export const addMonthsIso = (value, months) => {
  const base = typeof value === 'string' ? parseISO(value) : value;
  return getISODate(addMonths(base, months));
};

export const firstFutureDate = (dates) => {
  const now = startOfDay(new Date());
  return dates.find((date) => isAfter(parseISO(date), now));
};
