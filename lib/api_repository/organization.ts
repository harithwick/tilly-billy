import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { API_DASHBOARD_BASE_PATH } from "@/lib/constants/application";
import { Organization } from "@/lib/types";
import Cookies from "js-cookie";

export function getOrganization(): Promise<Organization> {
  return apiRequest<void, Organization>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/organization`,
    method: HttpMethod.GET,
  });
}

export function deleteOrganization(): Promise<void> {
  let activeOrgUuid = Cookies.get("activeOrgUuid");
  return apiRequest<void>({
    endpoint: `${API_DASHBOARD_BASE_PATH}/organization/${activeOrgUuid}`,
    method: HttpMethod.DELETE,
  });
}
