import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { loanActionTypes, loanReducer } from '../reducers/loanReducer.js';
import { useAuth } from './AuthContext.jsx';
import { useSnackbar } from '../components/feedback/SnackbarProvider.jsx';

const LoanContext = createContext(undefined);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const initialState = {
  loans: [],
  loading: false
};

export const LoanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loanReducer, initialState);
  const { user } = useAuth();
  const { pushMessage } = useSnackbar();

  // Fetch user's loans on mount
  useEffect(() => {
    if (user) {
      fetchUserLoans();
    }
  }, [user]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('lms.access-token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchUserLoans = async () => {
    try {
      dispatch({ type: loanActionTypes.SET_LOADING, payload: true });
      const response = await fetch(`${API_BASE_URL}/loans/my-loans`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }

      const loans = await response.json();
      dispatch({ type: loanActionTypes.INITIALIZE, payload: loans });
    } catch (error) {
      console.error('Error fetching loans:', error);
      pushMessage({ severity: 'error', message: 'Failed to load loans' });
    } finally {
      dispatch({ type: loanActionTypes.SET_LOADING, payload: false });
    }
  };

  const fetchAllLoans = async () => {
    try {
      dispatch({ type: loanActionTypes.SET_LOADING, payload: true });
      const response = await fetch(`${API_BASE_URL}/admin/loans`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all loans');
      }

      const loans = await response.json();
      dispatch({ type: loanActionTypes.INITIALIZE, payload: loans });
    } catch (error) {
      console.error('Error fetching all loans:', error);
      pushMessage({ severity: 'error', message: 'Failed to load loans' });
    } finally {
      dispatch({ type: loanActionTypes.SET_LOADING, payload: false });
    }
  };

  const applyLoan = useCallback(
    async (formValues) => {
      if (!user) {
        pushMessage({ severity: 'error', message: 'Please sign in to apply for a loan.' });
        return { success: false };
      }

      try {
        dispatch({ type: loanActionTypes.SET_LOADING, payload: true });
        
        const loanData = {
          amount: Number(formValues.amount),
          interestRate: Number(formValues.interestRate),
          tenureMonths: Number(formValues.tenureMonths),
          propertyValue: Number(formValues.propertyValue || formValues.amount * 1.2),
          purpose: formValues.purpose
        };

        const response = await fetch(`${API_BASE_URL}/loans/apply`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(loanData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to submit loan application');
        }

        const loan = await response.json();
        dispatch({ type: loanActionTypes.APPLY, payload: loan });
        pushMessage({ severity: 'success', message: 'Loan application submitted successfully!' });
        return { success: true, data: loan };
      } catch (error) {
        console.error('Error applying for loan:', error);
        pushMessage({ severity: 'error', message: error.message || 'Failed to submit loan application' });
        return { success: false, error: error.message };
      } finally {
        dispatch({ type: loanActionTypes.SET_LOADING, payload: false });
      }
    },
    [user, pushMessage]
  );

  const approveLoan = useCallback(
    async (loanId) => {
      try {
        dispatch({ type: loanActionTypes.SET_LOADING, payload: true });

        const response = await fetch(`${API_BASE_URL}/admin/loans/${loanId}/approve`, {
          method: 'PUT',
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          throw new Error('Failed to approve loan');
        }

        const updatedLoan = await response.json();
        dispatch({ type: loanActionTypes.UPDATE, payload: updatedLoan });
        pushMessage({ severity: 'success', message: 'Loan approved successfully.' });
        return { success: true };
      } catch (error) {
        console.error('Error approving loan:', error);
        pushMessage({ severity: 'error', message: error.message || 'Failed to approve loan' });
        return { success: false };
      } finally {
        dispatch({ type: loanActionTypes.SET_LOADING, payload: false });
      }
    },
    [pushMessage]
  );

  const rejectLoan = useCallback(
    async (loanId, reason) => {
      try {
        dispatch({ type: loanActionTypes.SET_LOADING, payload: true });

        const response = await fetch(`${API_BASE_URL}/admin/loans/${loanId}/reject`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ reason })
        });

        if (!response.ok) {
          throw new Error('Failed to reject loan');
        }

        const updatedLoan = await response.json();
        dispatch({ type: loanActionTypes.UPDATE, payload: updatedLoan });
        pushMessage({ severity: 'info', message: 'Loan rejected.' });
        return { success: true };
      } catch (error) {
        console.error('Error rejecting loan:', error);
        pushMessage({ severity: 'error', message: error.message || 'Failed to reject loan' });
        return { success: false };
      } finally {
        dispatch({ type: loanActionTypes.SET_LOADING, payload: false });
      }
    },
    [pushMessage]
  );

  const markEmiPaid = useCallback(
    async ({ emiId }) => {
      try {
        dispatch({ type: loanActionTypes.SET_LOADING, payload: true });

        const transactionId = `TXN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
        
        const response = await fetch(`${API_BASE_URL}/emi/${emiId}/pay`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ transactionId })
        });

        if (!response.ok) {
          throw new Error('Failed to mark EMI as paid');
        }

        pushMessage({ severity: 'success', message: 'EMI marked as paid.' });
        // Refresh loans to get updated EMI schedule
        await fetchUserLoans();
        return { success: true };
      } catch (error) {
        console.error('Error marking EMI as paid:', error);
        pushMessage({ severity: 'error', message: error.message || 'Failed to mark EMI as paid' });
        return { success: false };
      } finally {
        dispatch({ type: loanActionTypes.SET_LOADING, payload: false });
      }
    },
    [pushMessage]
  );

  const getLoansByUser = useCallback(
    (userId) => state.loans.filter((loan) => loan.applicant?.id === userId),
    [state.loans]
  );

  const getLoanById = useCallback(
    (loanId) => state.loans.find((loan) => loan.id === loanId),
    [state.loans]
  );

  const pendingLoans = useMemo(() => 
    state.loans.filter((loan) => loan.status === 'SUBMITTED' || loan.status === 'pending'), 
    [state.loans]
  );
  
  const approvedLoans = useMemo(() => 
    state.loans.filter((loan) => loan.status === 'APPROVED' || loan.status === 'approved'), 
    [state.loans]
  );

  const value = useMemo(
    () => ({
      loans: state.loans,
      loading: state.loading,
      pendingLoans,
      approvedLoans,
      applyLoan,
      approveLoan,
      rejectLoan,
      markEmiPaid,
      getLoansByUser,
      getLoanById,
      fetchUserLoans,
      fetchAllLoans
    }),
    [
      state.loans,
      state.loading,
      pendingLoans,
      approvedLoans,
      applyLoan,
      approveLoan,
      rejectLoan,
      markEmiPaid,
      getLoansByUser,
      getLoanById,
      fetchUserLoans,
      fetchAllLoans
    ]
  );

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};

LoanProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useLoans = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoans must be used inside a LoanProvider');
  }
  return context;
};
