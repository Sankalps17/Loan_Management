import { createContext, useContext, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { createId } from '../../utils/id.js';

const SnackbarContext = createContext(undefined);

const snackbarActionTypes = {
  ENQUEUE: 'ENQUEUE',
  DEQUEUE: 'DEQUEUE'
};

const snackbarReducer = (state, action) => {
  switch (action.type) {
    case snackbarActionTypes.ENQUEUE: {
      return {
        queue: [...state.queue, action.payload]
      };
    }
    case snackbarActionTypes.DEQUEUE: {
      return {
        queue: state.queue.slice(1)
      };
    }
    default:
      return state;
  }
};

const initialState = {
  queue: []
};

export const SnackbarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(snackbarReducer, initialState);

  const pushMessage = ({ severity = 'info', message }) => {
    const item = {
      id: createId(),
      severity,
      message
    };
    dispatch({ type: snackbarActionTypes.ENQUEUE, payload: item });
  };

  const popMessage = () => dispatch({ type: snackbarActionTypes.DEQUEUE });

  const value = useMemo(
    () => ({
      queue: state.queue,
      pushMessage,
      popMessage
    }),
    [state.queue]
  );

  return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>;
};

SnackbarProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used inside SnackbarProvider');
  }
  return context;
};
