export type TUserRole = "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR" | "STUDENT";

export type TUserStatus = "ACTIVE" | "SUSPENDED";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: TUserRole;
  status?: TUserStatus;
  deletedAt?: Date | null;
}
