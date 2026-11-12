import React from 'react';
import { ArchiveItem, ArchiveCategory } from '../types/archive';
import { FileText, Heart, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

interface StatsOverviewProps {
  archives: ArchiveItem[];
  onSelectCategory: (category: ArchiveCategory | 'all') => void;
  onSelectDigitalOnly: (val: boolean) => void;
  selectedCategory: ArchiveCategory | 'all';
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  archives,
  onSelectCategory,
  onSelectDigitalOnly,
  selectedCategory,
}) => {
  const total = archives.length;
  const nikahCount = archives.filter((a) => a.category === 'akta_nikah' || a.category === 'duplikat_buku').length;
  const wakafCount = archives.filter((a) => a.category === 'tanah_wakaf').length;
  const digitalCount = archives.filter((a) => a.hasDigitalFile).length;
  const digitalPercentage = total > 0 ? Math.round((digitalCount / total) * 100) : 0;
  const needScanCount = total - digitalCount;

  return (
    <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
      {/* Stat 1: Total Arsip */}
      <div
        onClick={() => onSelectCategory('all')}
        className={`cursor-pointer bg-white p-4 rounded-xl border transition-all hover:shadow-md ${
          selectedCategory === 'all'
            ? 'border-emerald-600 ring-2 ring-emerald-500/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>Total Berkas Terarsip</span>
          <FileText className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">berkas</span>
        </div>
        <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
          <span>KUA Kec. Pekat</span>
          <span aria-hidden="true">·</span>
          <span>10 Desa</span>
        </div>
      </div>

      {/* Stat 2: Akta & Buku Nikah */}
      <div
        onClick={() => onSelectCategory('akta_nikah')}
        className={`cursor-pointer bg-white p-4 rounded-xl border transition-all hover:shadow-md ${
          selectedCategory === 'akta_nikah'
            ? 'border-emerald-600 ring-2 ring-emerald-500/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>Akta & Register Nikah</span>
          <Heart className="w-4 h-4 text-rose-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{nikahCount}</span>
          <span className="text-xs text-slate-500">peristiwa</span>
        </div>
        <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
          <span>Model N & Duplikat</span>
          <span aria-hidden="true">·</span>
          <span>Balai / Luar</span>
        </div>
      </div>

      {/* Stat 3: Tanah Wakaf (AIW) */}
      <div
        onClick={() => onSelectCategory('tanah_wakaf')}
        className={`cursor-pointer bg-white p-4 rounded-xl border transition-all hover:shadow-md ${
          selectedCategory === 'tanah_wakaf'
            ? 'border-emerald-600 ring-2 ring-emerald-500/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>Tanah Wakaf (AIW/APAIW)</span>
          <MapPin className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">{wakafCount}</span>
          <span className="text-xs text-slate-500">bidang</span>
        </div>
        <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
          <span>Masjid, TPU, Ponpes</span>
          <span aria-hidden="true">·</span>
          <span>SIWAK</span>
        </div>
      </div>

      {/* Stat 4: Rasio Scan Digital */}
      <div
        onClick={() => onSelectDigitalOnly(true)}
        className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md"
      >
        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
          <span>Telah Terpindai Digital</span>
          <CheckCircle className="w-4 h-4 text-teal-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">{digitalPercentage}%</span>
          <span className="text-xs font-mono tabular-nums text-slate-500">({digitalCount}/{total})</span>
        </div>
        <div className="mt-1 text-xs text-amber-700 flex items-center gap-1">
          {needScanCount > 0 ? (
            <>
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>{needScanCount} berkas fisik perlu scan</span>
            </>
          ) : (
            <span className="text-emerald-600">Seluruh arsip terdigitalisasi</span>
          )}
        </div>
      </div>
    </div>
  );
};
