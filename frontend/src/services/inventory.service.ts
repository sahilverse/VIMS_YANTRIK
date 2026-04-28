import api from '@/lib/api';
import {
  ApiResponse,
  Category,
  Part,
  PagedResponse,
  InventoryPaginationParams,
  CreateCategoryRequest,
  CreatePartRequest
} from '@/types';

export const InventoryService = {
  // Categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/Inventory/categories');
    return response.data;
  },

  createCategory: async (data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    const response = await api.post('/Inventory/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    const response = await api.put(`/Inventory/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<ApiResponse<boolean>> => {
    const response = await api.delete(`/Inventory/categories/${id}`);
    return response.data;
  },

  // Parts
  getParts: async (params: InventoryPaginationParams): Promise<ApiResponse<PagedResponse<Part>>> => {
    const response = await api.get('/Inventory/parts', { params });
    return response.data;
  },

  getPartById: async (id: string): Promise<ApiResponse<Part>> => {
    const response = await api.get(`/Inventory/parts/${id}`);
    return response.data;
  },

  createPart: async (data: CreatePartRequest): Promise<ApiResponse<Part>> => {
    const response = await api.post('/Inventory/parts', data);
    return response.data;
  },

  updatePart: async (id: string, data: CreatePartRequest): Promise<ApiResponse<Part>> => {
    const response = await api.put(`/Inventory/parts/${id}`, data);
    return response.data;
  },

  deletePart: async (id: string): Promise<ApiResponse<boolean>> => {
    const response = await api.delete(`/Inventory/parts/${id}`);
    return response.data;
  },

  getLowStockParts: async (): Promise<ApiResponse<Part[]>> => {
    const response = await api.get('/Inventory/parts/low-stock');
    return response.data;
  }
};
