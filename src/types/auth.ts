export type UserRole = 'kepala_kua' | 'operator_arsip' | 'penghulu' | 'staf_bimas';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  nip: string;
  role: UserRole;
  roleLabel: string;
  avatarUrl?: string;
  loginAt: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  nip: string;
  role: UserRole;
  roleLabel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  kepala_kua: 'Kepala KUA / Penghulu Madya (Akses Penuh)',
  operator_arsip: 'Operator Arsip & Pengadministrasi Dokumen',
  penghulu: 'Penghulu Ahli Madya',
  staf_bimas: 'Staf Bimbingan Masyarakat Islam & Pelayanan',
};

export const DEFAULT_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-01',
    username: 'kepalakua',
    password: 'kua123pekat',
    name: 'H. Ruslan, S.Ag',
    nip: '197405102005011004',
    role: 'kepala_kua',
    roleLabel: 'Kepala KUA / Penghulu Madya (Akses Penuh)',
    isActive: true,
    createdAt: '2024-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 'usr-02',
    username: 'operator',
    password: 'kua123pekat',
    name: 'Syamsul Rizal, S.E',
    nip: '198506142014021002',
    role: 'operator_arsip',
    roleLabel: 'Operator Arsip & Pengadministrasi Dokumen',
    isActive: true,
    createdAt: '2024-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 'usr-03',
    username: 'penghulu',
    password: 'kua123pekat',
    name: 'Drs. Mansyur, M.Pd.I',
    nip: '197803122008011012',
    role: 'penghulu',
    roleLabel: 'Penghulu Ahli Madya',
    isActive: true,
    createdAt: '2024-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 'usr-04',
    username: 'stafbimas',
    password: 'kua123pekat',
    name: 'Siti Rohanah, S.Sos',
    nip: '199008222019032008',
    role: 'staf_bimas',
    roleLabel: 'Staf Bimbingan Masyarakat Islam & Pelayanan',
    isActive: true,
    createdAt: '2024-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z',
  },
];

// Presets compatibility for initial views
export const PRESET_ACCOUNTS = DEFAULT_USER_ACCOUNTS.map((acc) => ({
  username: acc.username,
  password: acc.password,
  user: {
    id: acc.id,
    username: acc.username,
    name: acc.name,
    nip: acc.nip,
    role: acc.role,
    roleLabel: acc.roleLabel,
    loginAt: '',
  },
}));

