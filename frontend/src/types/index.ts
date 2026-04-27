export type RoleName = 'Admin' | 'Staff' | 'Customer';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: RoleName;
  phone?: string;
  code?: string;
  isActive: boolean;
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

export interface Vendor {
  id: string;
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minThreshold: number;
  categoryId: string;
  categoryName: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface CreatePartRequest {
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minThreshold: number;
  categoryId: string;
}

export interface InventoryPaginationParams extends PaginationParams {
  categoryId?: string;
}
