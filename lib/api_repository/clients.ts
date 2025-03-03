import { Client } from "@/lib/types/client";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { API_DASHBOARD_BASE_PATH } from "@/lib/constants/application";
import { Invoice } from "@/lib/types/invoice";

export function getClients(): Promise<Client[]> {
  return apiRequest<void, Client[]>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/clients`,
    method: HttpMethod.GET,
  });
}

export function getClient(uuid: string): Promise<Client> {
  return apiRequest<void, Client>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/clients/${uuid}`,
    method: HttpMethod.GET,
  });
}

export function getClientInvoices(
  clientUuid: string
): Promise<{ invoices: Invoice[] }> {
  return apiRequest<void, { invoices: Invoice[] }>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/clients/${clientUuid}/invoices`,
    method: HttpMethod.GET,
  });
}

export async function createClient(data: Partial<Client>): Promise<Client> {
  return apiRequest<Partial<Client>, { client: Client }>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/clients`,
    method: HttpMethod.POST,
    data,
  }).then((res) => {
    console.log("res", res);
    return res.client;
  });
}

export function updateClient(
  uuid: string,
  data: Partial<Client>
): Promise<Client> {
  return apiRequest<Partial<Client>, Client>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/clients/${uuid}`,
    method: HttpMethod.PATCH,
    data,
  });
}

export function deleteClient(uuid: string): Promise<void> {
  return apiRequest<void>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/clients/${uuid}`,
    method: HttpMethod.DELETE,
  });
}

export function archiveClient(uuid: string): Promise<void> {
  return apiRequest<void>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/clients/${uuid}/archive`,
    method: HttpMethod.POST,
  });
}

export function unarchiveClient(uuid: string): Promise<void> {
  return apiRequest<void>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/clients/${uuid}/unarchive`,
    method: HttpMethod.POST,
  });
}
