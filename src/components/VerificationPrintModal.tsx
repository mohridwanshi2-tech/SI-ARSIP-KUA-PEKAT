import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ArchiveItem } from '../types/archive';
import { KuaProfile } from '../types/kuaProfile';
import { X, Printer, CheckCircle } from 'lucide-react';

interface VerificationPrintModalProps {
  item: ArchiveItem | null;
  onClose: () => void;
  profile?: KuaProfile;
}

export const VerificationPrintModal: React.FC<VerificationPrintModalProps> = ({
  item,
  onClose,
  profile,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('Persyaratan Pembuatan Paspor / Haji & Umroh / Administrasi Kependudukan');
  const [officialName, setOfficialName] = useState<string>(profile?.headOfOffice?.name || 'H. RUSLAN, S.Ag');
  const [officialNip, setOfficialNip] = useState<string>(profile?.headOfOffice?.nip || '197405102005011004');
  const [officialRole, setOfficialRole] = useState<string>(profile?.headOfOffice?.title || 'Kepala KUA / Penghulu Ahli Madya');

  useEffect(() => {
    if (profile) {
      setOfficialName(profile.headOfOffice.name);
      setOfficialNip(profile.headOfOffice.nip);
      setOfficialRole(profile.headOfOffice.title);
    }
  }, [profile]);

  useEffect(() => {
    if (!item) return;

    const qrData = `KUA-PEKAT-LEGALISIR:${item.documentNumber}|${item.title}|${item.date}|DESA:${item.village}|VERIFIED_AUTHENTIC`;
    QRCode.toDataURL(qrData, {
      width: 140,
      margin: 1,
      color: { dark: '#064e3b', light: '#ffffff' },
    }).then(setQrUrl);
  }, [item]);

  if (!item) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-4 shrink-0 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-300" />
            <h2 className="text-sm font-semibold">
              Cetak Surat Legalisir &amp; Verifikasi Arsip Register KUA Pekat
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (A4 / Folio)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration settings bar (Hidden in Print) */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-3 text-xs no-print">
          <span className="font-medium text-slate-700">Keperluan Surat:</span>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="flex-1 min-w-[280px] px-2.5 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
            placeholder="Contoh: Legalisir Paspor, Pendaftaran Haji, Isbat Nikah Pengadilan Agama"
          />
        </div>

        {/* Printable Paper Canvas */}
        <div className="flex-1 overflow-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
          <div className="bg-white w-[680px] min-h-[920px] p-8 sm:p-12 shadow-md border border-slate-200 text-slate-900 print:shadow-none print:border-none print:w-full print:p-0">
            {/* Official Kemenag Kop Surat */}
            <div className="border-b-2 border-emerald-900 pb-3 text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center shrink-0">
                  <img
                    src="/assets/aistudio/Kementerian_Agama_new_logo_5b643381.png"
                    alt="Logo Kementerian Agama RI"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    Kementerian Agama Republik Indonesia
                  </h4>
                  <h3 className="text-xs font-bold text-slate-900 uppercase">
                    {profile?.kemenagKab || 'Kantor Kementerian Agama Kabupaten Dompu'}
                  </h3>
                  <h2 className="text-base font-extrabold text-emerald-950 uppercase tracking-tight">
                    {profile?.officeName || 'Kantor Urusan Agama Kecamatan Pekat'}
                  </h2>
                  <p className="text-[10px] text-slate-600">
                    {profile?.address ? `${profile.address} ${profile.postalCode || ''}` : 'Jalan Lintas Calabai - Tambora, Kec. Pekat, Kab. Dompu, Prov. NTB 84261'}
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="mt-6 text-center">
              <h1 className="text-sm font-bold text-slate-950 underline uppercase tracking-wide">
                Surat Keterangan Pemeriksaan Register &amp; Legalisir Arsip
              </h1>
              <p className="text-xs font-mono text-slate-700 mt-1">
                Nomor: B-{item.documentNumber.replace(/\//g, '.')}/Kua.19.04.05/PW.01/{new Date().getFullYear()}
              </p>
            </div>

            {/* Content */}
            <div className="mt-6 space-y-3 text-xs text-justify leading-relaxed text-slate-800">
              <p>
                Yang bertanda tangan di bawah ini, Kepala Kantor Urusan Agama (KUA) Kecamatan Pekat, Kabupaten Dompu, dengan ini menerangkan dengan sesungguhnya bahwa:
              </p>

              {/* Verified Details Table */}
              <div className="my-4 border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-xs text-left">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="py-1.5 px-3 font-semibold text-slate-700 w-44">Jenis Dokumen</td>
                      <td className="py-1.5 px-3 font-medium text-slate-900">{item.title}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-3 font-semibold text-slate-700">Nomor Akta / Register</td>
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900">{item.documentNumber}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="py-1.5 px-3 font-semibold text-slate-700">Tanggal Peristiwa / Akad</td>
                      <td className="py-1.5 px-3 text-slate-900">
                        {item.date} {item.hijriDate ? `(${item.hijriDate})` : ''}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-3 font-semibold text-slate-700">Wilayah / Desa</td>
                      <td className="py-1.5 px-3 text-slate-900">Desa {item.village}, Kecamatan Pekat</td>
                    </tr>
                    {item.marriage && (
                      <>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="py-1.5 px-3 font-semibold text-slate-700">Nama Suami &amp; NIK</td>
                          <td className="py-1.5 px-3 text-slate-900">
                            <span className="font-bold">{item.marriage.husbandName}</span> (NIK: {item.marriage.husbandNik})
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="py-1.5 px-3 font-semibold text-slate-700">Nama Istri &amp; NIK</td>
                          <td className="py-1.5 px-3 text-slate-900">
                            <span className="font-bold">{item.marriage.wifeName}</span> (NIK: {item.marriage.wifeNik})
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="py-1.5 px-3 font-semibold text-slate-700">No. Seri Porporasi Buku</td>
                          <td className="py-1.5 px-3 font-mono text-slate-900">{item.marriage.serialNumberBook}</td>
                        </tr>
                      </>
                    )}
                    {item.wakaf && (
                      <>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="py-1.5 px-3 font-semibold text-slate-700">Wakif &amp; Nazhir</td>
                          <td className="py-1.5 px-3 text-slate-900">
                            Wakif: {item.wakaf.wakifName} · Nazhir: {item.wakaf.nazhirName}
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="py-1.5 px-3 font-semibold text-slate-700">Luas &amp; Peruntukan</td>
                          <td className="py-1.5 px-3 text-slate-900">
                            {item.wakaf.landArea.toLocaleString('id-ID')} m² ({item.wakaf.purpose})
                          </td>
                        </tr>
                      </>
                    )}
                    <tr className="bg-emerald-50/50">
                      <td className="py-1.5 px-3 font-semibold text-emerald-900">Temu Kembali Arsip Fisik</td>
                      <td className="py-1.5 px-3 font-mono text-xs text-emerald-950 font-medium">
                        {item.physicalLocation.cabinet} | {item.physicalLocation.shelf} | {item.physicalLocation.boxNumber} | {item.physicalLocation.folder}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Setelah dilakukan penelitian dan pencocokan secara seksama terhadap Buku Register Induk yang tersimpan pada Ruang Arsip Kantor Urusan Agama Kecamatan Pekat, data tersebut di atas adalah <strong>BENAR dan ASLI</strong> tercatat dalam register kantor kami.
              </p>

              <p>
                Surat Keterangan ini diberikan kepada yang bersangkutan untuk dipergunakan sebagai: <em>{purpose}</em>.
              </p>
            </div>

            {/* Signature Block */}
            <div className="mt-8 pt-4 flex items-end justify-between">
              {/* QR Code */}
              <div className="text-center">
                {qrUrl && (
                  <img
                    src={qrUrl}
                    alt="QR Verification"
                    className="w-20 h-20 mx-auto border border-emerald-900 p-0.5 rounded"
                  />
                )}
                <p className="text-[9px] font-mono text-slate-600 mt-1">
                  Verifikasi Sistem KUA Pekat
                </p>
              </div>

              {/* Signature */}
              <div className="text-right w-64">
                <p className="text-xs text-slate-700">Pekat, {currentDateFormatted}</p>
                <p className="text-xs font-semibold text-slate-900">{officialRole}</p>

                <div className="relative my-2 h-20 flex items-center justify-end">
                  <div className="absolute right-10 w-20 h-20 rounded-full border-2 border-dashed border-indigo-700/80 flex items-center justify-center text-center p-1 text-[8px] text-indigo-800 font-bold uppercase rotate-[-12deg] pointer-events-none select-none">
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

                <p className="text-xs font-bold text-slate-900 underline">{officialName}</p>
                <p className="text-[11px] font-mono text-slate-600">NIP. {officialNip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
