'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthService } from '@/services/auth.service';
import { UserDto, AuthResponse, ApiResponse } from '@/types';


interface AuthContextType {
  user: UserDto | null;
  accessToken: string | null;
  mustChangePassword: boolean;
  isLoading: boolean;
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((data: AuthResponse) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
    setMustChangePassword(data.mustChangePassword || false);
    setIsLoading(false);
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setMustChangePassword(false);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const refreshSession = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL!;
      const response = await axios.post<ApiResponse<AuthResponse>>(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      if (response.data.success && response.data.data) {
        setAuth(response.data.data);
      } else {
        clearAuth();
      }
    } catch (error) {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [setAuth, clearAuth]);

  // Check session on mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const value = useMemo(() => ({
    user,
    accessToken,
    mustChangePassword,
    isLoading,
    setAuth,
    clearAuth,
    logout,
    refreshSession
  }), [user, accessToken, mustChangePassword, isLoading, setAuth, clearAuth, logout, refreshSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
