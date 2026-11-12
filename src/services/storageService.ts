import { ArchiveItem } from '../types/archive';
import { INITIAL_ARCHIVES } from '../data/mockArchives';
import { AuthUser, UserAccount, DEFAULT_USER_ACCOUNTS, ROLE_LABELS, UserRole } from '../types/auth';
import { KuaProfile, DEFAULT_KUA_PROFILE } from '../types/kuaProfile';
import { BackupSnapshot, BackupPayload } from '../types/backup';

const STORAGE_KEY = 'si_arsip_kua_pekat_v1';
const AUTH_STORAGE_KEY = 'si_arsip_kua_auth_user_v1';
const PROFILE_STORAGE_KEY = 'si_arsip_kua_profile_v1';
const SNAPSHOTS_STORAGE_KEY = 'si_arsip_backup_snapshots_v1';
const ACCOUNTS_STORAGE_KEY = 'si_arsip_kua_accounts_v1';

export const storageService = {
  getStoredArchives(): ArchiveItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARCHIVES));
        return INITIAL_ARCHIVES;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return INITIAL_ARCHIVES;
    } catch (e) {
      console.warn('Failed to parse archives from localStorage, fallback to initial data', e);
      return INITIAL_ARCHIVES;
    }
  },

  saveArchives(archives: ArchiveItem[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(archives));
      return true;
    } catch (e) {
      console.error('Failed to save archives to localStorage', e);
      return false;
    }
  },

  addArchive(newArchive: ArchiveItem): ArchiveItem[] {
    const list = this.getStoredArchives();
    const updated = [newArchive, ...list];
    this.saveArchives(updated);
    return updated;
  },

  updateArchive(updatedArchive: ArchiveItem): ArchiveItem[] {
    const list = this.getStoredArchives();
    const updated = list.map((item) => (item.id === updatedArchive.id ? updatedArchive : item));
    this.saveArchives(updated);
    return updated;
  },

  deleteArchive(id: string): ArchiveItem[] {
    const list = this.getStoredArchives();
    const updated = list.filter((item) => item.id !== id);
    this.saveArchives(updated);
    return updated;
  },

  resetToDefault(): ArchiveItem[] {
    this.saveArchives(INITIAL_ARCHIVES);
    return INITIAL_ARCHIVES;
  },

  exportToJson(archives: ArchiveItem[], profile?: KuaProfile, exportedBy: string = 'Petugas KUA Pekat') {
    const payload: BackupPayload = {
      app: 'SI-ARSIP KUA Kecamatan Pekat',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      exportedBy,
      totalArchives: archives.length,
      archives,
      kuaProfile: profile,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `CADANGAN_ARSIP_KUA_PEKAT_${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },

  exportToCsv(archives: ArchiveItem[]) {
    const headers = [
      'No. Dokumen / Akta',
      'Kategori',
      'Judul Arsip',
      'Desa (Kec. Pekat)',
      'Tanggal Masehi',
      'Tanggal Hijriah',
      'Nama Pihak 1 (Suami / Wakif / Pemohon)',
      'NIK Pihak 1',
      'Nama Pihak 2 (Istri / Nazhir)',
      'NIK Pihak 2',
      'Wali / Nadzir',
      'No Seri Buku / Sertifikat AIW',
      'Lemari Arsip',
      'Rak',
      'Boks Arsip',
      'Status Digital',
      'Petugas Pencatat',
      'Waktu Pencatatan',
    ];

    const escapeCsv = (str: string | undefined | null) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = archives.map((item) => {
      return [
        escapeCsv(item.documentNumber),
        escapeCsv(item.category),
        escapeCsv(item.title),
        escapeCsv(item.village),
        escapeCsv(item.date),
        escapeCsv(item.hijriDate || ''),
        escapeCsv(item.marriage?.husbandName || item.wakaf?.wakifName || item.rekomendasi?.applicantName || item.kemasjidan?.mosqueName || ''),
        escapeCsv(item.marriage?.husbandNik || item.rekomendasi?.applicantNik || ''),
        escapeCsv(item.marriage?.wifeName || item.wakaf?.nazhirName || ''),
        escapeCsv(item.marriage?.wifeNik || ''),
        escapeCsv(item.marriage?.guardianName || item.wakaf?.nazhirName || ''),
        escapeCsv(item.marriage?.serialNumberBook || item.wakaf?.certificateNumber || ''),
        escapeCsv(item.physicalLocation.cabinet),
        escapeCsv(item.physicalLocation.shelf),
        escapeCsv(item.physicalLocation.boxNumber),
        escapeCsv(item.hasDigitalFile ? 'Ada File Digital' : 'Fisik Saja'),
        escapeCsv(item.registeredBy),
        escapeCsv(item.registeredAt),
      ].join(',');
    });

    // UTF-8 BOM so Excel opens it with correct Indonesian character encoding
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `REKAP_ARSIP_KUA_PEKAT_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },

  // Local In-App Backup Snapshots
  getLocalSnapshots(): BackupSnapshot[] {
    try {
      const data = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Failed to parse local snapshots', e);
      return [];
    }
  },

  createLocalSnapshot(
    archives: ArchiveItem[],
    profile?: KuaProfile,
    name?: string,
    note?: string,
    createdBy: string = 'Petugas KUA'
  ): BackupSnapshot[] {
    try {
      const currentSnapshots = this.getLocalSnapshots();
      const now = new Date();
      const defaultName = name || `Cadangan Arsip KUA (${archives.length} Dokumen) - ${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

      const newSnapshot: BackupSnapshot = {
        id: `snap-${Date.now()}`,
        name: defaultName,
        createdAt: now.toISOString(),
        totalArchives: archives.length,
        archives,
        profile,
        createdBy,
        note,
      };

      // Keep up to 8 snapshots max
      const updated = [newSnapshot, ...currentSnapshots].slice(0, 8);
      localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to create snapshot', e);
      return this.getLocalSnapshots();
    }
  },

  deleteLocalSnapshot(snapshotId: string): BackupSnapshot[] {
    try {
      const currentSnapshots = this.getLocalSnapshots();
      const updated = currentSnapshots.filter((s) => s.id !== snapshotId);
      localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to delete snapshot', e);
      return this.getLocalSnapshots();
    }
  },

  restoreLocalSnapshot(snapshotId: string): { archives: ArchiveItem[]; profile?: KuaProfile } | null {
    try {
      const currentSnapshots = this.getLocalSnapshots();
      const target = currentSnapshots.find((s) => s.id === snapshotId);
      if (!target) return null;

      this.saveArchives(target.archives);
      if (target.profile) {
        this.saveKuaProfile(target.profile);
      }
      return { archives: target.archives, profile: target.profile };
    } catch (e) {
      console.error('Failed to restore snapshot', e);
      return null;
    }
  },

  // Auth user session management
  getAuthUser(): AuthUser | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as AuthUser;
    } catch (e) {
      console.warn('Failed to parse auth user', e);
      return null;
    }
  },

  saveAuthUser(user: AuthUser | null): void {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save auth user', e);
    }
  },

  clearAuthUser(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth user', e);
    }
  },

  // KUA Profile management
  getKuaProfile(): KuaProfile {
    try {
      const data = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_KUA_PROFILE));
        return DEFAULT_KUA_PROFILE;
      }
      const parsed = JSON.parse(data);
      if (parsed && parsed.officeName) {
        return {
          ...DEFAULT_KUA_PROFILE,
          ...parsed,
          serviceHours: { ...DEFAULT_KUA_PROFILE.serviceHours, ...(parsed.serviceHours || {}) },
          headOfOffice: { ...DEFAULT_KUA_PROFILE.headOfOffice, ...(parsed.headOfOffice || {}) },
          staffList: Array.isArray(parsed.staffList) ? parsed.staffList : DEFAULT_KUA_PROFILE.staffList,
          villages: Array.isArray(parsed.villages) ? parsed.villages : DEFAULT_KUA_PROFILE.villages,
          services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_KUA_PROFILE.services,
        };
      }
      return DEFAULT_KUA_PROFILE;
    } catch (e) {
      console.warn('Failed to parse KUA profile, using default', e);
      return DEFAULT_KUA_PROFILE;
    }
  },

  saveKuaProfile(profile: KuaProfile): boolean {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error('Failed to save KUA profile', e);
      return false;
    }
  },

  resetKuaProfile(): KuaProfile {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_KUA_PROFILE));
      return DEFAULT_KUA_PROFILE;
    } catch (e) {
      console.error('Failed to reset KUA profile', e);
      return DEFAULT_KUA_PROFILE;
    }
  },

  // User Accounts & Password Management (Otoritas Kepala KUA)
  getAccounts(): UserAccount[] {
    try {
      const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_USER_ACCOUNTS));
        return DEFAULT_USER_ACCOUNTS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_USER_ACCOUNTS;
    } catch (e) {
      console.warn('Failed to parse user accounts, fallback to defaults', e);
      return DEFAULT_USER_ACCOUNTS;
    }
  },

  saveAccounts(accounts: UserAccount[]): boolean {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      return true;
    } catch (e) {
      console.error('Failed to save accounts to localStorage', e);
      return false;
    }
  },

  addAccount(newAccountData: {
    username: string;
    password: string;
    name: string;
    nip: string;
    role: UserRole;
    roleLabel?: string;
  }): { success: boolean; message: string; accounts: UserAccount[] } {
    const accounts = this.getAccounts();
    const cleanUsername = newAccountData.username.trim().toLowerCase();

    if (!cleanUsername) {
      return { success: false, message: 'Username tidak boleh kosong.', accounts };
    }

    if (accounts.some((a) => a.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: `Username "${cleanUsername}" sudah digunakan oleh akun lain.`, accounts };
    }

    const now = new Date().toISOString();
    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      username: cleanUsername,
      password: newAccountData.password.trim() || 'kua123pekat',
      name: newAccountData.name.trim() || cleanUsername,
      nip: newAccountData.nip.trim() || '-',
      role: newAccountData.role,
      roleLabel: newAccountData.roleLabel || ROLE_LABELS[newAccountData.role] || 'Staf KUA Pekat',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...accounts, newAccount];
    this.saveAccounts(updated);
    return { success: true, message: `Akun "${cleanUsername}" berhasil ditambahkan.`, accounts: updated };
  },

  updateAccount(updatedAccount: UserAccount): UserAccount[] {
    const accounts = this.getAccounts();
    const now = new Date().toISOString();
    const updated = accounts.map((item) =>
      item.id === updatedAccount.id
        ? {
            ...updatedAccount,
            roleLabel: ROLE_LABELS[updatedAccount.role] || updatedAccount.roleLabel,
            updatedAt: now,
          }
        : item
    );
    this.saveAccounts(updated);
    return updated;
  },

  changePassword(userId: string, newPassword: string): { success: boolean; message: string; accounts: UserAccount[] } {
    const cleanPassword = newPassword.trim();
    if (!cleanPassword) {
      return { success: false, message: 'Kata sandi baru tidak boleh kosong.', accounts: this.getAccounts() };
    }

    const accounts = this.getAccounts();
    const targetIndex = accounts.findIndex((a) => a.id === userId);
    if (targetIndex === -1) {
      return { success: false, message: 'Akun tidak ditemukan.', accounts };
    }

    const now = new Date().toISOString();
    accounts[targetIndex] = {
      ...accounts[targetIndex],
      password: cleanPassword,
      updatedAt: now,
    };

    this.saveAccounts(accounts);
    return {
      success: true,
      message: `Kata sandi akun "${accounts[targetIndex].username}" berhasil diubah.`,
      accounts,
    };
  },

  deleteAccount(userId: string, currentLoggedUserId?: string): { success: boolean; message: string; accounts: UserAccount[] } {
    const accounts = this.getAccounts();
    const target = accounts.find((a) => a.id === userId);

    if (!target) {
      return { success: false, message: 'Akun tidak ditemukan.', accounts };
    }

    // Protection: Cannot delete own currently logged in account
    if (currentLoggedUserId && target.id === currentLoggedUserId) {
      return { success: false, message: 'Anda tidak dapat menghapus akun yang sedang Anda gunakan saat ini.', accounts };
    }

    // Protection: Ensure at least one kepala_kua remains
    if (target.role === 'kepala_kua') {
      const kepalaCount = accounts.filter((a) => a.role === 'kepala_kua').length;
      if (kepalaCount <= 1) {
        return {
          success: false,
          message: 'Sistem harus memiliki minimal satu akun Kepala KUA dengan akses penuh.',
          accounts,
        };
      }
    }

    const updated = accounts.filter((a) => a.id !== userId);
    this.saveAccounts(updated);
    return { success: true, message: `Akun "${target.username}" berhasil dihapus.`, accounts: updated };
  },

  resetAccountsToDefault(): UserAccount[] {
    this.saveAccounts(DEFAULT_USER_ACCOUNTS);
    return DEFAULT_USER_ACCOUNTS;
  },
};
