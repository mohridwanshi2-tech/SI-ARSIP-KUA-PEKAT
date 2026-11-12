import React, { useState } from 'react';
import { ArchiveItem } from '../types/archive';
import {
  X,
  Printer,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Archive,
  User,
  Shield,
  FileCheck,
  FileX,
} from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface ArchiveDetailModalProps {
  item: ArchiveItem | null;
  onClose: () => void;
  onViewDocument: (item: ArchiveItem) => void;
  onPrintVerification: (item: ArchiveItem) => void;
  onEdit: (item: ArchiveItem) => void;
  onDelete?: (id: string) => void;
}

export const ArchiveDetailModal: React.FC<ArchiveDetailModalProps> = ({
  item,
  onClose,
  onViewDocument,
  onPrintVerification,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!item) return null;

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'akta_nikah':
        return 'Akta & Register Perkawinan';
      case 'tanah_wakaf':
        return 'Akta Ikrar Wakaf (AIW)';
      case 'rekomendasi_nikah':
        return 'Rekomendasi Pindah Nikah';
      case 'kemasjidan':
        return 'Kemasjidan & Rumah Ibadah (SIMAS)';
      case 'surat_dinas':
        return 'Surat Dinas & SK';
      case 'duplikat_buku':
        return 'Duplikat Buku Nikah (Model NA)';
      default:
        return cat;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 overflow-y-auto backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
              {getCategoryTitle(item.category)}
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">{item.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
          {/* Card 1: Nomor & Tanggal */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-500 font-medium">Nomor Dokumen</span>
              <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                {item.documentNumber}
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Desa (Kec. Pekat)</span>
              <div className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Desa {item.village}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Tanggal Peristiwa</span>
              <div className="font-mono text-slate-900 mt-0.5">
                {item.date} {item.hijriDate ? `(${item.hijriDate})` : ''}
              </div>
            </div>
          </div>

          {/* Card 2: Marriage Details if category is akta_nikah */}
          {item.marriage && (
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Rincian Mempelai &amp; Pernikahan</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 text-sm block">
                    {item.marriage.husbandName}
                  </span>
                  <div className="text-slate-500 mt-1 font-mono">
                    NIK: {item.marriage.husbandNik}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    TTL: {item.marriage.husbandBirthPlaceDate || '-'}
                  </div>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 text-sm block">
                    {item.marriage.wifeName}
                  </span>
                  <div className="text-slate-500 mt-1 font-mono">
                    NIK: {item.marriage.wifeNik}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    TTL: {item.marriage.wifeBirthPlaceDate || '-'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-slate-700">
                <div>
                  <span className="font-semibold text-slate-600 block">Wali Nikah:</span>
                  <span>{item.marriage.guardianName} ({item.marriage.guardianRelation})</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block">Mas Kawin:</span>
                  <span>{item.marriage.mahr}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block">Tempat Akad:</span>
                  <span>{item.marriage.marriagePlace}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block">No Seri Porporasi:</span>
                  <span className="font-mono font-bold text-slate-900">{item.marriage.serialNumberBook}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block">Penghulu / Petugas:</span>
                  <span>{item.marriage.officialPenghulu}</span>
                </div>
              </div>
            </div>
          )}

          {/* Card 3: Wakaf Details */}
          {item.wakaf && (
            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Rincian Ikrar Wakaf (AIW)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-slate-600">Pemberi Wakaf (Wakif):</span>
                  <div className="font-bold text-slate-900 mt-0.5">{item.wakaf.wakifName}</div>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Pengelola (Nazhir):</span>
                  <div className="font-medium text-slate-900 mt-0.5">{item.wakaf.nazhirName}</div>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Luas Tanah:</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {item.wakaf.landArea.toLocaleString('id-ID')} m²
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Status Sertifikat:</span>
                  <div className="font-medium text-emerald-800 mt-0.5">{item.wakaf.landStatus}</div>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-slate-600">Peruntukan:</span>
                  <div className="text-slate-800 mt-0.5">{item.wakaf.purpose}</div>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-slate-600">Lokasi Bidang:</span>
                  <div className="text-slate-800 mt-0.5">{item.wakaf.locationDetail}</div>
                </div>
              </div>
            </div>
          )}

          {/* Card 4: Rekomendasi Nikah */}
          {item.rekomendasi && (
            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Rincian Surat Rekomendasi Pindah Nikah
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-slate-600">Nama Pemohon:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{item.rekomendasi.applicantName}</div>
                  <div className="font-mono text-slate-500 text-[11px]">NIK: {item.rekomendasi.applicantNik}</div>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">KUA Tujuan:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{item.rekomendasi.destinationKua}</div>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-slate-600">Alasan:</span>
                  <div className="text-slate-800 mt-0.5">{item.rekomendasi.reason}</div>
                </div>
              </div>
            </div>
          )}

          {/* Card 5: Lokasi Penyimpanan Fisik di Kantor KUA Pekat */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
            <h3 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5 uppercase tracking-wide">
              <Archive className="w-4 h-4 text-emerald-700" />
              <span>Lokasi Temu Kembali Dokumen Fisik di Ruang Arsip</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-sans block">Lemari Arsip</span>
                <span className="font-bold text-slate-900 text-xs">{item.physicalLocation.cabinet}</span>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-sans block">Rak</span>
                <span className="font-bold text-slate-900 text-xs">{item.physicalLocation.shelf}</span>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-sans block">Nomor Boks</span>
                <span className="font-bold text-slate-900 text-xs">{item.physicalLocation.boxNumber}</span>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-sans block">Map / Halaman</span>
                <span className="font-bold text-slate-900 text-xs">{item.physicalLocation.folder}</span>
              </div>
            </div>
          </div>

          {/* Notes & Tags */}
          {item.notes && (
            <div>
              <span className="font-semibold text-slate-700 block mb-1">Catatan Tambahan Petugas:</span>
              <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Dicatat oleh: {item.registeredBy}</span>
            <span>Waktu Register: {new Date(item.registeredAt).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Modal Actions */}
        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Data</span>
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Hapus Arsip</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onPrintVerification(item);
              }}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Legalisir</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewDocument(item);
              }}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Dokumen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {onDelete && (
        <DeleteConfirmationModal
          item={item}
          isOpen={isDeleting}
          onClose={() => setIsDeleting(false)}
          onConfirmDelete={(id) => {
            setIsDeleting(false);
            onClose();
            onDelete(id);
          }}
        />
      )}
    </div>
  );
};
