import { Invoice } from "@/lib/types";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import {
  API_DASHBOARD_BASE_PATH,
  API_BASE_PATH,
} from "@/lib/constants/application";

export function getInvoices(): Promise<{ invoices: Invoice[] }> {
  return apiRequest<void, { invoices: Invoice[] }>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/invoices`,
    method: HttpMethod.GET,
  });
}

export function markInvoiceAsPaid(uuid: string): Promise<Invoice> {
  return apiRequest<void, Invoice>({
    endpoint: `${API_BASE_PATH}/invoice/${uuid}/mark-paid`,
    method: HttpMethod.POST,
  });
}

export function getInvoice(uuid: string): Promise<Invoice> {
  return apiRequest<void, Invoice>({
    endpoint: `${API_BASE_PATH}/invoice/${uuid}`,
    method: HttpMethod.GET,
  });
}

export function createInvoice(
  data: Partial<Invoice> & { activeOrgUuid: string }
): Promise<Invoice> {
  return apiRequest<Partial<Invoice> & { activeOrgUuid: string }, Invoice>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/studio`,
    method: HttpMethod.POST,
    data,
  });
}

export function updateInvoice(
  uuid: string,
  data: Partial<Invoice>
): Promise<Invoice> {
  return apiRequest<Partial<Invoice>, Invoice>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/studio/${uuid}`,
    method: HttpMethod.PATCH,
    data,
  });
}

export function deleteInvoice(uuid: string): Promise<void> {
  return apiRequest<void>({
    endpoint: `${API_BASE_PATH}/invoice/${uuid}`,
    method: HttpMethod.DELETE,
  });
}

export function sendEmailToClient(uuid: string): Promise<void> {
  return apiRequest<void>({
    endpoint: `${API_BASE_PATH}/invoices/${uuid}/send-email`,
    method: HttpMethod.POST,
  });
}
