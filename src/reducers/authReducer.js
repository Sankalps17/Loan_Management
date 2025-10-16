export const authActionTypes = {
  INITIALIZE: 'INITIALIZE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SIGNUP: 'SIGNUP',
  SET_LOADING: 'SET_LOADING'
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case authActionTypes.INITIALIZE: {
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };
    }
    case authActionTypes.LOGIN: {
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        loading: false
      };
    }
    case authActionTypes.LOGOUT: {
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        loading: false
      };
    }
    case authActionTypes.SIGNUP: {
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        loading: false
      };
    }
    case authActionTypes.SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }
    default:
      return state;
  }
};
