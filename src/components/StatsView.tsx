import React from 'react';
import { ArchiveItem, PEKAT_VILLAGES } from '../types/archive';
import {
  MapPin,
  Archive,
  CheckCircle,
  AlertTriangle,
  Building2,
  Heart,
  FileCheck,
} from 'lucide-react';

interface StatsViewProps {
  archives: ArchiveItem[];
  onFilterByVillage: (village: string) => void;
  onFilterNeedScan: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  archives,
  onFilterByVillage,
  onFilterNeedScan,
}) => {
  // Village distribution
  const villageCounts = PEKAT_VILLAGES.map((v) => {
    const totalInVillage = archives.filter((a) => a.village === v).length;
    const nikahInVillage = archives.filter(
      (a) => a.village === v && (a.category === 'akta_nikah' || a.category === 'duplikat_buku')
    ).length;
    const wakafInVillage = archives.filter(
      (a) => a.village === v && a.category === 'tanah_wakaf'
    ).length;
    return { village: v, total: totalInVillage, nikah: nikahInVillage, wakaf: wakafInVillage };
  }).sort((a, b) => b.total - a.total);

  // Cabinet distribution
  const cabinets = [
    'Lemari A (Nikah 1990-2015)',
    'Lemari B (Nikah 2016-2026)',
    'Lemari C (Wakaf & Kemasjidan)',
    'Lemari D (Surat & SK)',
  ];

  const cabinetCounts = cabinets.map((cab) => {
    return {
      name: cab,
      count: archives.filter((a) => a.physicalLocation.cabinet === cab).length,
    };
  });

  // Wakaf status breakdown
  const wakafItems = archives.filter((a) => a.category === 'tanah_wakaf' && a.wakaf);
  const wakafCertified = wakafItems.filter((w) => w.wakaf?.landStatus === 'Sertifikat Wakaf BPN').length;
  const wakafProcess = wakafItems.filter((w) => w.wakaf?.landStatus === 'Proses BPN Dompu').length;
  const wakafUncertified = wakafItems.filter((w) => w.wakaf?.landStatus === 'AIW Terbit (Belum Sertifikat)').length;

  // Digital vs need scan
  const digitalCount = archives.filter((a) => a.hasDigitalFile).length;
  const needScanItems = archives.filter((a) => !a.hasDigitalFile);

  return (
    <div className="space-y-6 no-print">
      {/* Title & Introduction */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">
          Statistik &amp; Sebaran Arsip Kantor Urusan Agama Kecamatan Pekat
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Pemantauan rekapitulasi data arsip digital, sebaran peristiwa perkawinan dan perwakafan di 10 desa wilayah kerja KUA Kecamatan Pekat, serta keterisian lemari arsip fisik di kantor.
        </p>
      </div>

      {/* Grid 1: Sebaran Desa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Sebaran Dokumen Arsip per Desa di Kecamatan Pekat</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">10 Desa Binaan</span>
          </div>

          <div className="space-y-3">
            {villageCounts.map((item) => {
              const max = Math.max(...villageCounts.map((v) => v.total), 1);
              const percentage = Math.round((item.total / max) * 100);

              return (
                <div
                  key={item.village}
                  onClick={() => onFilterByVillage(item.village)}
                  className="cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 group-hover:text-emerald-700">
                      Desa {item.village}
                    </span>
                    <div className="flex items-center gap-3 font-mono tabular-nums text-slate-500">
                      <span>{item.nikah} Nikah</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.wakaf} Wakaf</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-slate-900">{item.total} Total</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Physical cabinets & Wakaf status */}
        <div className="space-y-6">
          {/* Lemari Arsip Fisik */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
              <Archive className="w-4 h-4 text-emerald-700" />
              <span>Keterisian Lemari Arsip Fisik</span>
            </h3>
            <div className="space-y-3">
              {cabinetCounts.map((cab) => (
                <div key={cab.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-800 block">{cab.name}</span>
                  <div className="mt-1 flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Tersimpan di kantor</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {cab.count} Berkas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Wakaf Kemenag */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Status Pensertifikatan Tanah Wakaf</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-emerald-50 rounded border border-emerald-200">
                <span className="text-emerald-900 font-medium">Sertifikat Wakaf BPN Terbit</span>
                <span className="font-mono font-bold text-emerald-950 tabular-nums">{wakafCertified}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
                <span className="text-amber-900 font-medium">Dalam Proses BPN Dompu</span>
                <span className="font-mono font-bold text-amber-950 tabular-nums">{wakafProcess}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-800 font-medium">AIW Terbit (Belum Sertifikat)</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{wakafUncertified}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2: Prioritas Digitalisasi Berkas Fisik Belum Scan */}
      {needScanItems.length > 0 && (
        <div className="bg-amber-50/60 p-6 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-amber-950 text-sm">
                Prioritas Digitalisasi: {needScanItems.length} Dokumen Fisik Belum Dipindai
              </h3>
            </div>
            <button
              onClick={onFilterNeedScan}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 hover:underline"
            >
              Lihat di Tabel &rarr;
            </button>
          </div>
          <p className="text-xs text-amber-900 mb-4">
            Dokumen-dokumen berikut telah terdata pada register induk KUA Pekat namun belum memiliki lampiran scan digital. Petugas disarankan mengambil buku register fisik di lemari terkait untuk dipindai.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {needScanItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-xs text-xs space-y-1"
              >
                <div className="font-mono font-bold text-slate-900">{item.documentNumber}</div>
                <div className="font-medium text-slate-800 truncate">{item.title}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {item.physicalLocation.cabinet} · {item.physicalLocation.shelf}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
