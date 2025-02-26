import { Invoice } from "@/lib/types";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { API_DASHBOARD_BASE_PATH } from "@/lib/constants/application";

export function getInvoices(): Promise<{ invoices: Invoice[] }> {
  return apiRequest<{ invoices: Invoice[] }>(
    `${API_DASHBOARD_BASE_PATH}/invoices`,
    HttpMethod.GET
  );
}

export function createInvoice(
  data: Partial<Invoice> & { activeOrgUuid: string }
): Promise<Invoice> {
  return apiRequest<Invoice>(
    `${API_DASHBOARD_BASE_PATH}/studio`,
    HttpMethod.POST,
    data
  );
}

export function updateInvoice(
  uuid: string,
  data: Partial<Invoice>
): Promise<Invoice> {
  return apiRequest<Invoice>(
    `${API_DASHBOARD_BASE_PATH}/studio/${uuid}`,
    HttpMethod.PATCH,
    data
  );
}

export function deleteInvoice(uuid: string): Promise<void> {
  return apiRequest<void>(
    `${API_DASHBOARD_BASE_PATH}/invoices/${uuid}`,
    HttpMethod.DELETE
  );
}
