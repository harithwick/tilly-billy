export interface OrganizationSettings {
  uuid: string;
  name: string;
  email: string;
  currency: string;
  timezone: string;
  invPrefix: string;
  logoUrl: string | null;
}

export const mapOrganizationSettings = (raw: any): OrganizationSettings => ({
  uuid: raw.uuid,
  name: raw.name,
  email: raw.email,
  currency: raw.currency,
  timezone: raw.timezone,
  invPrefix: raw.invPrefix,
  logoUrl: raw.logoUrl,
});
