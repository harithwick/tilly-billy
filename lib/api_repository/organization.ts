import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { API_DASHBOARD_BASE_PATH } from "@/lib/constants/application";
import { Organization } from "@/lib/types";

export function getOrganization(): Promise<Organization> {
  return apiRequest<Organization>(
    `${API_DASHBOARD_BASE_PATH}/organization`,
    HttpMethod.GET
  );
}
