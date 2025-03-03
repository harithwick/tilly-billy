import { Product } from "@/lib/types";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { API_DASHBOARD_BASE_PATH } from "@/lib/constants/application";

export function getProducts(): Promise<Product[]> {
  return apiRequest<void, Product[]>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/products`,
    method: HttpMethod.GET,
  });
}

export function getProduct(id: string): Promise<Product> {
  return apiRequest<void, Product>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/products/${id}`,
    method: HttpMethod.GET,
  });
}

export function createProduct(data: any): Promise<Product> {
  return apiRequest<any, Product>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/products`,
    method: HttpMethod.POST,
    data,
  });
}

export function updateProduct(id: string, data: any): Promise<Product> {
  return apiRequest<any, Product>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/products/${id}`,
    method: HttpMethod.PATCH,
    data,
  });
}

export function deleteProduct(id: string): Promise<void> {
  return apiRequest<void>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/products/${id}`,
    method: HttpMethod.DELETE,
  });
}
