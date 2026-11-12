import React from 'react';
import { AlertTriangle, Trash2, X, FileText, MapPin, Calendar } from 'lucide-react';
import { ArchiveItem } from '../types/archive';

interface DeleteConfirmationModalProps {
  item: ArchiveItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (id: string) => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    onConfirmDelete(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs no-print animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-rose-200 overflow-hidden transform transition-all">
        {/* Header with Danger Accent */}
        <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-rose-950">
              Konfirmasi Hapus Arsip
            </h3>
            <p className="text-xs text-rose-700 mt-0.5 leading-snug">
              Apakah Anda yakin ingin menghapus data arsip ini secara permanen dari sistem SI-ARSIP KUA Pekat?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Details Box */}
        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                Nomor Register / Dokumen
              </span>
              <span className="font-mono font-bold text-sm text-slate-900 block mt-0.5">
                {item.documentNumber}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                Judul Arsip
              </span>
              <span className="font-semibold text-slate-800 block text-xs mt-0.5">
                {item.title}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Desa {item.village}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{item.date}</span>
              </div>
            </div>

            {item.marriage && (
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                <span>Mempelai: </span>
                <strong className="text-slate-800">{item.marriage.husbandName}</strong> &amp;{' '}
                <strong className="text-slate-800">{item.marriage.wifeName}</strong>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            <span className="font-semibold text-rose-600">Perhatian:</span> Tindakan ini tidak dapat dibatalkan. Berkas fisik tetap berada di lemari penyimpanan arsip KUA Pekat, tetapi data register digital dan riwayat verifikasinya akan dihapus dari sistem.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Ya, Hapus Arsip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
