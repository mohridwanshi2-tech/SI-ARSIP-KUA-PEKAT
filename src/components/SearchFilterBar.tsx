import React, { useRef, useEffect } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Archive,
  FileCheck,
  RotateCcw,
  Building2,
  HardDriveDownload,
  Award,
  KeyRound,
} from 'lucide-react';
import { ArchiveCategory, PekatVillage, PEKAT_VILLAGES, SearchFilterState } from '../types/archive';

interface SearchFilterBarProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  availableYears: string[];
  totalResults: number;
  onOpenProfile?: () => void;
  onOpenBackup?: () => void;
  onOpenAccounts?: () => void;
  isKepalaKua?: boolean;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  onFilterChange,
  availableYears,
  totalResults,
  onOpenProfile,
  onOpenBackup,
  onOpenAccounts,
  isKepalaKua,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Keyboard shortcut Ctrl+K or '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeywordChange = (keyword: string) => {
    onFilterChange({ ...filters, keyword });
  };

  const handleCategoryChange = (category: ArchiveCategory | 'all') => {
    onFilterChange({ ...filters, category });
  };

  const handleVillageChange = (village: PekatVillage | 'all') => {
    onFilterChange({ ...filters, village });
  };

  const handleYearChange = (year: string) => {
    onFilterChange({ ...filters, year });
  };

  const handleDigitalToggle = (hasDigitalOnly: boolean | 'all') => {
    onFilterChange({ ...filters, hasDigitalOnly });
  };

  const handleResetFilters = () => {
    onFilterChange({
      keyword: '',
      category: 'all',
      village: 'all',
      year: 'all',
      hasDigitalOnly: 'all',
      status: 'all',
      cabinet: 'all',
      sortBy: 'date_desc',
    });
  };

  const hasActiveAdvancedFilters =
    filters.village !== 'all' ||
    filters.year !== 'all' ||
    filters.hasDigitalOnly !== 'all' ||
    filters.cabinet !== 'all' ||
    filters.sortBy !== 'date_desc';

  const categories: { key: ArchiveCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'Semua Arsip' },
    { key: 'akta_nikah', label: 'Akta Nikah' },
    { key: 'tanah_wakaf', label: 'Tanah Wakaf' },
    { key: 'rekomendasi_nikah', label: 'Rekomendasi Nikah' },
    { key: 'kemasjidan', label: 'Kemasjidan & SIMAS' },
    { key: 'surat_dinas', label: 'Surat Dinas' },
    { key: 'duplikat_buku', label: 'Duplikat Buku' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-6 overflow-hidden no-print">
      {/* Primary Search Input Row */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="Cari No. Akta, NIK (16 digit), Nama Suami/Istri, Nama Wakif, No Porporasi, Desa..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {filters.keyword && (
              <button
                type="button"
                onClick={() => handleKeywordChange('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-200/80 rounded border border-slate-300">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Filter Toggle & Utilities */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Quick Access: Profil KUA & Backup Data */}
          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                isKepalaKua
                  ? 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
                  : 'bg-white text-emerald-900 border-slate-200 hover:bg-slate-50'
              }`}
              title={isKepalaKua ? 'Kelola & Edit Profil KUA (Akses Kepala KUA)' : 'Buka Profil KUA'}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Profil KUA</span>
              {isKepalaKua && (
                <span className="text-[9px] bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.2 rounded-full">
                  Kelola
                </span>
              )}
            </button>
          )}

          {onOpenBackup && (
            <button
              type="button"
              onClick={onOpenBackup}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Cadangkan dan Pulihkan Data Arsip"
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-emerald-700" />
              <span>Backup</span>
            </button>
          )}

          {onOpenAccounts && (
            <button
              type="button"
              onClick={onOpenAccounts}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                isKepalaKua
                  ? 'bg-amber-400 text-emerald-950 border-amber-500 hover:bg-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={isKepalaKua ? 'Kelola Akun & Kata Sandi Aparatur (Otoritas Kepala KUA)' : 'Kelola Akun & Password'}
            >
              <KeyRound className={`w-3.5 h-3.5 ${isKepalaKua ? 'text-emerald-950' : 'text-amber-600'}`} />
              <span>Akun &amp; Sandi</span>
              {isKepalaKua && (
                <span className="text-[9px] bg-emerald-950 text-amber-300 font-extrabold px-1 py-0.2 rounded-full">
                  Kepala KUA
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              showAdvanced || hasActiveAdvancedFilters
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filter Lanjutan</span>
            {hasActiveAdvancedFilters && (
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            )}
          </button>

          {(filters.keyword || hasActiveAdvancedFilters || filters.category !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
              title="Reset semua filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <div className="text-xs font-medium text-slate-500 whitespace-nowrap px-2 font-mono tabular-nums">
            {totalResults} arsip ditemukan
          </div>
        </div>
      </div>

      {/* Category Segmented Tabs (Functional Buttons) */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              filters.category === cat.key
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvanced && (
        <div className="p-4 bg-slate-50/90 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          {/* Desa Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Desa (Kecamatan Pekat)</span>
            </label>
            <select
              value={filters.village}
              onChange={(e) => handleVillageChange(e.target.value as PekatVillage | 'all')}
              className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua 10 Desa di Pekat</option>
              {PEKAT_VILLAGES.map((v) => (
                <option key={v} value={v}>
                  Desa {v}
                </option>
              ))}
            </select>
          </div>

          {/* Tahun Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tahun Dokumen / Akad</span>
            </label>
            <select
              value={filters.year}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua Tahun</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Tahun {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Status Berkas Digital */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ketersediaan Scan Digital</span>
            </label>
            <select
              value={String(filters.hasDigitalOnly)}
              onChange={(e) => {
                const val = e.target.value;
                handleDigitalToggle(val === 'all' ? 'all' : val === 'true');
              }}
              className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Semua (Digital & Fisik)</option>
              <option value="true">Hanya yang ada Scan Digital</option>
              <option value="false">Hanya Fisik (Belum Scan / Perlu Digitalisasi)</option>
            </select>
          </div>

          {/* Urutkan Berdasarkan */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-emerald-700" />
              <span>Urutkan Tampilan</span>
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  sortBy: e.target.value as SearchFilterState['sortBy'],
                })
              }
              className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="date_desc">Tanggal Terbaru</option>
              <option value="date_asc">Tanggal Terlama (Arsip Klasik)</option>
              <option value="doc_number">Nomor Dokumen / Akta</option>
              <option value="title_asc">Nama / Judul (A-Z)</option>
            </select>
          </div>
        </div>
      )}

      {/* Quick Search Presets Bar */}
      <div className="px-4 py-2 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto scrollbar-none">
        <span className="font-medium text-slate-700 shrink-0">Pencarian Cepat:</span>
        <button
          onClick={() => {
            onFilterChange({
              ...filters,
              category: 'akta_nikah',
              hasDigitalOnly: 'all',
              keyword: '',
            });
          }}
          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          Semua Akta Nikah
        </button>
        <button
          onClick={() => {
            onFilterChange({
              ...filters,
              hasDigitalOnly: false,
              keyword: '',
            });
          }}
          className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60 transition-colors whitespace-nowrap shrink-0"
        >
          Perlu Scan Digital
        </button>
        <button
          onClick={() => {
            onFilterChange({
              ...filters,
              village: 'Calabai',
              keyword: '',
            });
          }}
          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          Desa Calabai
        </button>
        <button
          onClick={() => {
            onFilterChange({
              ...filters,
              village: 'Pekat',
              keyword: '',
            });
          }}
          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          Desa Pekat
        </button>
        <button
          onClick={() => {
            onFilterChange({
              ...filters,
              category: 'tanah_wakaf',
              keyword: '',
            });
          }}
          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          Tanah Wakaf (AIW)
        </button>
      </div>
    </div>
  );
};
