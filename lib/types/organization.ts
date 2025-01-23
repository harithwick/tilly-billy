export interface Organization {
  id: string;
  name: string;
  uuid:string;
  email?: string;
  logo_url?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  joinedAt: Date;
}

export type OrganizationRole = 'owner' | 'admin' | 'member';