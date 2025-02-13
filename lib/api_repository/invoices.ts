import { Invoice } from "@/lib/types";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { API_DASHBOARD_BASE_PATH } from "@/lib/constants/application";

export function createInvoice(
  data: Partial<Invoice> & { activeOrgUuid: string }
): Promise<Invoice> {
  return apiRequest<Invoice>(
    `${API_DASHBOARD_BASE_PATH}/invoices`,
    HttpMethod.POST,
    data
  );
}

export function updateInvoice(
  id: string,
  data: Partial<Invoice>
): Promise<Invoice> {
  return apiRequest<Invoice>(
    `${API_DASHBOARD_BASE_PATH}/invoices/${id}`,
    HttpMethod.PATCH,
    data
  );
}

export function deleteInvoice(id: string): Promise<void> {
  return apiRequest<void>(
    `${API_DASHBOARD_BASE_PATH}/invoices/${id}`,
    HttpMethod.DELETE
  );
}
