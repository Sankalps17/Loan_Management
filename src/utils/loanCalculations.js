import { addMonthsIso, firstFutureDate } from './dateHelpers.js';
import { createId } from './id.js';

export const calculateMonthlyEmi = ({ amount, interestRate, tenureMonths }) => {
  const principal = Number(amount);
  const tenure = Number(tenureMonths);
  const monthlyRate = Number(interestRate) / (12 * 100);

  if (monthlyRate === 0) {
    return principal / tenure;
  }

  const numerator = principal * monthlyRate * (1 + monthlyRate) ** tenure;
  const denominator = (1 + monthlyRate) ** tenure - 1;
  return numerator / denominator;
};

export const generateEmiSchedule = ({ amount, interestRate, tenureMonths, startDate }) => {
  const emiAmount = calculateMonthlyEmi({ amount, interestRate, tenureMonths });

  return Array.from({ length: Number(tenureMonths) }, (_, index) => {
    const dueDate = addMonthsIso(startDate, index + 1);
    return {
      id: createId(),
      sequence: index + 1,
      dueDate,
      amount: Number(emiAmount.toFixed(2)),
      status: 'pending',
      transactionId: null
    };
  });
};

export const getNextEmiDate = (schedule) => {
  if (!Array.isArray(schedule) || schedule.length === 0) return null;
  const pendingDates = schedule
    .filter((item) => item.status === 'pending')
    .map((item) => item.dueDate);
  return firstFutureDate(pendingDates) ?? pendingDates[0] ?? null;
};
