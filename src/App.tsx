import React, { useState, useMemo, useEffect } from 'react';
import { ArchiveItem, SearchFilterState, ArchiveCategory, PekatVillage } from './types/archive';
import { AuthUser, PRESET_ACCOUNTS } from './types/auth';
import { KuaProfile, DEFAULT_KUA_PROFILE } from './types/kuaProfile';
import { storageService } from './services/storageService';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { SearchFilterBar } from './components/SearchFilterBar';
import { ArchiveTable } from './components/ArchiveTable';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { VerificationPrintModal } from './components/VerificationPrintModal';
import { ArchiveDetailModal } from './components/ArchiveDetailModal';
import { ArchiveFormModal } from './components/ArchiveFormModal';
import { KuaProfileModal } from './components/KuaProfileModal';
import { BackupModal } from './components/BackupModal';
import { AccountManagementModal } from './components/AccountManagementModal';
import { StatsView } from './components/StatsView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => storageService.getAuthUser());
  const [kuaProfile, setKuaProfile] = useState<KuaProfile>(() => storageService.getKuaProfile());
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [activeView, setActiveView] = useState<'list' | 'stats'>('list');

  // Filters State
  const [filters, setFilters] = useState<SearchFilterState>({
    keyword: '',
    category: 'all',
    village: 'all',
    year: 'all',
    hasDigitalOnly: 'all',
    status: 'all',
    cabinet: 'all',
    sortBy: 'date_desc',
  });

  // Modals state
  const [viewerItem, setViewerItem] = useState<ArchiveItem | null>(null);
  const [detailItem, setDetailItem] = useState<ArchiveItem | null>(null);
  const [printVerificationItem, setPrintVerificationItem] = useState<ArchiveItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<ArchiveItem | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);

  // Load stored archives on initial mount
  useEffect(() => {
    const loaded = storageService.getStoredArchives();
    setArchives(loaded);
  }, []);

  // Compute available unique years for filter
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    archives.forEach((item) => {
      if (item.date) {
        const yr = item.date.split('-')[0];
        if (yr) years.add(yr);
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [archives]);

  // Fast Full-Text Search and Multi-Criteria Filtering Engine
  const filteredArchives = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase();

    return archives
      .filter((item) => {
        // 1. Category Filter
        if (filters.category !== 'all' && item.category !== filters.category) {
          return false;
        }

        // 2. Village Filter
        if (filters.village !== 'all' && item.village !== filters.village) {
          return false;
        }

        // 3. Year Filter
        if (filters.year !== 'all') {
          const itemYear = item.date.split('-')[0];
          if (itemYear !== filters.year) return false;
        }

        // 4. Digital File Filter
        if (filters.hasDigitalOnly !== 'all') {
          if (item.hasDigitalFile !== filters.hasDigitalOnly) {
            return false;
          }
        }

        // 5. Cabinet Filter
        if (filters.cabinet !== 'all' && item.physicalLocation.cabinet !== filters.cabinet) {
          return false;
        }

        // 6. Keyword full-text query
        if (kw) {
          const matchNumber = item.documentNumber.toLowerCase().includes(kw);
          const matchTitle = item.title.toLowerCase().includes(kw);
          const matchVillage = item.village.toLowerCase().includes(kw);
          const matchNotes = item.notes?.toLowerCase().includes(kw) || false;

          // Marriage specific
          const matchHusband = item.marriage?.husbandName.toLowerCase().includes(kw) || false;
          const matchHusbandNik = item.marriage?.husbandNik.toLowerCase().includes(kw) || false;
          const matchWife = item.marriage?.wifeName.toLowerCase().includes(kw) || false;
          const matchWifeNik = item.marriage?.wifeNik.toLowerCase().includes(kw) || false;
          const matchGuardian = item.marriage?.guardianName.toLowerCase().includes(kw) || false;
          const matchPorporasi = item.marriage?.serialNumberBook.toLowerCase().includes(kw) || false;

          // Wakaf specific
          const matchWakif = item.wakaf?.wakifName.toLowerCase().includes(kw) || false;
          const matchNazhir = item.wakaf?.nazhirName.toLowerCase().includes(kw) || false;
          const matchPurpose = item.wakaf?.purpose.toLowerCase().includes(kw) || false;

          // Rekomendasi specific
          const matchApplicant = item.rekomendasi?.applicantName.toLowerCase().includes(kw) || false;
          const matchApplicantNik = item.rekomendasi?.applicantNik.toLowerCase().includes(kw) || false;
          const matchDestKua = item.rekomendasi?.destinationKua.toLowerCase().includes(kw) || false;

          // Kemasjidan specific
          const matchMosque = item.kemasjidan?.mosqueName.toLowerCase().includes(kw) || false;
          const matchSimas = item.kemasjidan?.mosqueIdSimas.toLowerCase().includes(kw) || false;

          return (
            matchNumber ||
            matchTitle ||
            matchVillage ||
            matchNotes ||
            matchHusband ||
            matchHusbandNik ||
            matchWife ||
            matchWifeNik ||
            matchGuardian ||
            matchPorporasi ||
            matchWakif ||
            matchNazhir ||
            matchPurpose ||
            matchApplicant ||
            matchApplicantNik ||
            matchDestKua ||
            matchMosque ||
            matchSimas
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'date_desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (filters.sortBy === 'date_asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (filters.sortBy === 'doc_number') {
          return a.documentNumber.localeCompare(b.documentNumber);
        }
        if (filters.sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [archives, filters]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((cur) => (cur?.text === text ? null : cur));
    }, 3500);
  };

  // Handlers
  const handleSaveArchive = (item: ArchiveItem) => {
    if (editItem) {
      const updated = storageService.updateArchive(item);
      setArchives(updated);
      setEditItem(null);
      showToast(`Arsip ${item.documentNumber} berhasil diperbarui.`);
    } else {
      const updated = storageService.addArchive(item);
      setArchives(updated);
      showToast(`Arsip baru ${item.documentNumber} berhasil ditambahkan.`);
    }
  };

  const handleDeleteArchive = (id: string) => {
    const target = archives.find((a) => a.id === id);
    const updated = storageService.deleteArchive(id);
    setArchives(updated);
    showToast(`Arsip ${target ? target.documentNumber : ''} berhasil dihapus dari sistem.`);
  };

  const handleUpdateFile = (
    itemId: string,
    fileData: { fileName: string; fileType: 'pdf' | 'image' | 'scan'; fileDataUrl: string; fileSize: string }
  ) => {
    const target = archives.find((a) => a.id === itemId);
    if (!target) return;

    const updatedItem: ArchiveItem = {
      ...target,
      hasDigitalFile: true,
      fileName: fileData.fileName,
      fileType: fileData.fileType,
      fileDataUrl: fileData.fileDataUrl,
      fileSize: fileData.fileSize,
    };

    const updatedList = storageService.updateArchive(updatedItem);
    setArchives(updatedList);
    setViewerItem(updatedItem);
    showToast(`Berkas digital ${fileData.fileName} berhasil disimpan.`);
  };

  const handleOpenEdit = (item: ArchiveItem) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleOpenNew = () => {
    setEditItem(null);
    setIsFormOpen(true);
  };

  // Auth & Profile handlers
  const handleLoginSuccess = (user: AuthUser) => {
    storageService.saveAuthUser(user);
    setCurrentUser(user);
    showToast(`Selamat datang, ${user.name}`);
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    storageService.clearAuthUser();
    setCurrentUser(null);
    setIsLogoutModalOpen(false);
  };

  const handleSaveKuaProfile = (updated: KuaProfile) => {
    storageService.saveKuaProfile(updated);
    setKuaProfile(updated);
    showToast('Profil KUA Kecamatan Pekat berhasil diperbarui.');
  };

  const handleResetKuaProfile = () => {
    const reset = storageService.resetKuaProfile();
    setKuaProfile(reset);
    showToast('Profil KUA dikembalikan ke pengaturan standar.');
  };

  const handleSwitchToKepalaKua = () => {
    const kepalaPreset = PRESET_ACCOUNTS.find((p) => p.user.role === 'kepala_kua');
    if (kepalaPreset) {
      const user = { ...kepalaPreset.user, loginAt: new Date().toISOString() };
      storageService.saveAuthUser(user);
      setCurrentUser(user);
      showToast('Berhasil beralih ke Akun Kepala KUA (Otoritas Penuh).');
    }
  };

  // If user is not authenticated, render official Login portal
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Official Header */}
      <Header
        onOpenNewArchive={handleOpenNew}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenAccounts={() => setIsAccountsOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        totalArchivesCount={archives.length}
        currentUser={currentUser}
        onLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top KPI Metrics Strip */}
        <StatsOverview
          archives={archives}
          selectedCategory={filters.category}
          onSelectCategory={(category: ArchiveCategory | 'all') => {
            setActiveView('list');
            setFilters((f) => ({ ...f, category, hasDigitalOnly: 'all' }));
          }}
          onSelectDigitalOnly={(val: boolean) => {
            setActiveView('list');
            setFilters((f) => ({ ...f, hasDigitalOnly: val }));
          }}
        />

        {activeView === 'list' ? (
          <>
            {/* Search and Filters Component */}
            <SearchFilterBar
              filters={filters}
              onFilterChange={setFilters}
              availableYears={availableYears}
              totalResults={filteredArchives.length}
              onOpenProfile={() => setIsProfileOpen(true)}
              onOpenBackup={() => setIsBackupOpen(true)}
              onOpenAccounts={() => setIsAccountsOpen(true)}
              isKepalaKua={currentUser?.role === 'kepala_kua'}
            />

            {/* Archives Table */}
            <ArchiveTable
              archives={filteredArchives}
              onViewDocument={(item) => setViewerItem(item)}
              onViewDetail={(item) => setDetailItem(item)}
              onPrintVerification={(item) => setPrintVerificationItem(item)}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteArchive}
              searchKeyword={filters.keyword}
            />
          </>
        ) : (
          <StatsView
            archives={archives}
            onFilterByVillage={(v) => {
              setFilters((f) => ({ ...f, village: v as PekatVillage }));
              setActiveView('list');
            }}
            onFilterNeedScan={() => {
              setFilters((f) => ({ ...f, hasDigitalOnly: false }));
              setActiveView('list');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/Kementerian_Agama_new_logo_5b643381.png"
              alt="Logo Kementerian Agama RI"
              className="w-5 h-5 object-contain"
            />
            <span className="font-semibold text-slate-700">{kuaProfile.officeName}</span>
            <span aria-hidden="true">·</span>
            <span>{kuaProfile.kemenagKab}</span>
            <span aria-hidden="true">·</span>
            <span>{kuaProfile.province}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Tentang &amp; Profil KUA
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAccountsOpen(true)}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Akun &amp; Sandi
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsBackupOpen(true)}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Cadangkan Arsip
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Kembali ke Atas &uarr;
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DocumentViewerModal
        item={viewerItem}
        onClose={() => setViewerItem(null)}
        onUpdateFile={handleUpdateFile}
        profile={kuaProfile}
      />

      <VerificationPrintModal
        item={printVerificationItem}
        onClose={() => setPrintVerificationItem(null)}
        profile={kuaProfile}
      />

      <ArchiveDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onViewDocument={(item) => {
          setDetailItem(null);
          setViewerItem(item);
        }}
        onPrintVerification={(item) => {
          setDetailItem(null);
          setPrintVerificationItem(item);
        }}
        onEdit={(item) => {
          setDetailItem(null);
          handleOpenEdit(item);
        }}
        onDelete={handleDeleteArchive}
      />

      <ArchiveFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditItem(null);
        }}
        onSave={handleSaveArchive}
        editItem={editItem}
      />

      <KuaProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={kuaProfile}
        currentUser={currentUser}
        onSaveProfile={handleSaveKuaProfile}
        onResetProfile={handleResetKuaProfile}
        onSwitchToKepalaKua={handleSwitchToKepalaKua}
        onOpenAccounts={() => setIsAccountsOpen(true)}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        archives={archives}
        profile={kuaProfile}
        currentUser={currentUser}
        onDataRestored={(newArchives, newProfile) => {
          setArchives(newArchives);
          if (newProfile) {
            setKuaProfile(newProfile);
          }
          showToast('Data arsip dan profil KUA berhasil dipulihkan.');
        }}
      />

      <AccountManagementModal
        isOpen={isAccountsOpen}
        onClose={() => setIsAccountsOpen(false)}
        currentUser={currentUser}
        onAccountsUpdated={() => {
          showToast('Data akun dan kata sandi pengguna KUA berhasil disinkronkan.');
        }}
        onSwitchToKepalaKua={handleSwitchToKepalaKua}
      />

      {/* Safe In-App Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs no-print animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="font-bold text-base text-slate-900">Keluar dari SI-ARSIP?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Sesi masuk Anda akan diakhiri dan halaman login akan ditampilkan kembali.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-700 flex items-center gap-3 text-xs animate-slideUp no-print">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-medium">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-400 hover:text-white ml-2 text-sm font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
