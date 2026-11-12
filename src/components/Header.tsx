import React, { useState } from 'react';
import {
  Plus,
  Building2,
  HardDriveDownload,
  BookOpen,
  Layers,
  LogOut,
  UserCheck,
  Menu,
  X,
  Shield,
  Award,
  KeyRound,
} from 'lucide-react';
import { AuthUser } from '../types/auth';

interface HeaderProps {
  onOpenNewArchive: () => void;
  onOpenProfile: () => void;
  onOpenBackup: () => void;
  onOpenAccounts: () => void;
  activeView: 'list' | 'stats';
  setActiveView: (view: 'list' | 'stats') => void;
  totalArchivesCount: number;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewArchive,
  onOpenProfile,
  onOpenBackup,
  onOpenAccounts,
  activeView,
  setActiveView,
  totalArchivesCount,
  currentUser,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isKepalaKua = currentUser?.role === 'kepala_kua';

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-emerald-900 border-b border-emerald-800 text-white shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
              <img
                src="/assets/aistudio/Kementerian_Agama_new_logo_5b643381.png"
                alt="Logo Kementerian Agama Republik Indonesia"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white leading-tight whitespace-nowrap">
                  SI-ARSIP KUA PEKAT
                </span>
                {isKepalaKua && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.2 rounded font-mono">
                    <Award className="w-3 h-3" />
                    <span>KEPALA KUA</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-emerald-300 font-normal leading-none tracking-normal whitespace-nowrap">
                Kemenag Kab. Dompu · NTB
              </span>
            </div>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-emerald-100">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 cursor-pointer ${
                activeView === 'list' ? 'text-amber-300 font-semibold border-b-2 border-amber-400' : 'text-emerald-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Katalog Arsip</span>
              <span className="text-xs font-mono bg-emerald-800/80 text-emerald-200 px-1.5 py-0.5 rounded">
                {totalArchivesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('stats')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 cursor-pointer ${
                activeView === 'stats' ? 'text-amber-300 font-semibold border-b-2 border-amber-400' : 'text-emerald-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Statistik &amp; Wilayah</span>
            </button>

            <button
              type="button"
              onClick={onOpenProfile}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 text-emerald-100 hover:bg-emerald-800/60 px-2 rounded-md cursor-pointer"
              title={isKepalaKua ? 'Kelola & Edit Profil KUA (Akses Kepala KUA)' : 'Lihat Profil KUA'}
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>Profil KUA</span>
              {isKepalaKua && (
                <span className="text-[10px] bg-amber-400/90 text-emerald-950 font-bold px-1.5 py-0.2 rounded-full">
                  Kelola
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenBackup}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 text-emerald-100 hover:bg-emerald-800/60 px-2 rounded-md cursor-pointer"
              title="Cadangkan dan Pulihkan Data Arsip"
            >
              <HardDriveDownload className="w-4 h-4 text-emerald-300" />
              <span>Backup Data</span>
            </button>

            <button
              type="button"
              onClick={onOpenAccounts}
              className={`transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 px-2.5 rounded-md cursor-pointer ${
                isKepalaKua
                  ? 'bg-amber-400 text-emerald-950 font-bold hover:bg-amber-300 shadow-2xs'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-800/60'
              }`}
              title={isKepalaKua ? 'Kelola Akun & Kata Sandi Aparatur KUA (Otoritas Kepala KUA)' : 'Akun & Kata Sandi Sistem'}
            >
              <KeyRound className={`w-4 h-4 ${isKepalaKua ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span>Kelola Akun</span>
              {isKepalaKua && (
                <span className="text-[9px] bg-emerald-950 text-amber-300 font-extrabold px-1 rounded">
                  Sandi
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Action Button, User Badge & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Access Buttons for Medium Screens */}
            <div className="flex md:hidden lg:hidden items-center gap-1">
              <button
                type="button"
                onClick={onOpenProfile}
                className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                title="Buka Profil KUA"
              >
                <Building2 className="w-4 h-4 text-amber-300" />
              </button>
              <button
                type="button"
                onClick={onOpenBackup}
                className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                title="Backup Data"
              >
                <HardDriveDownload className="w-4 h-4 text-emerald-300" />
              </button>
              <button
                type="button"
                onClick={onOpenAccounts}
                className="p-2 text-amber-300 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                title="Kelola Akun & Sandi"
              >
                <KeyRound className="w-4 h-4" />
              </button>
            </div>

            {/* Tambah Arsip Button */}
            <button
              type="button"
              onClick={onOpenNewArchive}
              className="px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-medium text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Arsip</span>
              <span className="sm:hidden">Tambah</span>
            </button>

            {/* User Info Chip (Desktop) */}
            {currentUser && (
              <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-emerald-800/80">
                <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-700 flex items-center justify-center text-amber-300 shrink-0 font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-white text-xs leading-none truncate max-w-[140px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-medium leading-tight truncate max-w-[140px]">
                    {currentUser.roleLabel}
                  </span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="px-2 sm:px-2.5 py-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1 text-xs border border-emerald-800 shrink-0 cursor-pointer"
              title="Keluar dari Sistem (Logout)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Keluar</span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors lg:hidden cursor-pointer"
              aria-label="Buka Menu Navigasi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-t border-emerald-800/80 px-4 py-4 space-y-3 animate-fadeIn">
          {/* User Profile Summary */}
          {currentUser && (
            <div className="p-3 bg-emerald-900/80 rounded-xl border border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-800 border border-emerald-700 flex items-center justify-center text-amber-300 font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">{currentUser.name}</div>
                  <div className="text-[11px] text-emerald-300">{currentUser.roleLabel}</div>
                </div>
              </div>
              {isKepalaKua && (
                <span className="text-[10px] bg-amber-400 text-emerald-950 font-extrabold px-2 py-0.5 rounded-full">
                  KEPALA KUA
                </span>
              )}
            </div>
          )}

          {/* Navigation Items */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleNavClick(() => setActiveView('list'))}
              className={`p-3 rounded-xl border flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                activeView === 'list'
                  ? 'bg-emerald-800 border-amber-400 text-amber-300'
                  : 'bg-emerald-900/60 border-emerald-800 text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Katalog Arsip ({totalArchivesCount})</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(() => setActiveView('stats'))}
              className={`p-3 rounded-xl border flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                activeView === 'stats'
                  ? 'bg-emerald-800 border-amber-400 text-amber-300'
                  : 'bg-emerald-900/60 border-emerald-800 text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Statistik &amp; Wilayah</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(onOpenProfile)}
              className="p-3 rounded-xl border border-emerald-800 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 flex items-center justify-between font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-300" />
                <span>Profil KUA</span>
              </div>
              {isKepalaKua && (
                <span className="text-[9px] bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.5 rounded">
                  Edit
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(onOpenBackup)}
              className="p-3 rounded-xl border border-emerald-800 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 flex items-center gap-2 font-medium transition-colors cursor-pointer"
            >
              <HardDriveDownload className="w-4 h-4 text-emerald-300" />
              <span>Backup Data</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick(onOpenAccounts)}
              className={`p-3 rounded-xl border flex items-center justify-between font-medium transition-colors cursor-pointer col-span-2 ${
                isKepalaKua
                  ? 'bg-amber-400 text-emerald-950 font-bold border-amber-300 shadow-xs'
                  : 'bg-emerald-900/60 border-emerald-800 text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <KeyRound className={`w-4 h-4 ${isKepalaKua ? 'text-emerald-950' : 'text-amber-300'}`} />
                <span>Kelola Akun &amp; Kata Sandi Pengguna</span>
              </div>
              {isKepalaKua && (
                <span className="text-[9px] bg-emerald-950 text-amber-300 font-extrabold px-2 py-0.5 rounded-full">
                  Kepala KUA
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
