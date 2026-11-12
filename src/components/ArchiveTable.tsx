import React, { useState } from 'react';
import {
  ArchiveItem,
} from '../types/archive';
import {
  FileText,
  Eye,
  Printer,
  Edit2,
  Trash2,
  FileCheck,
  FileX,
  MapPin,
  ExternalLink,
  Info,
} from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface ArchiveTableProps {
  archives: ArchiveItem[];
  onViewDocument: (item: ArchiveItem) => void;
  onViewDetail: (item: ArchiveItem) => void;
  onPrintVerification: (item: ArchiveItem) => void;
  onEdit: (item: ArchiveItem) => void;
  onDelete: (id: string) => void;
  searchKeyword?: string;
}

export const ArchiveTable: React.FC<ArchiveTableProps> = ({
  archives,
  onViewDocument,
  onViewDetail,
  onPrintVerification,
  onEdit,
  onDelete,
  searchKeyword = '',
}) => {
  const [itemToDelete, setItemToDelete] = useState<ArchiveItem | null>(null);
  if (archives.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">Tidak ada arsip yang cocok</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
          {searchKeyword
            ? `Pencarian "${searchKeyword}" tidak menemukan dokumen. Coba gunakan kata kunci lain seperti nomor akta, NIK, atau nama.`
            : 'Belum ada arsip yang tersimpan pada kategori atau filter yang dipilih.'}
        </p>
      </div>
    );
  }

  // Highlight helper for keyword matches
  const highlightMatch = (text: string | undefined) => {
    if (!text) return '';
    if (!searchKeyword.trim()) return text;
    const regex = new RegExp(`(${searchKeyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-slate-900 rounded-xs px-0.5 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'akta_nikah':
        return 'Akta Nikah';
      case 'tanah_wakaf':
        return 'Tanah Wakaf (AIW)';
      case 'rekomendasi_nikah':
        return 'Rekomendasi Nikah';
      case 'kemasjidan':
        return 'Kemasjidan SIMAS';
      case 'surat_dinas':
        return 'Surat Dinas';
      case 'duplikat_buku':
        return 'Duplikat Buku Nikah';
      default:
        return cat;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden no-print">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">No. Dokumen / Register</th>
              <th className="py-3 px-4">Identitas Pihak / Judul Berkas</th>
              <th className="py-3 px-4">Desa (Pekat) & Tanggal</th>
              <th className="py-3 px-4">Lokasi Arsip Fisik</th>
              <th className="py-3 px-4">Scan Berkas</th>
              <th className="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {archives.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-emerald-50/30 transition-colors group"
              >
                {/* 1. No Dokumen & Category */}
                <td className="py-3.5 px-4 align-top">
                  <div className="font-mono font-semibold text-slate-900 tabular-nums">
                    {highlightMatch(item.documentNumber)}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>{getCategoryLabel(item.category)}</span>
                    {item.marriage?.serialNumberBook && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">Porporasi: {item.marriage.serialNumberBook.split('/')[0].trim()}</span>
                      </>
                    )}
                  </div>
                </td>

                {/* 2. Primary Subject / Metadata */}
                <td className="py-3.5 px-4 align-top">
                  {item.category === 'akta_nikah' && item.marriage ? (
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {highlightMatch(item.marriage.husbandName)}{' '}
                        <span className="text-slate-400 font-normal">&amp;</span>{' '}
                        {highlightMatch(item.marriage.wifeName)}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500 font-mono tabular-nums">
                        NIK S: {highlightMatch(item.marriage.husbandNik)} · NIK I: {highlightMatch(item.marriage.wifeNik)}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        Wali: {item.marriage.guardianName} ({item.marriage.guardianRelation})
                      </div>
                    </div>
                  ) : item.category === 'tanah_wakaf' && item.wakaf ? (
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {highlightMatch(item.title)}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-600">
                        Wakif: <span className="font-medium">{highlightMatch(item.wakaf.wakifName)}</span> · Nazhir: {highlightMatch(item.wakaf.nazhirName)}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500 font-mono tabular-nums">
                        Luas: {item.wakaf.landArea.toLocaleString('id-ID')} m² · {item.wakaf.landStatus}
                      </div>
                    </div>
                  ) : item.category === 'rekomendasi_nikah' && item.rekomendasi ? (
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {highlightMatch(item.rekomendasi.applicantName)}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-600">
                        Tujuan: <span className="font-medium">{item.rekomendasi.destinationKua}</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500 font-mono tabular-nums">
                        NIK: {highlightMatch(item.rekomendasi.applicantNik)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {highlightMatch(item.title)}
                      </div>
                      {item.notes && (
                        <div className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  )}
                </td>

                {/* 3. Village & Date */}
                <td className="py-3.5 px-4 align-top whitespace-nowrap">
                  <div className="flex items-center gap-1 font-medium text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Desa {item.village}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500 font-mono tabular-nums">
                    {item.date}
                  </div>
                  {item.hijriDate && (
                    <div className="text-[11px] text-slate-400">
                      {item.hijriDate}
                    </div>
                  )}
                </td>

                {/* 4. Physical Location */}
                <td className="py-3.5 px-4 align-top">
                  <div className="font-medium text-slate-800 text-[11px]">
                    {item.physicalLocation.cabinet}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-600 font-mono tabular-nums">
                    {item.physicalLocation.shelf} · {item.physicalLocation.boxNumber}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    {item.physicalLocation.folder}
                  </div>
                </td>

                {/* 5. Scan Berkas Status */}
                <td className="py-3.5 px-4 align-top whitespace-nowrap">
                  {item.hasDigitalFile ? (
                    <button
                      onClick={() => onViewDocument(item)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lihat File</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewDocument(item)}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 hover:underline"
                      title="Klik untuk membuat dokumen ekstrak digital resmi"
                    >
                      <FileX className="w-3.5 h-3.5 text-amber-600" />
                      <span>Fisik Saja</span>
                    </button>
                  )}
                </td>

                {/* 6. Action buttons */}
                <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Buka Dokumen Digital */}
                    <button
                      type="button"
                      onClick={() => onViewDocument(item)}
                      className="p-1.5 text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200/80 rounded-lg transition-all shadow-2xs cursor-pointer group/btn"
                      title="Buka Dokumen Digital & Ekstrak Register"
                    >
                      <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    </button>

                    {/* Detail Lengkap Register */}
                    <button
                      type="button"
                      onClick={() => onViewDetail(item)}
                      className="p-1.5 text-blue-700 bg-blue-50/80 hover:bg-blue-100 hover:text-blue-900 border border-blue-200/80 rounded-lg transition-all shadow-2xs cursor-pointer group/btn"
                      title="Lihat Detail Lengkap Register"
                    >
                      <Info className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    </button>

                    {/* Cetak Verifikasi & Legalisir */}
                    <button
                      type="button"
                      onClick={() => onPrintVerification(item)}
                      className="p-1.5 text-amber-700 bg-amber-50/80 hover:bg-amber-100 hover:text-amber-900 border border-amber-200/80 rounded-lg transition-all shadow-2xs cursor-pointer group/btn"
                      title="Cetak Surat Pemeriksaan & Legalisir Resmi"
                    >
                      <Printer className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    </button>

                    {/* Edit Data Arsip */}
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200/80 rounded-lg transition-all shadow-2xs cursor-pointer group/btn"
                      title="Ubah / Edit Data Register Arsip"
                    >
                      <Edit2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    </button>

                    {/* Hapus Arsip */}
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 text-rose-600 bg-rose-50/80 hover:bg-rose-100 hover:text-rose-800 border border-rose-200/80 rounded-lg transition-all shadow-2xs cursor-pointer group/btn"
                      title="Hapus Data Arsip dari Sistem"
                    >
                      <Trash2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* In-App Safe Delete Confirmation Modal */}
      <DeleteConfirmationModal
        item={itemToDelete}
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirmDelete={(id) => {
          onDelete(id);
          setItemToDelete(null);
        }}
      />
    </div>
  );
};
