export interface OrganizationSettings {
  uuid: string;
  name: string;
  email: string;
  currency: string;
  timezone: string;
  invPrefix: string;
  logoUrl: string | null;
}
