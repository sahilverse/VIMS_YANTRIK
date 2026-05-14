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
  email?: string;
  address?: string;
  loyaltyPoints: number;
  totalSpend: number;
  lastPurchaseDate?: string;
  vehicles: Vehicle[];
  salesHistory?: SaleInvoiceDto[];
}

export interface Vehicle extends BaseEntity {
  customerId: string;
  plateNumber: string;
  brand?: string;
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
  isActive: boolean;
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
  brand?: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minThreshold: number;
  isActive: boolean;
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
  brand?: string;
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

export type PaymentStatus = 'Pending' | 'Paid' | 'Partial' | 'Overdue';

export interface PurchaseItemDto {
  partId: string;
  partName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseInvoiceDto {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  employeeId: string;
  employeeName: string;
  date: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  itemCount?: number;
  items: PurchaseItemDto[];
}

export interface CreatePurchaseItemRequest {
  partId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchaseRequest {
  vendorId: string;
  date?: string;
  paymentStatus: PaymentStatus;
  items: CreatePurchaseItemRequest[];
}

export interface ReportDataPoint {
  label: string;
  revenue: number;
  expense: number;
}

export interface FinancialReportDto {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  totalSalesCount: number;
  totalPurchasesCount: number;
  chartData: ReportDataPoint[];
}

export interface DashboardPurchaseDto {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  totalAmount: number;
  paymentStatus: string;
  date: string;
}

export interface DashboardLowStockPartDto {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  minThreshold: number;
}

export interface AdminDashboardStatsDto {
  totalEmployeeCount: number;
  totalVendorCount: number;
  todayRevenue: number;
  todaySalesCount: number;
  lowStockCount: number;
  recentPurchases: DashboardPurchaseDto[];
  lowStockParts: DashboardLowStockPartDto[];
}

export interface UserProfileDto {
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  code: string;
  role: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone?: string;
  address?: string;
}

export interface VehicleRegistrationRequest {
  plateNumber: string;
  brand: string;
  model: string;
  year?: number;
  vin?: string;
}

export interface RegisterCustomerRequest {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  plateNumber: string;
  brand?: string;
  model?: string;
  year?: number;
}

export interface SaleItemDto {
  partId: string;
  partName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SaleInvoiceDto {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  employeeId: string;
  employeeName: string;
  date: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  itemCount?: number;
  items: SaleItemDto[];
}

export interface CreateSaleItemRequest {
  partId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSaleRequest {
  customerId: string;
  date?: string;
  paymentStatus: PaymentStatus;
  items: CreateSaleItemRequest[];
}

export interface StaffSalesStats {
  todayRevenue: number;
  totalTransactions: number;
  pendingPaymentsCount: number;
}

export interface RegularCustomer {
  id: string;
  fullName: string;
  customerCode: string;
  visitCount: number;
  totalSpent: number;
}

export interface HighSpender {
  id: string;
  fullName: string;
  customerCode: string;
  totalSpent: number;
  visitCount: number;
}

export interface PendingCredit {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: string;
  date: string;
}

export interface CustomerReport {
  regulars: RegularCustomer[];
  highSpenders: HighSpender[];
  pendingCredits: PendingCredit[];
}

export interface NotificationDto {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationCountDto {
  unreadCount: number;
}
