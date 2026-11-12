import React, { useRef, useState, useEffect } from 'react';
import { ArchiveItem } from '../types/archive';
import { KuaProfile } from '../types/kuaProfile';
import { AuthUser } from '../types/auth';
import { storageService } from '../services/storageService';
import { BackupSnapshot, BackupPayload } from '../types/backup';
import {
  X,
  HardDriveDownload,
  FileSpreadsheet,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  History,
  FileJson,
  Download,
  Calendar,
  Layers,
  Save,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  archives: ArchiveItem[];
  profile?: KuaProfile;
  currentUser?: AuthUser | null;
  onDataRestored: (newArchives: ArchiveItem[], newProfile?: KuaProfile) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  archives,
  profile,
  currentUser,
  onDataRestored,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'snapshots' | 'reset'>('export');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // Import preview state
  const [pendingImportData, setPendingImportData] = useState<{
    archives: ArchiveItem[];
    profile?: KuaProfile;
    fileName: string;
    exportedAt?: string;
    totalArchives: number;
  } | null>(null);

  // Snapshots list state
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSnapshots(storageService.getLocalSnapshots());
      setSuccessMessage('');
      setErrorMessage('');
      setPendingImportData(null);
      setIsConfirmingReset(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Export JSON with full bundle
  const handleExportJson = () => {
    try {
      const actorName = currentUser ? `${currentUser.name} (${currentUser.roleLabel})` : 'Aparatur KUA Pekat';
      storageService.exportToJson(archives, profile, actorName);
      setSuccessMessage('Berkas cadangan JSON lengkap (.json) berhasil diunduh ke komputer Anda.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (e) {
      setErrorMessage('Terjadi kendala saat membuat berkas cadangan JSON.');
    }
  };

  // 2. Export CSV Excel
  const handleExportCsv = () => {
    try {
      storageService.exportToCsv(archives);
      setSuccessMessage('Rekapitulasi arsip berhasil diekspor ke format Excel (CSV).');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (e) {
      setErrorMessage('Terjadi kendala saat mengekspor ke Excel.');
    }
  };

  // 3. Import JSON with validation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Case A: Full BackupPayload format
        if (parsed && Array.isArray(parsed.archives) && parsed.archives.length > 0) {
          setPendingImportData({
            archives: parsed.archives,
            profile: parsed.kuaProfile,
            fileName: file.name,
            exportedAt: parsed.exportedAt,
            totalArchives: parsed.archives.length,
          });
        }
        // Case B: Raw Array format
        else if (Array.isArray(parsed) && parsed.length > 0) {
          setPendingImportData({
            archives: parsed,
            fileName: file.name,
            totalArchives: parsed.length,
          });
        } else {
          setErrorMessage('Format berkas tidak valid. Berkas harus berupa file JSON cadangan arsip KUA.');
        }
      } catch (err) {
        setErrorMessage('Berkas JSON tidak dapat dibaca atau rusak. Silakan pilih berkas lain.');
      }
    };

    reader.onerror = () => {
      setErrorMessage('Gagal membuka berkas cadangan dari perangkat Anda.');
    };

    reader.readAsText(file);
    // Reset input value so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!pendingImportData) return;

    try {
      storageService.saveArchives(pendingImportData.archives);
      if (pendingImportData.profile) {
        storageService.saveKuaProfile(pendingImportData.profile);
      }
      onDataRestored(pendingImportData.archives, pendingImportData.profile);
      setSuccessMessage(`Berhasil memulihkan ${pendingImportData.totalArchives} data arsip ke sistem!`);
      setPendingImportData(null);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    } catch (e) {
      setErrorMessage('Gagal menyimpan data yang dipulihkan ke penyimpanan browser.');
    }
  };

  // 4. Create Local Snapshot
  const handleCreateSnapshot = () => {
    try {
      const actor = currentUser?.name || 'Aparatur KUA';
      const updated = storageService.createLocalSnapshot(
        archives,
        profile,
        undefined,
        `Titik cadangan dibuat pada ${new Date().toLocaleTimeString('id-ID')}`,
        actor
      );
      setSnapshots(updated);
      setSuccessMessage('Titik cadangan lokal (snapshot) berhasil dibuat dan tersimpan!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e) {
      setErrorMessage('Gagal membuat titik cadangan lokal.');
    }
  };

  // 5. Restore Snapshot
  const handleRestoreSnapshot = (snapshotId: string) => {
    const res = storageService.restoreLocalSnapshot(snapshotId);
    if (res) {
      onDataRestored(res.archives, res.profile);
      setSuccessMessage(`Berhasil memulihkan ${res.archives.length} data arsip dari titik cadangan!`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    } else {
      setErrorMessage('Gagal memulihkan titik cadangan yang dipilih.');
    }
  };

  // 6. Delete Snapshot
  const handleDeleteSnapshot = (snapshotId: string) => {
    const updated = storageService.deleteLocalSnapshot(snapshotId);
    setSnapshots(updated);
    setSuccessMessage('Titik cadangan lokal berhasil dihapus.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // 7. Reset to Master Data
  const handleExecuteReset = () => {
    const reset = storageService.resetToDefault();
    onDataRestored(reset);
    setIsConfirmingReset(false);
    setSuccessMessage('Data master KUA Kecamatan Pekat berhasil dimuat ulang!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 overflow-y-auto backdrop-blur-xs no-print animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 border border-emerald-700 flex items-center justify-center text-amber-300 shadow-xs shrink-0">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Pusat Cadangan &amp; Pemulihan Data (Backup)</span>
              </h2>
              <p className="text-xs text-emerald-200">
                SI-ARSIP Kantor Urusan Agama (KUA) Kecamatan Pekat · Kab. Dompu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 shrink-0 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-3 px-3.5 font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-emerald-700 text-emerald-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>1. Unduh &amp; Ekspor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`py-3 px-3.5 font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-emerald-700 text-emerald-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>2. Pulihkan Berkas JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('snapshots')}
            className={`py-3 px-3.5 font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'snapshots'
                ? 'border-emerald-700 text-emerald-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-emerald-700" />
            <span>3. Titik Cadangan Lokal ({snapshots.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reset')}
            className={`py-3 px-3.5 font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'reset'
                ? 'border-rose-600 text-rose-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>4. Atur Ulang Master</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-800">
          {/* Status Messages */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center gap-2.5 shadow-2xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium leading-snug">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 flex items-center gap-2.5 shadow-2xs animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: UNDUH & EKSPOR */}
          {activeTab === 'export' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                    Status Basis Data Saat Ini
                  </span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {archives.length} Berkas Arsip Terdaftar
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Mencakup Akta Nikah, Tanah Wakaf, Rekomendasi Pindah Nikah, dan Dokumen Kemasjidan.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold font-mono text-sm shadow-xs shrink-0">
                  {archives.length}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Export Excel (CSV) */}
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="p-4 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-400 rounded-xl text-left transition-all shadow-2xs flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Ekspor ke Excel (Format .CSV)
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Tabel rekapitulasi data register nikah, wakaf, NIK, dan nomor porporasi untuk laporan dinas Kemenag.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-emerald-800 font-semibold text-xs">
                    <span>Unduh Rekap Spreadsheet</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Export JSON Bundle */}
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="p-4 bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 rounded-xl text-left transition-all shadow-2xs flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                      <FileJson className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Cadangan Penuh (.JSON)
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        Salinan digital menyeluruh mencakup seluruh metadata arsip, nomor register, dan profil KUA Pekat.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-amber-800 font-semibold text-xs">
                    <span>Unduh Berkas Cadangan</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Unduhan aman melalui peramban: Berkas tersimpan langsung di folder Download komputer Anda.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: PULIHKAN DARI BERKAS JSON */}
          {activeTab === 'import' && (
            <div className="space-y-4 animate-fadeIn">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileSelect}
              />

              {!pendingImportData ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl text-center bg-slate-50 hover:bg-emerald-50/40 transition-all cursor-pointer group space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Klik untuk Memilih Berkas Cadangan (.JSON)
                  </h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Pilih berkas bernama <code className="bg-slate-200 px-1 rounded">CADANGAN_ARSIP_KUA_PEKAT_*.json</code> dari perangkat Anda.
                  </p>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-emerald-800 group-hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Jelajahi Berkas di Komputer</span>
                  </button>
                </div>
              ) : (
                <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-start justify-between gap-2 border-b border-emerald-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
                        <FileJson className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">
                          {pendingImportData.fileName}
                        </h4>
                        <span className="text-[11px] text-emerald-800 font-semibold">
                          Berkas Cadangan Terverifikasi
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingImportData(null)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                        Jumlah Arsip
                      </span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">
                        {pendingImportData.totalArchives} Dokumen
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                        Profil Satker
                      </span>
                      <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                        {pendingImportData.profile ? 'Termasuk Profil' : 'Hanya Arsip'}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                        Waktu Pembuatan
                      </span>
                      <span className="font-mono text-slate-800 text-[11px] mt-0.5 block truncate">
                        {pendingImportData.exportedAt
                          ? new Date(pendingImportData.exportedAt).toLocaleDateString('id-ID')
                          : 'Tercatat'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Konfirmasi pemulihan: Data register saat ini akan diperbarui sesuai dengan isi berkas cadangan ini.
                  </p>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setPendingImportData(null)}
                      className="px-3.5 py-2 border border-slate-300 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Konfirmasi &amp; Terapkan Pemulihan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TITIK CADANGAN LOKAL (SNAPSHOTS) */}
          {activeTab === 'snapshots' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Titik Cadangan Lokal (Instant Snapshot)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Simpan salinan cepat data saat ini di peramban tanpa perlu mengunduh file.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateSnapshot}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Buat Titik Cadangan Sekarang</span>
                </button>
              </div>

              {/* Snapshots List */}
              {snapshots.length === 0 ? (
                <div className="p-8 border border-slate-200 rounded-xl text-center bg-white space-y-1 text-slate-500">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                  <p className="font-semibold text-slate-700 text-xs">Belum ada titik cadangan lokal tersimpan.</p>
                  <p className="text-[11px]">Klik tombol "Buat Titik Cadangan Sekarang" di atas untuk menyimpan salinan instan.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {snapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs truncate">
                            {snap.name}
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold shrink-0">
                            {snap.totalArchives} Arsip
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
                          <span>{new Date(snap.createdAt).toLocaleString('id-ID')}</span>
                          {snap.createdBy && <span>Oleh: {snap.createdBy}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRestoreSnapshot(snap.id)}
                          className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                          title="Pulihkan data dari titik cadangan ini"
                        >
                          Pulihkan
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSnapshot(snap.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus titik cadangan ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ATUR ULANG MASTER DATA */}
          {activeTab === 'reset' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-950">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Peringatan Atur Ulang Data Master KUA Pekat</span>
                </div>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  Fitur ini akan memulihkan data register arsip ke data master awal sistem KUA Kecamatan Pekat (akta nikah, AIW tanah wakaf, rekomendasi, surat dinas bawaan). Data tambahan yang belum dicadangkan akan tertimpa.
                </p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Pulihkan Data Bawaan Sistem
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Gunakan jika ingin memulai kembali dari data master awal resmi.
                  </p>
                </div>

                {!isConfirmingReset ? (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingReset(true)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Mulai Atur Ulang</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleExecuteReset}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                    >
                      Ya, Lanjutkan Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingReset(false)}
                      className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-medium text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Cadangan berkala disarankan untuk menjaga keamanan data arsip digital KUA Pekat.
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
