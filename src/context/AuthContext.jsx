import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { authActionTypes, authReducer } from '../reducers/authReducer.js';
import { useSnackbar } from '../components/feedback/SnackbarProvider.jsx';

const AuthContext = createContext(undefined);
const SESSION_KEY = 'lms.active-user';
const TOKEN_KEY = 'lms.access-token';
const REFRESH_TOKEN_KEY = 'lms.refresh-token';
const API_BASE_URL = 'http://localhost:8080/api';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { pushMessage } = useSnackbar();

  // Load user and tokens from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = () => {
      if (typeof window === 'undefined') return;
      
      const storedUser = window.localStorage.getItem(SESSION_KEY);
      const storedToken = window.localStorage.getItem(TOKEN_KEY);
      const storedRefreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

      if (storedUser && storedToken) {
        dispatch({
          type: authActionTypes.INITIALIZE,
          payload: {
            user: JSON.parse(storedUser),
            accessToken: storedToken,
            refreshToken: storedRefreshToken
          }
        });
      }
    };

    loadStoredAuth();
  }, []);

  // Save tokens and user to localStorage when they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (state.user && state.accessToken) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(state.user));
      window.localStorage.setItem(TOKEN_KEY, state.accessToken);
      if (state.refreshToken) {
        window.localStorage.setItem(REFRESH_TOKEN_KEY, state.refreshToken);
      }
    } else {
      window.localStorage.removeItem(SESSION_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, [state.user, state.accessToken, state.refreshToken]);

  const login = async (email, password) => {
    try {
      dispatch({ type: authActionTypes.SET_LOADING, payload: true });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        pushMessage({ 
          severity: 'error', 
          message: data.message || 'Invalid credentials. Please try again.' 
        });
        dispatch({ type: authActionTypes.SET_LOADING, payload: false });
        return { success: false };
      }

      // Fetch user profile with the access token
      const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${data.accessToken}`
        }
      });

      const userProfile = await profileResponse.json();

      dispatch({
        type: authActionTypes.LOGIN,
        payload: {
          user: userProfile,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }
      });

      pushMessage({ 
        severity: 'success', 
        message: `Welcome back, ${userProfile.fullName.split(' ')[0]}!` 
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      pushMessage({ 
        severity: 'error', 
        message: 'Failed to connect to server. Please try again.' 
      });
      dispatch({ type: authActionTypes.SET_LOADING, payload: false });
      return { success: false };
    }
  };

  const logout = () => {
    dispatch({ type: authActionTypes.LOGOUT });
    pushMessage({ severity: 'info', message: 'You have been signed out.' });
  };

  const signup = async (payload) => {
    try {
      dispatch({ type: authActionTypes.SET_LOADING, payload: true });

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        pushMessage({ 
          severity: 'error', 
          message: data.message || 'Signup failed. Please try again.' 
        });
        dispatch({ type: authActionTypes.SET_LOADING, payload: false });
        return { success: false };
      }

      // Fetch user profile with the access token
      const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${data.accessToken}`
        }
      });

      const userProfile = await profileResponse.json();

      dispatch({
        type: authActionTypes.SIGNUP,
        payload: {
          user: userProfile,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }
      });

      pushMessage({ 
        severity: 'success', 
        message: 'Signup successful. You are now logged in.' 
      });
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      pushMessage({ 
        severity: 'error', 
        message: 'Failed to connect to server. Please try again.' 
      });
      dispatch({ type: authActionTypes.SET_LOADING, payload: false });
      return { success: false };
    }
  };

  const value = useMemo(
    () => ({
      user: state.user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      isAuthenticated: Boolean(state.user && state.accessToken),
      loading: state.loading,
      login,
      logout,
      signup
    }),
    [state.user, state.accessToken, state.refreshToken, state.loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
