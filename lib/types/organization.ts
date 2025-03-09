export interface Organization {
  id: string;
  name: string;
  uuid: string;
  email?: string;
  timezone?: string;
  inv_prefix?: string;
  logo_url?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AdjustmentItem = {
  id: string | null;
  name: string;
  amount: number;
  type: "percentage" | "currency";
};

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  joinedAt: Date;
}

export type OrganizationRole = "owner" | "admin" | "member";

export const mapOrganization = (raw: any): Organization => ({
  id: raw.id,
  name: raw.name,
  uuid: raw.uuid,
  email: raw.email,
  timezone: raw.timezone,
  inv_prefix: raw.inv_prefix,
  logo_url: raw.logo_url,
  currency: raw.currency,
  createdAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
});

export const mapAdjustmentItem = (raw: any): AdjustmentItem => ({
  id: raw.id,
  name: raw.name,
  amount: raw.amount,
  type: raw.type,
});

export const mapOrganizationMember = (raw: any): OrganizationMember => ({
  id: raw.id,
  userId: raw.userId,
  organizationId: raw.organizationId,
  role: raw.role,
  joinedAt: new Date(raw.joinedAt),
});
