export type Jabatan = 'Operator' | 'Admin' | 'Directur';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  jabatan: Jabatan;
  division?: string;
  employeeId?: string;
  password?: string;
  createdAt: string;
  avatarUrl?: string;
  role: Jabatan;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  jabatan: Jabatan;
  employeeId: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type AuthMode = 'login' | 'register';
