import React, { useState, useEffect } from 'react';
import {
  ArchiveItem,
  ArchiveCategory,
  PekatVillage,
  PEKAT_VILLAGES,
  PhysicalLocation,
} from '../types/archive';
import { X, Save, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ArchiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (archive: ArchiveItem) => void;
  editItem?: ArchiveItem | null;
}

export const ArchiveFormModal: React.FC<ArchiveFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editItem,
}) => {
  const [category, setCategory] = useState<ArchiveCategory>('akta_nikah');
  const [documentNumber, setDocumentNumber] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hijriDate, setHijriDate] = useState('');
  const [village, setVillage] = useState<PekatVillage>('Calabai');
  const [cabinet, setCabinet] = useState('Lemari B (Nikah 2016-2026)');
  const [shelf, setShelf] = useState('Rak 01');
  const [boxNumber, setBoxNumber] = useState(`BOKS-NKH-${new Date().getFullYear()}`);
  const [folder, setFolder] = useState('Map Berkas 01');
  const [notes, setNotes] = useState('');
  const [hasDigitalFile, setHasDigitalFile] = useState(true);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'image' | 'scan'>('pdf');
  const [fileDataUrl, setFileDataUrl] = useState('');
  const [fileSize, setFileSize] = useState('');

  // Marriage fields
  const [husbandName, setHusbandName] = useState('');
  const [husbandNik, setHusbandNik] = useState('');
  const [husbandTTL, setHusbandTTL] = useState('');
  const [wifeName, setWifeName] = useState('');
  const [wifeNik, setWifeNik] = useState('');
  const [wifeTTL, setWifeTTL] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('Ayah Kandung');
  const [mahr, setMahr] = useState('Seperangkat Alat Sholat');
  const [marriagePlace, setMarriagePlace] = useState('Balai Nikah KUA Kec. Pekat');
  const [serialNumberBook, setSerialNumberBook] = useState('');
  const [officialPenghulu, setOfficialPenghulu] = useState('H. Ruslan, S.Ag');

  // Wakaf fields
  const [wakifName, setWakifName] = useState('');
  const [nazhirName, setNazhirName] = useState('');
  const [landArea, setLandArea] = useState<number>(500);
  const [landStatus, setLandStatus] = useState<'Sertifikat Wakaf BPN' | 'AIW Terbit (Belum Sertifikat)' | 'Proses BPN Dompu'>('AIW Terbit (Belum Sertifikat)');
  const [purpose, setPurpose] = useState('Masjid & Fasilitas Pendidikan Islam');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [locationDetail, setLocationDetail] = useState('');

  // Rekomendasi fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantNik, setApplicantNik] = useState('');
  const [destinationKua, setDestinationKua] = useState('KUA Kecamatan Woja, Kabupaten Dompu');
  const [destinationVillage, setDestinationVillage] = useState('');
  const [reason, setReason] = useState('Melangsungkan pernikahan di daerah asal calon pengantin wanita');

  // Populate when editing
  useEffect(() => {
    if (editItem) {
      setCategory(editItem.category);
      setDocumentNumber(editItem.documentNumber);
      setTitle(editItem.title);
      setDate(editItem.date);
      setHijriDate(editItem.hijriDate || '');
      setVillage(editItem.village);
      setCabinet(editItem.physicalLocation.cabinet);
      setShelf(editItem.physicalLocation.shelf);
      setBoxNumber(editItem.physicalLocation.boxNumber);
      setFolder(editItem.physicalLocation.folder);
      setNotes(editItem.notes || '');
      setHasDigitalFile(editItem.hasDigitalFile);
      setFileName(editItem.fileName || '');
      setFileType(editItem.fileType || 'pdf');
      setFileDataUrl(editItem.fileDataUrl || '');
      setFileSize(editItem.fileSize || '');

      if (editItem.marriage) {
        setHusbandName(editItem.marriage.husbandName);
        setHusbandNik(editItem.marriage.husbandNik);
        setHusbandTTL(editItem.marriage.husbandBirthPlaceDate || '');
        setWifeName(editItem.marriage.wifeName);
        setWifeNik(editItem.marriage.wifeNik);
        setWifeTTL(editItem.marriage.wifeBirthPlaceDate || '');
        setGuardianName(editItem.marriage.guardianName);
        setGuardianRelation(editItem.marriage.guardianRelation);
        setMahr(editItem.marriage.mahr);
        setMarriagePlace(editItem.marriage.marriagePlace);
        setSerialNumberBook(editItem.marriage.serialNumberBook);
        setOfficialPenghulu(editItem.marriage.officialPenghulu);
      }

      if (editItem.wakaf) {
        setWakifName(editItem.wakaf.wakifName);
        setNazhirName(editItem.wakaf.nazhirName);
        setLandArea(editItem.wakaf.landArea);
        setLandStatus(editItem.wakaf.landStatus);
        setPurpose(editItem.wakaf.purpose);
        setCertificateNumber(editItem.wakaf.certificateNumber || '');
        setLocationDetail(editItem.wakaf.locationDetail);
      }

      if (editItem.rekomendasi) {
        setApplicantName(editItem.rekomendasi.applicantName);
        setApplicantNik(editItem.rekomendasi.applicantNik);
        setDestinationKua(editItem.rekomendasi.destinationKua);
        setDestinationVillage(editItem.rekomendasi.destinationVillage);
        setReason(editItem.rekomendasi.reason);
      }
    } else {
      // Default new item values
      setDocumentNumber(`${Math.floor(Math.random() * 80 + 20)}/05/PKT/V/${new Date().getFullYear()}`);
      setSerialNumberBook(`SB-${Math.floor(Math.random() * 800000 + 100000)} / IB-${Math.floor(Math.random() * 800000 + 100000)}`);
      setHusbandNik('520505');
      setWifeNik('520505');
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileDataUrl(result);
      setFileName(file.name);
      setFileType(file.type.includes('pdf') ? 'pdf' : 'image');
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setHasDigitalFile(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedTitle = title;
    if (!computedTitle) {
      if (category === 'akta_nikah') {
        computedTitle = `Akta Nikah ${husbandName || 'Suami'} & ${wifeName || 'Istri'}`;
      } else if (category === 'tanah_wakaf') {
        computedTitle = `Akta Ikrar Wakaf an. ${wakifName || 'Wakif'} (${purpose})`;
      } else if (category === 'rekomendasi_nikah') {
        computedTitle = `Surat Rekomendasi Nikah an. ${applicantName || 'Pemohon'}`;
      } else {
        computedTitle = `Dokumen Arsip ${documentNumber}`;
      }
    }

    const physicalLocation: PhysicalLocation = {
      cabinet,
      shelf,
      boxNumber,
      folder,
    };

    const newArchive: ArchiveItem = {
      id: editItem ? editItem.id : `pkt-${Date.now()}`,
      category,
      documentNumber,
      title: computedTitle,
      date,
      hijriDate: hijriDate || undefined,
      village,
      physicalLocation,
      status: 'tersedia',
      hasDigitalFile: hasDigitalFile || Boolean(fileDataUrl),
      fileName: fileName || `${documentNumber.replace(/\//g, '_')}_kua_pekat.pdf`,
      fileType,
      fileSize: fileSize || '1.1 MB',
      fileDataUrl: fileDataUrl || undefined,
      notes,
      tags: [category, village, date.split('-')[0]],
      registeredAt: editItem ? editItem.registeredAt : new Date().toISOString(),
      registeredBy: editItem ? editItem.registeredBy : 'Petugas Arsip KUA Pekat',
    };

    if (category === 'akta_nikah' || category === 'duplikat_buku') {
      newArchive.marriage = {
        husbandName,
        husbandNik,
        husbandBirthPlaceDate: husbandTTL,
        wifeName,
        wifeNik,
        wifeBirthPlaceDate: wifeTTL,
        guardianName,
        guardianRelation,
        mahr,
        marriageDate: date,
        marriageHijriDate: hijriDate,
        marriagePlace,
        serialNumberBook,
        officialPenghulu,
      };
    } else if (category === 'tanah_wakaf') {
      newArchive.wakaf = {
        wakifName,
        nazhirName,
        landArea: Number(landArea) || 0,
        landStatus,
        purpose,
        certificateNumber,
        locationDetail: locationDetail || `Desa ${village}, Kec. Pekat`,
      };
    } else if (category === 'rekomendasi_nikah') {
      newArchive.rekomendasi = {
        applicantName,
        applicantNik,
        destinationKua,
        destinationVillage,
        reason,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
    }

    onSave(newArchive);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 overflow-y-auto backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-300" />
            <h2 className="text-sm font-bold text-white">
              {editItem ? 'Edit Data Arsip KUA Pekat' : 'Pencatatan & Simpan Arsip Digital Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
          {/* 1. Kategori & Identitas Utama Dokumen */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              1. Identitas &amp; Klasifikasi Dokumen
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kategori Arsip KUA <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ArchiveCategory)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="akta_nikah">Akta Nikah / Buku Nikah (Model N)</option>
                  <option value="tanah_wakaf">Akta Ikrar Wakaf (AIW / APAIW)</option>
                  <option value="rekomendasi_nikah">Surat Rekomendasi Pindah Nikah</option>
                  <option value="kemasjidan">Data Kemasjidan &amp; SIMAS</option>
                  <option value="duplikat_buku">Duplikat Akta Nikah (Model NA)</option>
                  <option value="surat_dinas">Surat Dinas / Keputusan (SK)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nomor Dokumen / Akta / Register <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="Contoh: 042/05/PKT/V/2024"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-medium text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Desa di Wilayah Kecamatan Pekat <span className="text-rose-500">*</span>
                </label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value as PekatVillage)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  {PEKAT_VILLAGES.map((v) => (
                    <option key={v} value={v}>
                      Desa {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tanggal Akad / Terbit <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tanggal Hijriah (Opsional)
                  </label>
                  <input
                    type="text"
                    value={hijriDate}
                    onChange={(e) => setHijriDate(e.target.value)}
                    placeholder="Contoh: 14 Syawal 1445 H"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Specific Data per Category */}
          {(category === 'akta_nikah' || category === 'duplikat_buku') && (
            <div className="space-y-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-2">
                2. Data Pasangan Suami, Istri &amp; Perkawinan
              </h3>

              {/* Suami */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Suami <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={husbandName}
                    onChange={(e) => setHusbandName(e.target.value)}
                    placeholder="Nama Lengkap Suami"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    NIK Suami (16 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={husbandNik}
                    onChange={(e) => setHusbandNik(e.target.value)}
                    placeholder="520505..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs text-slate-900"
                  />
                  {husbandNik.length > 0 && husbandNik.length !== 16 && (
                    <span className="text-[10px] text-amber-600 block mt-0.5">
                      NIK saat ini {husbandNik.length} digit (standar KTP 16 digit)
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tempat, Tgl Lahir Suami
                  </label>
                  <input
                    type="text"
                    value={husbandTTL}
                    onChange={(e) => setHusbandTTL(e.target.value)}
                    placeholder="Contoh: Calabai, 12-06-1998"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Istri */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Istri <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={wifeName}
                    onChange={(e) => setWifeName(e.target.value)}
                    placeholder="Nama Lengkap Istri"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    NIK Istri (16 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={wifeNik}
                    onChange={(e) => setWifeNik(e.target.value)}
                    placeholder="520505..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs text-slate-900"
                  />
                  {wifeNik.length > 0 && wifeNik.length !== 16 && (
                    <span className="text-[10px] text-amber-600 block mt-0.5">
                      NIK saat ini {wifeNik.length} digit (standar KTP 16 digit)
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tempat, Tgl Lahir Istri
                  </label>
                  <input
                    type="text"
                    value={wifeTTL}
                    onChange={(e) => setWifeTTL(e.target.value)}
                    placeholder="Contoh: Pekat, 05-08-1999"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Wali & Mahar & Tempat */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Wali Nikah
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Nama Wali"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Hubungan Wali
                  </label>
                  <select
                    value={guardianRelation}
                    onChange={(e) => setGuardianRelation(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="Ayah Kandung">Ayah Kandung</option>
                    <option value="Kakek Kandung">Kakek Kandung</option>
                    <option value="Kakak Kandung">Kakak Kandung</option>
                    <option value="Adik Kandung">Adik Kandung</option>
                    <option value="Paman (Saudara Ayah)">Paman (Saudara Ayah)</option>
                    <option value="Wali Hakim KUA">Wali Hakim (Kepala KUA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Mas Kawin (Mahar)
                  </label>
                  <input
                    type="text"
                    value={mahr}
                    onChange={(e) => setMahr(e.target.value)}
                    placeholder="Contoh: Emas Murni 5 Gram"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Porporasi & Lokasi Akad */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    No Seri Porporasi Buku Nikah
                  </label>
                  <input
                    type="text"
                    value={serialNumberBook}
                    onChange={(e) => setSerialNumberBook(e.target.value)}
                    placeholder="Contoh: SB-9921041 / IB-9921042"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tempat Akad Nikah
                  </label>
                  <input
                    type="text"
                    value={marriagePlace}
                    onChange={(e) => setMarriagePlace(e.target.value)}
                    placeholder="Balai Nikah KUA / Rumah Mempelai..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Penghulu / Kepala KUA
                  </label>
                  <input
                    type="text"
                    value={officialPenghulu}
                    onChange={(e) => setOfficialPenghulu(e.target.value)}
                    placeholder="Nama Petugas Penghulu"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {category === 'tanah_wakaf' && (
            <div className="space-y-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-2">
                2. Rincian Tanah Wakaf (AIW / APAIW)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Wakif (Pemberi Wakaf) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={wakifName}
                    onChange={(e) => setWakifName(e.target.value)}
                    placeholder="Nama Lengkap Wakif"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Nazhir (Pengelola Wakaf) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nazhirName}
                    onChange={(e) => setNazhirName(e.target.value)}
                    placeholder="Nama Pengurus / Lembaga Nazhir"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Luas Tanah (Meter Persegi / m²)
                  </label>
                  <input
                    type="number"
                    value={landArea}
                    onChange={(e) => setLandArea(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Status Sertifikat Tanah
                  </label>
                  <select
                    value={landStatus}
                    onChange={(e) => setLandStatus(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Sertifikat Wakaf BPN">Sertifikat Wakaf BPN</option>
                    <option value="AIW Terbit (Belum Sertifikat)">AIW Terbit (Belum Sertifikat BPN)</option>
                    <option value="Proses BPN Dompu">Proses Pengukuran / Terbit di BPN Dompu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Peruntukan Wakaf
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Masjid, Musholla, TPU, Pondok Pesantren..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Lokasi Detail Bidang (Dusun / Jalan)
                  </label>
                  <input
                    type="text"
                    value={locationDetail}
                    onChange={(e) => setLocationDetail(e.target.value)}
                    placeholder="Contoh: Dusun Pasir Putih RT 02"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {category === 'rekomendasi_nikah' && (
            <div className="space-y-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-2">
                2. Data Surat Rekomendasi Pindah Nikah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Pemohon <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Nama Calon Pengantin"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    NIK Pemohon
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={applicantNik}
                    onChange={(e) => setApplicantNik(e.target.value)}
                    placeholder="520505..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    KUA Tujuan Nikah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationKua}
                    onChange={(e) => setDestinationKua(e.target.value)}
                    placeholder="Contoh: KUA Kec. Woja, Kab. Dompu"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Alasan / Keterangan
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Lokasi Penyimpanan Dokumen Fisik di Ruang Arsip KUA */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              3. Lokasi Penyimpanan Dokumen Fisik di Kantor KUA
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Lemari Arsip
                </label>
                <select
                  value={cabinet}
                  onChange={(e) => setCabinet(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  <option value="Lemari A (Nikah 1990-2015)">Lemari A (Nikah 1990-2015)</option>
                  <option value="Lemari B (Nikah 2016-2026)">Lemari B (Nikah 2016-2026)</option>
                  <option value="Lemari C (Wakaf & Kemasjidan)">Lemari C (Wakaf &amp; Kemasjidan)</option>
                  <option value="Lemari D (Surat & SK)">Lemari D (Surat &amp; SK)</option>
                  <option value="Brankas Dokumen Kritis">Brankas Dokumen Kritis</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Rak Arsip
                </label>
                <select
                  value={shelf}
                  onChange={(e) => setShelf(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  <option value="Rak 01">Rak 01 (Atas)</option>
                  <option value="Rak 02">Rak 02 (Tengah Atas)</option>
                  <option value="Rak 03">Rak 03 (Tengah Bawah)</option>
                  <option value="Rak 04">Rak 04 (Bawah)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nomor Boks Arsip
                </label>
                <input
                  type="text"
                  value={boxNumber}
                  onChange={(e) => setBoxNumber(e.target.value)}
                  placeholder="BOKS-NKH-2024"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Map / Folder / Hal.
                </label>
                <input
                  type="text"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  placeholder="Map 05 / Mei"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 4. Berkas Digital (Upload PDF / Foto Scan) */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              4. Lampiran Dokumen Scan Digital
            </h3>

            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <label className="cursor-pointer px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs shadow-xs transition-colors">
                <span>Pilih Berkas PDF / Foto Scan</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-2">
                Dukungan format: PDF, JPG, PNG (Maks 15 MB)
              </p>

              {fileName && (
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-lg border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Berkas terpilih: {fileName} ({fileSize})</span>
                </div>
              )}

              {!fileDataUrl && (
                <div className="mt-2 text-[11px] text-slate-400">
                  *Jika belum ada scan manual, sistem akan otomatis men-generate petikan digital ber-QR Code resmi.
                </div>
              )}
            </div>
          </div>

          {/* 5. Catatan Tambahan */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Catatan / Riwayat Pelayanan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan khusus, saksi-saksi, status kelengkapan berkas N1-N7, kondisi fisik buku, dll."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan ke Arsip Digital KUA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
