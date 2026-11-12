import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { ArchiveItem } from '../types/archive';
import { KuaProfile } from '../types/kuaProfile';
import {
  X,
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  Upload,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface DocumentViewerModalProps {
  item: ArchiveItem | null;
  onClose: () => void;
  onUpdateFile: (itemId: string, fileData: { fileName: string; fileType: 'pdf' | 'image' | 'scan'; fileDataUrl: string; fileSize: string }) => void;
  profile?: KuaProfile;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  item,
  onClose,
  onUpdateFile,
  profile,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!item) return;

    // Generate QR verification data
    const verificationPayload = JSON.stringify({
      instansi: 'KUA Kecamatan Pekat - Kemenag Kab. Dompu',
      nomor_dokumen: item.documentNumber,
      kategori: item.category,
      judul: item.title,
      desa: item.village,
      tanggal: item.date,
      lokasi_fisik: `${item.physicalLocation.cabinet} - ${item.physicalLocation.shelf} - ${item.physicalLocation.boxNumber}`,
      verifikasi_arsip: 'TERDAFTAR RESMI PADA BUKU REGISTER KUA PEKAT',
    });

    QRCode.toDataURL(verificationPayload, {
      width: 160,
      margin: 1,
      color: {
        dark: '#064e3b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Error generating QR', err));
  }, [item]);

  if (!item) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const fileType = file.type.includes('pdf') ? 'pdf' : 'image';
      const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      onUpdateFile(item.id, {
        fileName: file.name,
        fileType,
        fileDataUrl: dataUrl,
        fileSize,
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 overflow-y-auto backdrop-blur-xs">
      <div className="bg-slate-100 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-4 shrink-0 no-print">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold truncate text-white leading-tight">
                {item.title}
              </h2>
              <div className="text-xs text-emerald-200 font-mono flex items-center gap-2">
                <span>{item.documentNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Desa {item.village}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-emerald-950/60 rounded-lg p-0.5 border border-emerald-800">
              <button
                onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                className="p-1.5 text-emerald-200 hover:text-white rounded transition-colors"
                title="Perkecil"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-2 text-emerald-100 min-w-[50px] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                className="p-1.5 text-emerald-200 hover:text-white rounded transition-colors"
                title="Perbesar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Upload / Ganti Berkas */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 hover:text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border border-emerald-700"
              title="Unggah berkas scan dokumen asli"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Unggah Scan Asli</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              title="Cetak Petikan Dokumen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors ml-1"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content Viewport */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-200/70">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150"
          >
            {/* If has an uploaded data URL image */}
            {item.fileDataUrl && item.fileType === 'image' ? (
              <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-300 max-w-2xl">
                <img
                  src={item.fileDataUrl}
                  alt={item.title}
                  className="max-w-full h-auto rounded"
                />
              </div>
            ) : item.fileDataUrl && item.fileType === 'pdf' ? (
              <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-300 w-[680px] text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{item.fileName || 'Berkas PDF'}</h3>
                <p className="text-xs text-slate-500 mt-1">Ukuran berkas: {item.fileSize || '1.2 MB'}</p>
                <div className="mt-4 flex justify-center gap-3">
                  <a
                    href={item.fileDataUrl}
                    download={item.fileName || `${item.documentNumber}.pdf`}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh PDF Asli</span>
                  </a>
                </div>
              </div>
            ) : (
              /* High-Fidelity Official KUA Pekat Digital Extract Certificate */
              <div className="bg-white w-[720px] min-h-[960px] p-10 rounded-sm shadow-xl border-4 border-double border-emerald-800 text-slate-900 relative">
                {/* Official Letterhead (Kop Kemenag RI KUA Pekat) */}
                <div className="border-b-2 border-emerald-900 pb-4 text-center relative">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    {/* Official Kemenag Green Emblem */}
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <img
                        src="/assets/aistudio/Kementerian_Agama_new_logo_5b643381.png"
                        alt="Logo Kementerian Agama RI"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold tracking-wider text-slate-700 uppercase">
                        Kementerian Agama Republik Indonesia
                      </h4>
                      <h3 className="text-sm font-bold tracking-wide text-slate-900 uppercase">
                        {profile?.kemenagKab || 'Kantor Kementerian Agama Kabupaten Dompu'}
                      </h3>
                      <h2 className="text-base font-extrabold tracking-tight text-emerald-900 uppercase">
                        {profile?.officeName || 'Kantor Urusan Agama Kecamatan Pekat'}
                      </h2>
                      <p className="text-[11px] text-slate-600">
                        Alamat: {profile?.address ? `${profile.address} ${profile.postalCode || ''}` : 'Jalan Lintas Calabai - Tambora, Kec. Pekat, Kab. Dompu, NTB 84261'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Title Header */}
                <div className="mt-6 text-center">
                  <h1 className="text-sm font-bold tracking-wide text-slate-900 underline uppercase">
                    Petikan Register Digital Arsip KUA
                  </h1>
                  <p className="text-xs font-mono font-medium text-slate-700 mt-1">
                    Nomor: {item.documentNumber}
                  </p>
                </div>

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                  <div className="text-6xl font-black text-emerald-950 uppercase -rotate-45 text-center">
                    KUA KECAMATAN PEKAT<br />KABUPATEN DOMPU
                  </div>
                </div>

                {/* Primary Data Body */}
                <div className="mt-6 space-y-4 text-xs">
                  <p className="leading-relaxed text-slate-700 text-justify">
                    Kepala Kantor Urusan Agama (KUA) Kecamatan Pekat, Kabupaten Dompu, Provinsi Nusa Tenggara Barat menerangkan bahwa berdasarkan dokumen register arsip resmi yang tersimpan pada kantor kami, tercatat data otentik sebagai berikut:
                  </p>

                  {/* Specific category details */}
                  {item.category === 'akta_nikah' && item.marriage && (
                    <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200 space-y-2.5">
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Nama Suami</span>
                        <span className="col-span-2 font-bold text-slate-900 text-sm">
                          {item.marriage.husbandName}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">NIK Suami</span>
                        <span className="col-span-2 font-mono tabular-nums text-slate-900">
                          {item.marriage.husbandNik}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">TTL Suami</span>
                        <span className="col-span-2 text-slate-800">
                          {item.marriage.husbandBirthPlaceDate || '-'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Nama Istri</span>
                        <span className="col-span-2 font-bold text-slate-900 text-sm">
                          {item.marriage.wifeName}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">NIK Istri</span>
                        <span className="col-span-2 font-mono tabular-nums text-slate-900">
                          {item.marriage.wifeNik}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Wali Nikah</span>
                        <span className="col-span-2 text-slate-800">
                          {item.marriage.guardianName} ({item.marriage.guardianRelation})
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Mas Kawin / Mahar</span>
                        <span className="col-span-2 text-slate-800">
                          {item.marriage.mahr}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Tanggal Akad Nikah</span>
                        <span className="col-span-2 text-slate-800 font-medium">
                          {item.marriage.marriageDate} {item.marriage.marriageHijriDate ? `(${item.marriage.marriageHijriDate})` : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Tempat Pelaksanaan</span>
                        <span className="col-span-2 text-slate-800">
                          {item.marriage.marriagePlace}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <span className="font-semibold text-slate-600">No. Seri Porporasi</span>
                        <span className="col-span-2 font-mono text-slate-900 font-semibold">
                          {item.marriage.serialNumberBook}
                        </span>
                      </div>
                    </div>
                  )}

                  {item.category === 'tanah_wakaf' && item.wakaf && (
                    <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200 space-y-2.5">
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Nama Wakif</span>
                        <span className="col-span-2 font-bold text-slate-900">
                          {item.wakaf.wakifName}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Nama Nazhir</span>
                        <span className="col-span-2 text-slate-900">
                          {item.wakaf.nazhirName}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Luas Tanah Wakaf</span>
                        <span className="col-span-2 font-mono text-slate-900 font-semibold">
                          {item.wakaf.landArea.toLocaleString('id-ID')} m²
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Peruntukan Wakaf</span>
                        <span className="col-span-2 text-slate-800">
                          {item.wakaf.purpose}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                        <span className="font-semibold text-slate-600">Status Sertifikat</span>
                        <span className="col-span-2 text-emerald-800 font-semibold">
                          {item.wakaf.landStatus} {item.wakaf.certificateNumber ? `(${item.wakaf.certificateNumber})` : ''}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1">
                        <span className="font-semibold text-slate-600">Lokasi Bidang</span>
                        <span className="col-span-2 text-slate-800">
                          {item.wakaf.locationDetail}, Desa {item.village}, Kec. Pekat
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Physical Register Box Verification */}
                  <div className="mt-4 p-3 bg-emerald-50/60 rounded border border-emerald-200 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-emerald-900 text-xs">
                        Audit Lokasi Arsip Fisik di Kantor:
                      </div>
                      <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                        {item.physicalLocation.cabinet} · {item.physicalLocation.shelf} · {item.physicalLocation.boxNumber} · {item.physicalLocation.folder}
                      </div>
                      <div className="text-[10px] text-emerald-700 mt-0.5">
                        Dokumen fisik tersimpan rapi dan dapat ditinjau langsung di ruang arsip KUA Pekat.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Signature & QR Verification */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex items-end justify-between">
                  {/* Left: Dynamic QR Code */}
                  <div className="text-center">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="QR Verifikasi Arsip KUA Pekat"
                        className="w-24 h-24 mx-auto border border-emerald-800 p-1 rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-slate-100 rounded border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                        QR Code
                      </div>
                    )}
                    <p className="text-[9px] font-mono text-slate-600 mt-1 max-w-[120px]">
                      Pindai untuk verifikasi keaslian arsip KUA
                    </p>
                  </div>

                  {/* Right: Signature & Stamp */}
                  <div className="text-right w-64">
                    <p className="text-xs text-slate-700">
                      Pekat, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      Kepala KUA Kecamatan Pekat
                    </p>

                    {/* Stempel & Paraf Digital */}
                    <div className="relative my-2 h-20 flex items-center justify-end">
                      {/* Stamp Seal */}
                      <div className="absolute right-12 w-20 h-20 rounded-full border-2 border-dashed border-indigo-700/80 flex items-center justify-center text-center p-1 text-[8px] text-indigo-800 font-bold uppercase rotate-[-12deg] pointer-events-none select-none">
                        <div>
                          KEMENTERIAN AGAMA<br />
                          ★ KAB. DOMPU ★<br />
                          KUA PEKAT
                        </div>
                      </div>
                      <div className="font-serif italic text-slate-700 text-lg mr-4 select-none">
                        H. Ruslan
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-900 underline">
                      {profile?.headOfOffice?.name || 'H. RUSLAN, S.Ag'}
                    </p>
                    <p className="text-[11px] font-mono text-slate-600">
                      NIP. {profile?.headOfOffice?.nip || '197405102005011004'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
