/**
 * API Service — centralizes all backend communication.
 * Base URL points to the Laravel backend running on port 8000.
 */

import { Order, ApiResponse, Product } from "@/types";

const API_BASE = "/api";

/**
 * Generic fetch wrapper with error handling.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || "Something went wrong",
      errors: data.errors || {},
    };
  }

  return data;
}

// ─── Order API Methods ───────────────────────────────────────

/** Fetch all orders */
export async function fetchOrders(): Promise<ApiResponse<Order[]>> {
  return request<Order[]>("/orders");
}

/** Fetch a single order by ID */
export async function fetchOrder(id: number): Promise<ApiResponse<Order>> {
  return request<Order>(`/orders/${id}`);
}

/** Create a new order */
export async function createOrder(
  orderData: Omit<Order, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<Order>> {
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

/** Update an existing order */
export async function updateOrder(
  id: number,
  orderData: Partial<Omit<Order, "id" | "created_at" | "updated_at">>
): Promise<ApiResponse<Order>> {
  return request<Order>(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(orderData),
  });
}

export async function deleteOrder(
  id: number
): Promise<ApiResponse<null>> {
  return request<null>(`/orders/${id}`, {
    method: "DELETE",
  });
}

// ─── Product API Methods ───────────────────────────────────────

/** Fetch all products */
export async function fetchProducts(): Promise<ApiResponse<Product[]>> {
  return request<Product[]>("/products");
}

/** Fetch a single product by ID */
export async function fetchProduct(id: number): Promise<ApiResponse<Product>> {
  return request<Product>(`/products/${id}`);
}

/** Create a new product */
export async function createProduct(
  productData: Omit<Product, "id">
): Promise<ApiResponse<Product>> {
  return request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

/** Update an existing product */
export async function updateProduct(
  id: number,
  productData: Partial<Omit<Product, "id">>
): Promise<ApiResponse<Product>> {
  return request<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
}

/** Delete a product */
export async function deleteProduct(
  id: number
): Promise<ApiResponse<null>> {
  return request<null>(`/products/${id}`, {
    method: "DELETE",
  });
}
