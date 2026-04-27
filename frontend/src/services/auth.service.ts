import api from '@/lib/api';
import { ApiResponse, AuthResponse } from '@/types';
import {
  LoginFormValues,
  RegisterFormValues,
  ChangePasswordFormValues
} from '@/lib/validations/auth';

export const AuthService = {
  login: async (data: LoginFormValues) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterFormValues) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/self-register', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordFormValues) => {
    const response = await api.post<ApiResponse<boolean>>('/auth/change-password', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<boolean>>('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<AuthResponse['user']>>('/users/me');
    return response.data;
  }
};
