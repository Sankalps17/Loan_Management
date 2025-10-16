import { getNextEmiDate } from '../utils/loanCalculations.js';

export const loanActionTypes = {
  INITIALIZE: 'INITIALIZE',
  APPLY: 'APPLY',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  MARK_EMI: 'MARK_EMI',
  UPDATE: 'UPDATE',
  SET_LOADING: 'SET_LOADING'
};

export const loanReducer = (state, action) => {
  switch (action.type) {
    case loanActionTypes.INITIALIZE: {
      return {
        ...state,
        loans: action.payload.map((loan) => ({
          ...loan,
          nextEmiDate: loan.nextEmiDate ?? getNextEmiDate(loan.emiSchedule ?? [])
        }))
      };
    }
    case loanActionTypes.APPLY: {
      return {
        ...state,
        loans: [action.payload, ...state.loans]
      };
    }
    case loanActionTypes.APPROVE: {
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.payload.loanId
            ? {
                ...loan,
                status: 'approved',
                approvedAt: action.payload.approvedAt,
                approvedBy: action.payload.approvedBy,
                nextEmiDate: getNextEmiDate(loan.emiSchedule ?? [])
              }
            : loan
        )
      };
    }
    case loanActionTypes.REJECT: {
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.payload.loanId
            ? {
                ...loan,
                status: 'rejected',
                rejectionReason: action.payload.reason,
                rejectedAt: action.payload.rejectedAt,
                nextEmiDate: null
              }
            : loan
        )
      };
    }
    case loanActionTypes.MARK_EMI: {
      return {
        ...state,
        loans: state.loans.map((loan) => {
          if (loan.id !== action.payload.loanId) return loan;
          const updatedSchedule = loan.emiSchedule.map((installment) =>
            installment.id === action.payload.installmentId
              ? {
                  ...installment,
                  status: 'paid',
                  paidAt: action.payload.paidAt,
                  transactionId: action.payload.transactionId
                }
              : installment
          );

          return {
            ...loan,
            emiSchedule: updatedSchedule,
            nextEmiDate: getNextEmiDate(updatedSchedule)
          };
        })
      };
    }
    case loanActionTypes.UPDATE: {
      return {
        ...state,
        loans: state.loans.map((loan) =>
          loan.id === action.payload.id ? action.payload : loan
        )
      };
    }
    case loanActionTypes.SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }
    default:
      return state;
  }
};
