export type RoleName = 'Admin' | 'Staff' | 'Customer';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: RoleName;
  code?: string;
}

export interface AuthResponse {
  accessToken: string;
  expiry: string;
  mustChangePassword?: boolean;
  user: UserDto;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer extends BaseEntity {
  userId?: string;
  customerCode: string;
  fullName: string;
  phone: string;
  address?: string;
  loyaltyPoints: number;
  totalSpend: number;
}

export interface Vehicle extends BaseEntity {
  customerId: string;
  plateNumber: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
}
