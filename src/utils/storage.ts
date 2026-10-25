import { User } from '../types/auth';

const USERS_STORAGE_KEY = 'myjafa_users_registry_v1';
const CURRENT_USER_KEY = 'myjafa_active_session_v1';
const REMEMBERED_EMAIL_KEY = 'myjafa_remembered_email_v1';

// Initial pre-configured accounts for demonstration and testing with the 3 Jabatan options: Operator, Admin, Directur
const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'usr-jafa-001',
    fullName: 'Budi Santoso, S.T.',
    email: 'budi.santoso@myjafa.id',
    phone: '0812-9876-5432',
    jabatan: 'Operator',
    division: 'Operasional Lapangan & Pabrik',
    employeeId: 'JFA-OPR-089',
    password: 'Password123!',
    createdAt: '2025-01-15T08:30:00Z',
    role: 'Operator'
  },
  {
    id: 'usr-jafa-002',
    fullName: 'Jafa Indo Corpora Admin',
    email: 'jafaindocorporakarawang@gmail.com',
    phone: '0813-1122-3344',
    jabatan: 'Admin',
    division: 'Manajemen Sistem & Administrasi',
    employeeId: 'JFA-ADM-001',
    password: 'Password123!',
    createdAt: '2024-11-01T09:00:00Z',
    role: 'Admin'
  },
  {
    id: 'usr-jafa-003',
    fullName: 'Ir. H. Hendra Wijaya',
    email: 'hendra.directur@myjafa.id',
    phone: '0811-2233-4455',
    jabatan: 'Directur',
    division: 'Direksi & Eksekutif Perusahaan',
    employeeId: 'JFA-DIR-001',
    password: 'Password123!',
    createdAt: '2024-08-10T09:00:00Z',
    role: 'Directur'
  }
];

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

export function saveUser(newUser: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const created: User = {
    ...newUser,
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [created, ...users];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
  return created;
}

export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getRememberedEmail(): string {
  try {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  } catch {
    return '';
  }
}

export function setRememberedEmail(email: string): void {
  try {
    if (email) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  } catch {
    // ignore
  }
}
