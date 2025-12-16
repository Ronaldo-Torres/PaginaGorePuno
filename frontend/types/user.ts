export interface Role {
  id: number;
  name: string;
}

export interface RoleDetail extends Role {
  privileges: {
    id: number;
    name: string;
    description?: string;
  }[];
}

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: Role[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string | null;
  roleDetails?: RoleDetail[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleIds: string;
  sendActivationEmail: boolean;
  password?: string;
  enabled?: boolean;
  avatar?: File;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleIds?: string;
  avatar?: File;
} 