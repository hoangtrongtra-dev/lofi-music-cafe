import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser, AuthState, LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData } from '../types/User';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: AuthUser }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'FORGOT_PASSWORD_START' }
  | { type: 'FORGOT_PASSWORD_SUCCESS' }
  | { type: 'FORGOT_PASSWORD_FAILURE'; payload: string }
  | { type: 'RESET_PASSWORD_START' }
  | { type: 'RESET_PASSWORD_SUCCESS' }
  | { type: 'RESET_PASSWORD_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOAD_USER_START' }
  | { type: 'LOAD_USER_SUCCESS'; payload: AuthUser }
  | { type: 'LOAD_USER_FAILURE' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
    case 'FORGOT_PASSWORD_START':
    case 'RESET_PASSWORD_START':
    case 'LOAD_USER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
    case 'FORGOT_PASSWORD_FAILURE':
    case 'RESET_PASSWORD_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'FORGOT_PASSWORD_SUCCESS':
    case 'RESET_PASSWORD_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    
    case 'LOAD_USER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Real API functions
const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  register: async (data: RegisterData): Promise<AuthUser> => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: data.username,
        email: data.email,
        password: data.password
      });
      
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send reset email');
    }
  },

  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reset password');
    }
  },

  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      // If token is invalid, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('authUser');
      return null;
    }
  },
};

// Context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  clearError: () => void;
  isAdmin: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      dispatch({ type: 'LOAD_USER_START' });
      try {
        const user = await authAPI.getCurrentUser();
        if (user) {
          dispatch({ type: 'LOAD_USER_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'LOAD_USER_FAILURE' });
        }
      } catch (error) {
        dispatch({ type: 'LOAD_USER_FAILURE' });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authAPI.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const user = await authAPI.register(data);
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'REGISTER_FAILURE', payload: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    dispatch({ type: 'LOGOUT' });
  };

  // Forgot password function
  const forgotPassword = async (data: ForgotPasswordData) => {
    dispatch({ type: 'FORGOT_PASSWORD_START' });
    try {
      await authAPI.forgotPassword(data);
      dispatch({ type: 'FORGOT_PASSWORD_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'FORGOT_PASSWORD_FAILURE', payload: error instanceof Error ? error.message : 'Failed to send reset email' });
    }
  };

  // Reset password function
  const resetPassword = async (data: ResetPasswordData) => {
    dispatch({ type: 'RESET_PASSWORD_START' });
    try {
      await authAPI.resetPassword(data);
      dispatch({ type: 'RESET_PASSWORD_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'RESET_PASSWORD_FAILURE', payload: error instanceof Error ? error.message : 'Failed to reset password' });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 