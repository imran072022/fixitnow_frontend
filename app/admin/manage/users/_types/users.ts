export type AdminUserStatus = "ACTIVE" | "BANNED";

export type AdminUserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
};

export type AdminUsersResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminUser[];
};
