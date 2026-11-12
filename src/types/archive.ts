export type ArchiveCategory =
  | 'akta_nikah'
  | 'tanah_wakaf'
  | 'rekomendasi_nikah'
  | 'kemasjidan'
  | 'surat_dinas'
  | 'duplikat_buku';

export type PhysicalCabinet = 'Lemari A (Nikah 1990-2015)' | 'Lemari B (Nikah 2016-2026)' | 'Lemari C (Wakaf & Kemasjidan)' | 'Lemari D (Surat & SK)' | 'Brankas Dokumen Kritis';

export type ArchiveStatus = 'tersedia' | 'dipinjam' | 'rusak_perlu_restorasi' | 'arsip_rapuh';

export const PEKAT_VILLAGES = [
  'Calabai',
  'Pekat',
  'Soritatanga',
  'Doro Petii',
  'Beringin Jaya',
  'Kadindi',
  'Kadindi Barat',
  'Tambora',
  'Karombo',
  'Nangakara',
] as const;

export type PekatVillage = typeof PEKAT_VILLAGES[number];

export interface PhysicalLocation {
  cabinet: string; // e.g. Lemari A (Nikah 1990-2015)
  shelf: string;    // e.g. Rak 02
  boxNumber: string; // e.g. BOKS-NKH-2023
  folder: string;    // e.g. Map Berkas 04/April
}

export interface MarriageMetadata {
  husbandName: string;
  husbandNik: string;
  husbandBirthPlaceDate?: string;
  wifeName: string;
  wifeNik: string;
  wifeBirthPlaceDate?: string;
  guardianName: string;
  guardianRelation: string; // Ayah Kandung, Kakak Kandung, Paman, Wali Hakim
  mahr: string; // Mas Kawin
  marriageDate: string; // YYYY-MM-DD
  marriageHijriDate?: string; // e.g. 12 Syawal 1444 H
  marriagePlace: string; // Balai Nikah KUA / Rumah Mempelai di Dusun...
  serialNumberBook: string; // No Seri Porporasi Buku Nikah (Suami/Istri)
  officialPenghulu: string; // Nama Penghulu yang menikahkan
  isbatNikah?: boolean;
}

export interface WakafMetadata {
  wakifName: string; // Pemberi Wakaf
  nazhirName: string; // Pengelola Wakaf
  landArea: number; // Luas dalam meter persegi (m2)
  landStatus: 'Sertifikat Wakaf BPN' | 'AIW Terbit (Belum Sertifikat)' | 'Proses BPN Dompu';
  purpose: string; // Masjid, Musholla, Madrasah, Pemakaman, Ponpes
  certificateNumber?: string; // Nomor Sertifikat BPN jika ada
  locationDetail: string; // Dusun / RT / RW
}

export interface RekomendasiMetadata {
  applicantName: string;
  applicantNik: string;
  destinationKua: string; // Contoh: KUA Kec. Woja, KUA Kec. Mataram
  destinationVillage: string;
  reason: string;
  validUntil: string;
}

export interface KemasjidanMetadata {
  mosqueIdSimas: string;
  mosqueName: string;
  mosqueType: 'Masjid Jami' | 'Masjid Besar' | 'Masjid Desa' | 'Musholla';
  chairmanName: string;
  addressDusun: string;
  landArea?: number;
}

export interface SuratDinasMetadata {
  letterType: 'Surat Masuk' | 'Surat Keluar' | 'Surat Keputusan (SK)';
  senderOrReceiver: string;
  regarding: string;
  disposition?: string;
}

export interface ArchiveItem {
  id: string;
  category: ArchiveCategory;
  documentNumber: string; // No. Akta Nikah / No. AIW / No. Agenda Surat
  title: string;
  date: string; // Tanggal Peristiwa / Tanggal Terbit
  hijriDate?: string;
  village: PekatVillage;
  physicalLocation: PhysicalLocation;
  status: ArchiveStatus;
  hasDigitalFile: boolean;
  fileName?: string;
  fileType?: 'pdf' | 'image' | 'scan';
  fileSize?: string;
  fileDataUrl?: string; // Base64 or Object URL
  notes?: string;
  tags: string[];
  registeredAt: string;
  registeredBy: string;
  // Specific category metadata:
  marriage?: MarriageMetadata;
  wakaf?: WakafMetadata;
  rekomendasi?: RekomendasiMetadata;
  kemasjidan?: KemasjidanMetadata;
  suratDinas?: SuratDinasMetadata;
}

export interface SearchFilterState {
  keyword: string;
  category: ArchiveCategory | 'all';
  village: PekatVillage | 'all';
  year: string; // 'all' or specific year like '2024'
  hasDigitalOnly: boolean | 'all';
  status: ArchiveStatus | 'all';
  cabinet: string | 'all';
  sortBy: 'date_desc' | 'date_asc' | 'doc_number' | 'title_asc';
}
