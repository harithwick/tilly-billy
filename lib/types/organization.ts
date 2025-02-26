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
  name: string;
  value: number;
  isPercentage: boolean;
};

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  joinedAt: Date;
}

export type OrganizationRole = "owner" | "admin" | "member";
