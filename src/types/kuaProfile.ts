import { PEKAT_VILLAGES } from './archive';

export interface KuaStaffMember {
  id: string;
  name: string;
  role: string;
  nip: string;
  phone?: string;
}

export interface KuaServiceItem {
  id: string;
  title: string;
  description: string;
  category: 'nikah' | 'wakaf' | 'kemasjidan' | 'konsultasi';
}

export interface KuaProfile {
  officeName: string;
  kemenagKab: string;
  province: string;
  district: string;
  regency: string;
  address: string;
  postalCode: string;
  email: string;
  phone: string;
  courtJurisdiction: string;
  description: string;
  serviceHours: {
    mondayThursday: string;
    friday: string;
    weekend: string;
  };
  headOfOffice: {
    name: string;
    nip: string;
    title: string;
    rank: string;
  };
  staffList: KuaStaffMember[];
  villages: string[];
  services: KuaServiceItem[];
}

export const DEFAULT_KUA_SERVICES: KuaServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Pendaftaran & Pencatatan Nikah (SIMKAH)',
    description: 'Pemeriksaan berkas nikah, akad nikah di Balai Nikah KUA atau Luar Balai, dan penerbitan Buku Nikah resmi.',
    category: 'nikah',
  },
  {
    id: 'srv-2',
    title: 'Bimbingan Perkawinan & Keluarga Sakinah (BP4)',
    description: 'Bimbingan calon pengantin (Bimwin), konsultasi problematika keluarga, dan mediasi perkawinan.',
    category: 'konsultasi',
  },
  {
    id: 'srv-3',
    title: 'Akta Ikrar Wakaf (AIW) & Pengelolaan Nadzhir',
    description: 'Penerbitan Akta Ikrar Wakaf tanah masjid, musholla, kuburan, dan fasilitas sosial keagamaan.',
    category: 'wakaf',
  },
  {
    id: 'srv-4',
    title: 'Pengukuran Arah Kiblat & Rumah Ibadah (SIMAS)',
    description: 'Verifikasi arah kiblat bersertifikat resmi, pendataan ID SIMAS masjid dan musholla se-Kecamatan Pekat.',
    category: 'kemasjidan',
  },
  {
    id: 'srv-5',
    title: 'Legalisir Buku Nikah & Petikan Arsip Digital',
    description: 'Pemeriksaan keabsahan dokumen register nikah fisik untuk keperluan paspor, haji/umroh, dan kependudukan.',
    category: 'nikah',
  },
  {
    id: 'srv-6',
    title: 'Bimbingan Zakat, Infaq, Shadaqah & Halal',
    description: 'Pembinaan unit pengumpul zakat (UPZ) desa dan pendampingan sertifikasi halal mandiri bagi pelaku UMK.',
    category: 'konsultasi',
  },
];

export const DEFAULT_KUA_PROFILE: KuaProfile = {
  officeName: 'Kantor Urusan Agama Kecamatan Pekat',
  kemenagKab: 'Kantor Kementerian Agama Kabupaten Dompu',
  province: 'Provinsi Nusa Tenggara Barat',
  district: 'Kecamatan Pekat',
  regency: 'Kabupaten Dompu',
  address: 'Jalan Lintas Calabai - Tambora, Kec. Pekat, Kab. Dompu, NTB',
  postalCode: '84261',
  email: 'kua.pekat.dompu@kemenag.go.id',
  phone: '0852-3890-4412',
  courtJurisdiction: 'Pengadilan Agama Dompu',
  description:
    'KUA Kecamatan Pekat adalah unit pelaksana teknis Kementerian Agama RI di tingkat kecamatan yang bertugas melaksanakan pelayanan, pengawasan, pencatatan nikah dan rujuk, pembinaan keluarga sakinah, bimbingan kemasjidan, zakat wakaf, serta penerbitan dan legalisir dokumen resmi keagamaan bagi masyarakat se-Kecamatan Pekat di kaki Gunung Tambora.',
  serviceHours: {
    mondayThursday: '07.30 – 16.00 WITA',
    friday: '07.30 – 16.30 WITA',
    weekend: 'Libur (Layanan Luar Balai sesuai jadwal akad nikah)',
  },
  headOfOffice: {
    name: 'H. RUSLAN, S.Ag',
    nip: '197405102005011004',
    title: 'Kepala KUA / Penghulu Ahli Madya',
    rank: 'Pembina (IV/a)',
  },
  staffList: [
    {
      id: 'staff-1',
      name: 'H. Ruslan, S.Ag',
      role: 'Kepala KUA / Penghulu Madya',
      nip: '197405102005011004',
      phone: '0852-3890-4412',
    },
    {
      id: 'staff-2',
      name: 'Drs. Mansyur, M.Pd.I',
      role: 'Penghulu Ahli Madya',
      nip: '197803122008011012',
      phone: '0853-3921-8730',
    },
    {
      id: 'staff-3',
      name: 'Syamsul Rizal, S.E',
      role: 'Staf Pengadministrasi Arsip & TU',
      nip: '198506142014021002',
      phone: '0823-4011-5589',
    },
    {
      id: 'staff-4',
      name: 'Ust. Fahrurrozi, S.Pd.I',
      role: 'Penyuluh Agama Islam Fungsional (PAIF)',
      nip: '198904202019031005',
      phone: '0878-6544-2211',
    },
  ],
  villages: [...PEKAT_VILLAGES],
  services: DEFAULT_KUA_SERVICES,
};
