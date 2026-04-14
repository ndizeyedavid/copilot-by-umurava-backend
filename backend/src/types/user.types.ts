export type UserRole = "talent" | "admin";

export interface IUser {
  _id?: string;
  googleId?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  picture?: string;
  role: UserRole;
  isActive: boolean;
  talentProfileId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface IAuthResponse {
  user: Omit<IUser, "googleId">;
  tokens: IAuthTokens;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
