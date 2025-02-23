import { apiRequest, HttpMethod } from "@/lib/utils/api-request";
import { API_DASHBOARD_BASE_PATH } from "@/lib/constants/application";
import { Organization } from "@/lib/types";
import Cookies from "js-cookie";
export function getOrganization(): Promise<Organization> {
  return apiRequest<Organization>(
    `${API_DASHBOARD_BASE_PATH}/organization`,
    HttpMethod.GET
  );
}

export function deleteOrganization(): Promise<void> {
  let activeOrgUuid = Cookies.get("activeOrgUuid");
  return apiRequest<void>(
    `${API_DASHBOARD_BASE_PATH}/organization/${activeOrgUuid}`,
    HttpMethod.DELETE
  );
}
