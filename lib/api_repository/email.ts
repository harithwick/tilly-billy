import { Client } from "@/lib/types/client";
import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { API_BASE_PATH } from "@/lib/constants/application";

export function sendInvoiceToClient(uuid: string): Promise<void> {
  return apiRequest<void>({
    endpoint: `${API_BASE_PATH}/invoice/${uuid}/send-email`,
    method: HttpMethod.POST,
  });
}
