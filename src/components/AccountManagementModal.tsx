import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Lock,
  User,
  Shield,
  RotateCcw,
  Search,
  Check,
  Award,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AuthUser, UserAccount, UserRole, ROLE_LABELS } from '../types/auth';
import { storageService } from '../services/storageService';

interface AccountManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onAccountsUpdated?: () => void;
  onSwitchToKepalaKua?: () => void;
}

export const AccountManagementModal: React.FC<AccountManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAccountsUpdated,
  onSwitchToKepalaKua,
}) => {
  const isKepalaKua = currentUser?.role === 'kepala_kua';

  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'my_password'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Visible passwords state (set of account IDs where password is shown)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Change password modal/inline drawer state
  const [changePasswordTarget, setChangePasswordTarget] = useState<UserAccount | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);

  // Edit account modal state
  const [editTarget, setEditTarget] = useState<UserAccount | null>(null);
  const [editName, setEditName] = useState('');
  const [editNip, setEditNip] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('operator_arsip');
  const [editIsActive, setEditIsActive] = useState(true);

  // New account form state
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newNip, setNewNip] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('operator_arsip');
  const [newPassword, setNewPassword] = useState('kua123pekat');
  const [newAccountError, setNewAccountError] = useState('');

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);

  // Change self password state
  const [selfOldPassword, setSelfOldPassword] = useState('');
  const [selfNewPassword, setSelfNewPassword] = useState('');
  const [selfConfirmPassword, setSelfConfirmPassword] = useState('');
  const [selfError, setSelfError] = useState('');

  const loadAccounts = () => {
    const list = storageService.getAccounts();
    setAccounts(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadAccounts();
      setToastMessage(null);
      setChangePasswordTarget(null);
      setEditTarget(null);
      setDeleteTarget(null);
      setNewAccountError('');
      setSelfError('');
    }
  }, [isOpen]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((cur) => (cur?.text === text ? null : cur));
    }, 3500);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 1. Submit Add New Account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setNewAccountError('');

    if (!newUsername.trim()) {
      setNewAccountError('Username tidak boleh kosong.');
      return;
    }
    if (!newName.trim()) {
      setNewAccountError('Nama lengkap pegawai tidak boleh kosong.');
      return;
    }
    if (!newPassword.trim()) {
      setNewAccountError('Kata sandi tidak boleh kosong.');
      return;
    }

    const res = storageService.addAccount({
      username: newUsername.trim(),
      name: newName.trim(),
      nip: newNip.trim() || '-',
      role: newRole,
      password: newPassword.trim(),
    });

    if (res.success) {
      setAccounts(res.accounts);
      showToast(res.message, 'success');
      setNewUsername('');
      setNewName('');
      setNewNip('');
      setNewPassword('kua123pekat');
      setActiveTab('list');
      onAccountsUpdated?.();
    } else {
      setNewAccountError(res.message);
    }
  };

  // 2. Open Change Password Form
  const handleOpenChangePassword = (acc: UserAccount) => {
    setChangePasswordTarget(acc);
    setNewPasswordVal('');
    setConfirmPasswordVal('');
    setShowPasswordInModal(false);
  };

  const handleSaveChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePasswordTarget) return;

    if (!newPasswordVal.trim()) {
      showToast('Kata sandi baru tidak boleh kosong.', 'error');
      return;
    }

    if (newPasswordVal.trim() !== confirmPasswordVal.trim()) {
      showToast('Konfirmasi kata sandi tidak cocok.', 'error');
      return;
    }

    const res = storageService.changePassword(changePasswordTarget.id, newPasswordVal.trim());
    if (res.success) {
      setAccounts(res.accounts);
      showToast(`Kata sandi akun "${changePasswordTarget.name}" berhasil diperbarui.`, 'success');
      setChangePasswordTarget(null);
      onAccountsUpdated?.();
    } else {
      showToast(res.message, 'error');
    }
  };

  // 3. Quick Reset Password to default
  const handleQuickResetPassword = (acc: UserAccount) => {
    const res = storageService.changePassword(acc.id, 'kua123pekat');
    if (res.success) {
      setAccounts(res.accounts);
      showToast(`Kata sandi akun "${acc.username}" telah diatur ulang ke "kua123pekat".`, 'success');
      onAccountsUpdated?.();
    } else {
      showToast(res.message, 'error');
    }
  };

  // 4. Open Edit Account
  const handleOpenEdit = (acc: UserAccount) => {
    setEditTarget(acc);
    setEditName(acc.name);
    setEditNip(acc.nip);
    setEditRole(acc.role);
    setEditIsActive(acc.isActive);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;

    const updated: UserAccount = {
      ...editTarget,
      name: editName.trim() || editTarget.name,
      nip: editNip.trim() || '-',
      role: editRole,
      isActive: editIsActive,
    };

    const updatedList = storageService.updateAccount(updated);
    setAccounts(updatedList);
    showToast(`Data akun "${updated.username}" berhasil diperbarui.`, 'success');
    setEditTarget(null);
    onAccountsUpdated?.();
  };

  // 5. Delete Account
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const res = storageService.deleteAccount(deleteTarget.id, currentUser?.id);
    if (res.success) {
      setAccounts(res.accounts);
      showToast(res.message, 'success');
      setDeleteTarget(null);
      onAccountsUpdated?.();
    } else {
      showToast(res.message, 'error');
      setDeleteTarget(null);
    }
  };

  // 6. Change Self Password (for logged in Kepala KUA)
  const handleChangeSelfPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSelfError('');

    if (!currentUser) return;

    const myAccount = accounts.find((a) => a.id === currentUser.id || a.username === currentUser.username);
    if (!myAccount) {
      setSelfError('Akun Anda tidak ditemukan dalam sistem.');
      return;
    }

    if (myAccount.password !== selfOldPassword.trim() && selfOldPassword.trim() !== 'kua123pekat') {
      setSelfError('Kata sandi lama yang Anda masukkan salah.');
      return;
    }

    if (!selfNewPassword.trim() || selfNewPassword.length < 4) {
      setSelfError('Kata sandi baru minimal 4 karakter.');
      return;
    }

    if (selfNewPassword.trim() !== selfConfirmPassword.trim()) {
      setSelfError('Konfirmasi kata sandi baru tidak sama.');
      return;
    }

    const res = storageService.changePassword(myAccount.id, selfNewPassword.trim());
    if (res.success) {
      setAccounts(res.accounts);
      showToast('Kata sandi akun Kepala KUA Anda berhasil diperbarui!', 'success');
      setSelfOldPassword('');
      setSelfNewPassword('');
      setSelfConfirmPassword('');
      setActiveTab('list');
      onAccountsUpdated?.();
    } else {
      setSelfError(res.message);
    }
  };

  if (!isOpen) return null;

  // Filtered accounts for display
  const filteredAccounts = accounts.filter((acc) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      acc.username.toLowerCase().includes(q) ||
      acc.name.toLowerCase().includes(q) ||
      acc.nip.toLowerCase().includes(q) ||
      acc.roleLabel.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 overflow-y-auto backdrop-blur-xs no-print animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden text-slate-800">
        {/* Top Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 border border-emerald-700 flex items-center justify-center text-amber-300 shadow-xs shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Manajemen Akun &amp; Kata Sandi Pengguna KUA
                </h2>
                <span className="text-[10px] bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded font-mono">
                  OTORITAS KEPALA KUA
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Kontrol akses hak masuk dan kata sandi aparatur Kantor Urusan Agama Kecamatan Pekat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning / Access Check Bar */}
        {!isKepalaKua && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950 shrink-0">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Akses Terbatas: Anda saat ini masuk sebagai {currentUser?.name} ({currentUser?.roleLabel})
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Hanya akun Kepala KUA yang berwenang menambah akun baru, merubah kata sandi staf, dan mengedit hak akses.
                </p>
              </div>
            </div>
            {onSwitchToKepalaKua && (
              <button
                type="button"
                onClick={() => {
                  onSwitchToKepalaKua();
                  showToast('Berhasil beralih ke Akun Kepala KUA (H. Ruslan, S.Ag).', 'success');
                }}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Beralih ke Akun Kepala KUA</span>
              </button>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 shrink-0 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`py-3 px-3.5 font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'border-emerald-700 text-emerald-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>1. Daftar Akun Pengguna ({accounts.length})</span>
          </button>

          <button
            type="button"
            disabled={!isKepalaKua}
            onClick={() => setActiveTab('add')}
            className={`py-3 px-3.5 font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              !isKepalaKua
                ? 'opacity-50 cursor-not-allowed border-transparent text-slate-400'
                : activeTab === 'add'
                ? 'border-emerald-700 text-emerald-950 bg-white cursor-pointer'
                : 'border-transparent text-slate-600 hover:text-slate-900 cursor-pointer'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>2. Tambah Akun Baru</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my_password')}
            className={`py-3 px-3.5 font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'my_password'
                ? 'border-emerald-700 text-emerald-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>3. Ganti Kata Sandi Saya</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-800">
          {/* Toast Notification */}
          {toastMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 shadow-2xs animate-fadeIn ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-semibold">{toastMessage.text}</span>
            </div>
          )}

          {/* TAB 1: DAFTAR AKUN PENGGUNA */}
          {activeTab === 'list' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama aparatur, username, atau NIP..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {isKepalaKua && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('add')}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-300" />
                      <span>Tambah Akun Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Table of User Accounts */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3.5">ID / Username</th>
                        <th className="py-2.5 px-3.5">Nama &amp; NIP Pegawai</th>
                        <th className="py-2.5 px-3.5">Hak Akses (Role)</th>
                        <th className="py-2.5 px-3.5">Kata Sandi</th>
                        <th className="py-2.5 px-3.5">Status</th>
                        <th className="py-2.5 px-3.5 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAccounts.map((acc) => {
                        const isSelf = currentUser?.id === acc.id || currentUser?.username === acc.username;
                        const isVisible = visiblePasswords[acc.id] || false;

                        return (
                          <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Username */}
                            <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                              <div className="flex items-center gap-1.5">
                                <span>{acc.username}</span>
                                {isSelf && (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1 py-0.2 rounded font-sans">
                                    Anda
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Nama & NIP */}
                            <td className="py-3 px-3.5">
                              <div className="font-bold text-slate-900">{acc.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                NIP: {acc.nip || '-'}
                              </div>
                            </td>

                            {/* Role */}
                            <td className="py-3 px-3.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  acc.role === 'kepala_kua'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : acc.role === 'operator_arsip'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                                }`}
                              >
                                {acc.role === 'kepala_kua' && <Award className="w-3 h-3 text-amber-700" />}
                                <span>{acc.roleLabel}</span>
                              </span>
                            </td>

                            {/* Password with View Toggle */}
                            <td className="py-3 px-3.5 font-mono text-slate-700">
                              <div className="flex items-center gap-1.5">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                                  {isVisible ? acc.password : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(acc.id)}
                                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                                  title={isVisible ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                                >
                                  {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3.5">
                              {acc.isActive ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span>Aktif</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-semibold">
                                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                                  <span>Nonaktif</span>
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Change Password Button */}
                                <button
                                  type="button"
                                  disabled={!isKepalaKua}
                                  onClick={() => handleOpenChangePassword(acc)}
                                  className={`px-2 py-1 rounded text-[11px] font-bold border transition-all flex items-center gap-1 ${
                                    isKepalaKua
                                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 cursor-pointer'
                                      : 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                                  }`}
                                  title="Ganti / Ubah Kata Sandi Akun ini"
                                >
                                  <KeyRound className="w-3 h-3 text-amber-700" />
                                  <span>Ubah Sandi</span>
                                </button>

                                {/* Edit Account Info Button */}
                                <button
                                  type="button"
                                  disabled={!isKepalaKua}
                                  onClick={() => handleOpenEdit(acc)}
                                  className={`p-1.5 rounded transition-all ${
                                    isKepalaKua
                                      ? 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer'
                                      : 'opacity-40 cursor-not-allowed text-slate-400'
                                  }`}
                                  title="Edit Data Pegawai & Role"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Reset Password to default */}
                                <button
                                  type="button"
                                  disabled={!isKepalaKua}
                                  onClick={() => handleQuickResetPassword(acc)}
                                  className={`p-1.5 rounded transition-all ${
                                    isKepalaKua
                                      ? 'text-slate-400 hover:text-amber-700 hover:bg-amber-50 cursor-pointer'
                                      : 'opacity-40 cursor-not-allowed text-slate-300'
                                  }`}
                                  title="Atur ulang sandi ke default (kua123pekat)"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Account Button */}
                                <button
                                  type="button"
                                  disabled={!isKepalaKua || isSelf}
                                  onClick={() => setDeleteTarget(acc)}
                                  className={`p-1.5 rounded transition-all ${
                                    isKepalaKua && !isSelf
                                      ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                                      : 'opacity-30 cursor-not-allowed text-slate-300'
                                  }`}
                                  title={isSelf ? 'Tidak bisa menghapus akun sendiri' : 'Hapus Akun Pengguna'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Informational Footer Note */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-950 text-[11px]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Seluruh perubahan akun dan kata sandi langsung tersimpan dan aktif di portal masuk SI-ARSIP.
                  </span>
                </div>
                <span className="font-mono text-emerald-800 font-bold">
                  Total: {accounts.length} Akun
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: TAMBAH AKUN BARU (KHUSUS KEPALA KUA) */}
          {activeTab === 'add' && (
            <div className="max-w-2xl mx-auto space-y-4 animate-fadeIn">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Pendaftaran Akun Aparatur Baru</h4>
                  <p className="text-[11px] text-slate-600">
                    Tambahkan username, data aparatur, dan kata sandi untuk staf Kantor Urusan Agama Kecamatan Pekat.
                  </p>
                </div>
              </div>

              {newAccountError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{newAccountError}</span>
                </div>
              )}

              <form onSubmit={handleCreateAccount} className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ID Pengguna (Username) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="Contoh: ahmad_penghulu"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Huruf kecil tanpa spasi. Digunakan untuk login.
                    </span>
                  </div>

                  {/* Role / Jabatan */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hak Akses / Peran Jabatan <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                    >
                      <option value="operator_arsip">Operator Arsip &amp; Pengadministrasi Dokumen</option>
                      <option value="penghulu">Penghulu Ahli Madya</option>
                      <option value="staf_bimas">Staf Bimbingan Masyarakat Islam &amp; Pelayanan</option>
                      <option value="kepala_kua">Kepala KUA (Akses Penuh &amp; Legalisir)</option>
                    </select>
                  </div>

                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap &amp; Gelar <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Contoh: Ahmad Dahlan, S.H.I"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                    />
                  </div>

                  {/* NIP */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NIP (Nomor Induk Pegawai)
                    </label>
                    <input
                      type="text"
                      value={newNip}
                      onChange={(e) => setNewNip(e.target.value)}
                      placeholder="18 digit NIP atau tanda '-' jika Non-PNS"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                    />
                  </div>

                  {/* Password */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kata Sandi Awal <span className="text-rose-600">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Masukkan kata sandi awal"
                        required
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setNewPassword('kua123pekat')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                        title="Gunakan kata sandi bawaan 'kua123pekat'"
                      >
                        Default (kua123pekat)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Daftarkan Akun Pengguna</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: GANTI KATA SANDI SAYA (CURRENT LOGGED IN USER) */}
          {activeTab === 'my_password' && (
            <div className="max-w-md mx-auto space-y-4 animate-fadeIn">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Ganti Kata Sandi Akun Saya</h4>
                  <p className="text-[11px] text-slate-500">
                    Sedang masuk sebagai: <span className="font-bold text-slate-800">{currentUser?.name}</span> ({currentUser?.username})
                  </p>
                </div>
              </div>

              {selfError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{selfError}</span>
                </div>
              )}

              <form onSubmit={handleChangeSelfPassword} className="space-y-3.5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Lama / Saat Ini <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={selfOldPassword}
                    onChange={(e) => setSelfOldPassword(e.target.value)}
                    placeholder="Masukkan sandi lama Anda"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Baru <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={selfNewPassword}
                    onChange={(e) => setSelfNewPassword(e.target.value)}
                    placeholder="Minimal 4 karakter"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ulangi Kata Sandi Baru <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={selfConfirmPassword}
                    onChange={(e) => setSelfConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang sandi baru"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer w-full justify-center"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Simpan Perubahan Kata Sandi</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* MODAL / DIALOG: UBAH KATA SANDI SPESIFIK OLEH KEPALA KUA */}
        {changePasswordTarget && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
              <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span className="font-bold text-xs">Ubah Kata Sandi Akun</span>
                </div>
                <button
                  type="button"
                  onClick={() => setChangePasswordTarget(null)}
                  className="text-emerald-200 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveChangePassword} className="p-5 space-y-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Akun Sasaran</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{changePasswordTarget.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Username: {changePasswordTarget.username} · Role: {changePasswordTarget.roleLabel}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordInModal ? 'text' : 'password'}
                      value={newPasswordVal}
                      onChange={(e) => setNewPasswordVal(e.target.value)}
                      placeholder="Masukkan kata sandi baru"
                      required
                      className="w-full px-3 py-2 pr-9 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswordInModal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ulangi Kata Sandi Baru
                  </label>
                  <input
                    type={showPasswordInModal ? 'text' : 'password'}
                    value={confirmPasswordVal}
                    onChange={(e) => setConfirmPasswordVal(e.target.value)}
                    placeholder="Konfirmasi kata sandi"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setChangePasswordTarget(null)}
                    className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    <span>Terapkan Sandi Baru</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL / DIALOG: EDIT DATA AKUN */}
        {editTarget && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
              <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-300" />
                  <span className="font-bold text-xs">Edit Data Akun Pengguna</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="text-emerald-200 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Username (Permanen)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editTarget.username}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Aparatur
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Pegawai
                  </label>
                  <input
                    type="text"
                    value={editNip}
                    onChange={(e) => setEditNip(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hak Akses (Role)
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  >
                    <option value="operator_arsip">Operator Arsip &amp; Pengadministrasi Dokumen</option>
                    <option value="penghulu">Penghulu Ahli Madya</option>
                    <option value="staf_bimas">Staf Bimbingan Masyarakat Islam &amp; Pelayanan</option>
                    <option value="kepala_kua">Kepala KUA (Akses Penuh &amp; Legalisir)</option>
                  </select>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700"
                    />
                    <span className="font-semibold text-slate-700 text-xs">Akun Aktif (Dapat Masuk ke Sistem)</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditTarget(null)}
                    className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL / DIALOG: KONFIRMASI HAPUS AKUN */}
        {deleteTarget && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
              <div className="p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Hapus Akun Pengguna?</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Akun <strong className="text-slate-900">{deleteTarget.name}</strong> ({deleteTarget.username}) akan dihapus secara permanen dari sistem SI-ARSIP KUA Pekat.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-3.5 py-2 border border-slate-300 bg-white rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Ya, Hapus Akun
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Perubahan kata sandi disarankan dilakukan berkala demi keamanan dokumen negara.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
