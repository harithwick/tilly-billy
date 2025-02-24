import { Client } from "@/lib/types/client";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { API_DASHBOARD_BASE_PATH } from "@/lib/constants/application";
import { Invoice } from "@/lib/types/invoice";
export function getClients(): Promise<Client[]> {
  return apiRequest<Client[]>(
    `${API_DASHBOARD_BASE_PATH}/clients`,
    HttpMethod.GET
  );
}

export function getClient(uuid: string): Promise<Client> {
  return apiRequest<Client>(
    `${API_DASHBOARD_BASE_PATH}/clients/${uuid}`,
    HttpMethod.GET
  );
}

export function getClientInvoices(
  clientUuid: string
): Promise<{ invoices: Invoice[] }> {
  return apiRequest<{ invoices: Invoice[] }>(
    `${API_DASHBOARD_BASE_PATH}/clients/${clientUuid}/invoices`,
    HttpMethod.GET
  );
}

export function createClient(data: Partial<Client>): Promise<Client> {
  return apiRequest<Client>(
    `${API_DASHBOARD_BASE_PATH}/clients`,
    HttpMethod.POST,
    data
  );
}

export function updateClient(
  uuid: string,
  data: Partial<Client>
): Promise<Client> {
  return apiRequest<Client>(
    `${API_DASHBOARD_BASE_PATH}/clients/${uuid}`,
    HttpMethod.PATCH,
    data
  );
}

export function deleteClient(uuid: string): Promise<void> {
  return apiRequest<void>(
    `${API_DASHBOARD_BASE_PATH}/clients/${uuid}`,
    HttpMethod.DELETE
  );
}

export function archiveClient(uuid: string): Promise<void> {
  return apiRequest<void>(
    `${API_DASHBOARD_BASE_PATH}/clients/${uuid}/archive`,
    HttpMethod.POST
  );
}

export function unarchiveClient(uuid: string): Promise<void> {
  return apiRequest<void>(
    `${API_DASHBOARD_BASE_PATH}/clients/${uuid}/unarchive`,
    HttpMethod.POST
  );
}
