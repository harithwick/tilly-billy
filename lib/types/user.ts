export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  userId: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  language: string;
}

export const mapUser = (raw: any): User => ({
  id: raw.id,
  email: raw.email,
  name: raw.name,
  avatar: raw.avatar,
  createdAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
});

export const mapUserSettings = (raw: any): UserSettings => ({
  userId: raw.userId,
  theme: raw.theme,
  emailNotifications: raw.emailNotifications,
  language: raw.language,
});
