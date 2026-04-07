// Type definitions for the application

export interface Product {
  id: number;
  name: string;
  department: string;
  price: number;
  category: string;
}

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total_price: number | string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: Record<string, string[]>;
}
