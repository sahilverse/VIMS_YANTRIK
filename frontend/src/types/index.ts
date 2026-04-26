export type RoleName = 'Admin' | 'Staff' | 'Customer';
export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Done' | 'Cancelled';
export type PartRequestStatus = 'Requested' | 'Fulfilled';
export type NotificationType = 'StockAlert' | 'OverduePayment' | 'AIPrediction';
export type ReportType = 'Financial' | 'Inventory' | 'Customer';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User extends BaseEntity {
  email: string;
  isActive: boolean;
  roles: Role[];
}

export interface Role extends BaseEntity {
  userId: string;
  name: RoleName;
  description?: string;
}

export interface StaffProfile extends BaseEntity {
  userId: string;
  employeeCode: string;
  fullName: string;
  phone?: string;
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
  vehicleCode: string;
  plateNumber: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
}

export interface Part extends BaseEntity {
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minThreshold: number;
}

export type InvoiceType = 'Sale' | 'Purchase';
export type PaymentStatus = 'Paid' | 'Credit' | 'Overdue';

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  type: InvoiceType;
  customerId?: string;
  vendorId?: string;
  staffId: string;
  date: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  items: InvoiceItem[];
}

export interface InvoiceItem extends BaseEntity {
  invoiceId: string;
  partId: string;
  quantity: number;
  unitPrice: number;
  part?: Part;
}

export interface Notification extends BaseEntity {
  userId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
}
