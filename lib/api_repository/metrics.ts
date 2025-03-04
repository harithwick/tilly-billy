import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import {
  API_DASHBOARD_BASE_PATH,
  API_BASE_PATH,
} from "@/lib/constants/application";

export function getMetrics(): Promise<any> {
  return apiRequest<any>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/metrics/`,
    method: HttpMethod.GET,
  });
}
