'use client';

import { useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, refreshSession, clearAuth } = useAuth();

  useEffect(() => {
    // 1. Request Interceptor: Attach the current Access Token
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor: Handle 401s and refresh
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await refreshSession();
            // Retry the original request with the new token
            return api(originalRequest);
          } catch (refreshError) {
            clearAuth();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshSession, clearAuth]);

  return <>{children}</>;
};

export default AxiosInterceptor;
