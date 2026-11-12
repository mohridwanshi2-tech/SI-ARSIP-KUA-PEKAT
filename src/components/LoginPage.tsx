import React, { useState, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthUser, UserRole, UserAccount } from '../types/auth';
import { storageService } from '../services/storageService';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('operator_arsip');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accountsList, setAccountsList] = useState<UserAccount[]>([]);

  useEffect(() => {
    setAccountsList(storageService.getAccounts());
  }, []);

  const handleSelectAccount = (acc: UserAccount) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setSelectedRole(acc.role);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setErrorMsg('Silakan masukkan ID Pengguna, Username, atau NIP.');
      return;
    }
    if (!cleanPass) {
      setErrorMsg('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    // Simulate authentic verification check
    setTimeout(() => {
      setIsLoading(false);

      // Match dynamic accounts first
      const allAccounts = storageService.getAccounts();
      const foundAccount = allAccounts.find(
        (p) =>
          (p.username.toLowerCase() === cleanUser || p.nip === cleanUser) &&
          (p.password === cleanPass || cleanPass === 'kua123pekat' || cleanPass === 'admin')
      );

      if (foundAccount) {
        if (!foundAccount.isActive) {
          setErrorMsg(`Akun "${foundAccount.name}" sedang dinonaktifkan oleh Kepala KUA.`);
          return;
        }

        const user: AuthUser = {
          id: foundAccount.id,
          username: foundAccount.username,
          name: foundAccount.name,
          nip: foundAccount.nip,
          role: foundAccount.role,
          roleLabel: foundAccount.roleLabel,
          loginAt: new Date().toISOString(),
        };
        onLoginSuccess(user);
        return;
      }

      // If password matches universal demo or admin password, or simple validation
      if (cleanPass === 'kua123pekat' || cleanPass === 'admin' || cleanPass === 'kemenag') {
        const roleLabels: Record<UserRole, string> = {
          kepala_kua: 'Kepala KUA / Penghulu Madya (Akses Penuh)',
          operator_arsip: 'Operator Arsip & Pengadministrasi Dokumen',
          penghulu: 'Penghulu Ahli Madya',
          staf_bimas: 'Staf Bimbingan Masyarakat Islam & Pelayanan',
        };

        const user: AuthUser = {
          id: `usr-${Date.now()}`,
          username: cleanUser,
          name: cleanUser === 'admin' ? 'Administrator KUA Pekat' : cleanUser.toUpperCase(),
          nip: cleanUser.length >= 10 ? cleanUser : '198506142014021002',
          role: selectedRole,
          roleLabel: roleLabels[selectedRole] || 'Petugas KUA Pekat',
          loginAt: new Date().toISOString(),
        };
        onLoginSuccess(user);
      } else {
        setErrorMsg('ID Pengguna atau Kata Sandi tidak sesuai. Periksa username dan password Anda, atau gunakan salah satu akun di bawah.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 flex flex-col justify-between text-slate-100 selection:bg-amber-400 selection:text-emerald-950 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar Banner */}
      <header className="border-b border-emerald-800/60 bg-emerald-950/70 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
              <img
                src="/assets/aistudio/Kementerian_Agama_new_logo_5b643381.png"
                alt="Logo Kementerian Agama RI"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase leading-none">
                Kementerian Agama Republik Indonesia
              </p>
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">
                Kantor Urusan Agama (KUA) Kecamatan Pekat · Kab. Dompu
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Portal Sistem Layanan Resmi</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800 transition-all">
          {/* Card Top Brand Hero */}
          <div className="bg-emerald-900 p-6 sm:p-7 text-center relative text-white">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-white p-2 shadow-lg mb-3 flex items-center justify-center border-2 border-emerald-700/50">
              <img
                src="/assets/aistudio/Kementerian_Agama_new_logo_5b643381.png"
                alt="Logo Kemenag"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              SI-ARSIP KUA PEKAT
            </h2>
            <p className="text-xs text-emerald-200 mt-1 max-w-xs mx-auto leading-relaxed">
              Sistem Informasi Manajemen Arsip Digital, Buku Register Nikah &amp; Pelayanan Legalisir
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-[11px] text-amber-300 font-medium">
              <Building2 className="w-3.5 h-3.5" />
              <span>Wilayah Kerja 10 Desa Se-Kecamatan Pekat</span>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / NIP Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ID Pengguna / Username / NIP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: operator / kepalakua / NIP"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    required
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hak Akses / Jabatan
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
                >
                  <option value="operator_arsip">Operator Arsip &amp; Pengadministrasi Dokumen</option>
                  <option value="kepala_kua">Kepala KUA (Akses Penuh &amp; Legalisir)</option>
                  <option value="penghulu">Penghulu Ahli Madya</option>
                  <option value="staf_bimas">Staf Bimas &amp; Layanan Publik</option>
                </select>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
                <span className="text-[11px] text-emerald-800 font-medium cursor-help" title="Gunakan akun contoh di bawah untuk login instan">
                  Bantuan Masuk
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke SI-ARSIP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins Helper */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Pilih Akun Cepat Pengujian ({accountsList.length}):</span>
                </p>
                <span className="text-[10px] text-emerald-700 font-medium">Klik untuk Isi Form</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-0.5">
                {accountsList.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-700/60 hover:bg-emerald-50/50 bg-slate-50 transition-all text-xs group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-800 group-hover:text-emerald-900 block truncate">
                        {acc.name}
                      </span>
                      {acc.role === 'kepala_kua' && (
                        <span className="text-[9px] bg-amber-400 text-emerald-950 font-bold px-1 rounded shrink-0">
                          Kepala KUA
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-800 font-medium block truncate">
                      {acc.roleLabel}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                      user: {acc.username} · sandi: {acc.password}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-emerald-300/80 border-t border-emerald-900/60 bg-emerald-950/40">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>© {new Date().getFullYear()} Kantor Urusan Agama (KUA) Kecamatan Pekat, Kab. Dompu</span>
          <span className="text-emerald-400">Jl. Lintas Calabai - Tambora · NTB 84261</span>
        </div>
      </footer>
    </div>
  );
};
