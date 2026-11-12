import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Building2,
  Phone,
  Mail,
  Clock,
  Users,
  Edit3,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  ArrowLeft,
  Briefcase,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';
import { KuaProfile, KuaStaffMember, KuaServiceItem } from '../types/kuaProfile';
import { AuthUser } from '../types/auth';

interface KuaProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: KuaProfile;
  currentUser: AuthUser | null;
  onSaveProfile: (updatedProfile: KuaProfile) => void;
  onResetProfile: () => void;
  onSwitchToKepalaKua?: () => void;
  onOpenAccounts?: () => void;
}

export const KuaProfileModal: React.FC<KuaProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentUser,
  onSaveProfile,
  onResetProfile,
  onSwitchToKepalaKua,
  onOpenAccounts,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<KuaProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'umum' | 'kepala' | 'staf' | 'desa' | 'layanan' | 'jam_kontak'>('umum');
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // Quick state for adding new items
  const [newVillageName, setNewVillageName] = useState('');
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'nikah' | 'wakaf' | 'kemasjidan' | 'konsultasi'>('nikah');
  const [isAddingService, setIsAddingService] = useState(false);

  // Role check: Is current user logged in as Kepala KUA?
  const isKepalaKua = currentUser?.role === 'kepala_kua';

  // Sync state when profile prop changes or modal opens
  useEffect(() => {
    setFormData(profile);
    setIsEditing(false);
    setSaveSuccess(false);
    setIsConfirmingReset(false);
    setIsAddingService(false);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 900);
  };

  const handleResetToDefault = () => {
    onResetProfile();
    setIsConfirmingReset(false);
    setIsEditing(false);
  };

  // Staff members helper
  const handleUpdateStaff = (index: number, field: keyof KuaStaffMember, value: string) => {
    const updated = [...formData.staffList];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, staffList: updated });
  };

  const handleAddStaff = () => {
    const newStaff: KuaStaffMember = {
      id: `staff-${Date.now()}`,
      name: '',
      role: 'Penghulu / Staf Pelayanan',
      nip: '-',
      phone: '',
    };
    setFormData({
      ...formData,
      staffList: [...formData.staffList, newStaff],
    });
    setActiveTab('staf');
  };

  const handleRemoveStaff = (index: number) => {
    const updated = formData.staffList.filter((_, i) => i !== index);
    setFormData({ ...formData, staffList: updated });
  };

  // Villages helpers
  const handleAddVillage = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newVillageName.trim();
    if (!clean) return;
    if (formData.villages.includes(clean)) {
      setNewVillageName('');
      return;
    }
    setFormData({
      ...formData,
      villages: [...formData.villages, clean],
    });
    setNewVillageName('');
  };

  const handleRemoveVillage = (villageToRemove: string) => {
    setFormData({
      ...formData,
      villages: formData.villages.filter((v) => v !== villageToRemove),
    });
  };

  // Services helpers
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;

    const newSrv: KuaServiceItem = {
      id: `srv-${Date.now()}`,
      title: newServiceTitle.trim(),
      description: newServiceDesc.trim() || 'Layanan terpadu Kantor Urusan Agama Kecamatan Pekat.',
      category: newServiceCategory,
    };

    setFormData({
      ...formData,
      services: [...formData.services, newSrv],
    });
    setNewServiceTitle('');
    setNewServiceDesc('');
    setIsAddingService(false);
  };

  const handleRemoveService = (serviceId: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s.id !== serviceId),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 overflow-y-auto backdrop-blur-xs no-print animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src="/assets/aistudio/Kementerian_Agama_new_logo_5b643381.png"
                alt="Logo Kementerian Agama RI"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  {isEditing ? 'Kelola & Edit Profil KUA Pekat' : 'Profil KUA Kecamatan Pekat'}
                </h2>
                {isKepalaKua ? (
                  <span className="text-[10px] bg-amber-400 text-emerald-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Award className="w-3 h-3" />
                    <span>Akun Kepala KUA</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-medium">
                    {currentUser?.roleLabel || 'Pengguna'}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200">
                {formData.kemenagKab} · {formData.province}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Buka Formulir Tambah, Edit & Hapus Isi Profil"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isKepalaKua ? 'Kelola Profil KUA' : 'Edit Profil'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kepala KUA Authority Notice Banner */}
        {isEditing && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Otoritas Kepala KUA Aktif:</strong> Anda dapat <strong>Menambah</strong>, <strong>Mengedit</strong>, dan <strong>Menghapus</strong> data aparatur, desa, kontak, dan layanan KUA.
              </span>
            </div>
            {!isKepalaKua && onSwitchToKepalaKua && (
              <button
                type="button"
                onClick={() => {
                  onSwitchToKepalaKua();
                }}
                className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950 whitespace-nowrap"
              >
                Ganti ke Akun Kepala KUA &rarr;
              </button>
            )}
          </div>
        )}

        {/* Modal Body Content */}
        {!isEditing ? (
          /* ================= VIEW MODE ================= */
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
            {/* Summary Banner */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-xl shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/10 p-2 border border-white/20 shrink-0 flex items-center justify-center">
                <img
                  src="/assets/aistudio/Kementerian_Agama_new_logo_5b643381.png"
                  alt="Logo Kementerian Agama RI"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-sm font-bold text-amber-300">
                    {profile.officeName}
                  </h3>
                </div>
                <p className="mt-1.5 leading-relaxed text-emerald-100 text-xs text-justify">
                  {profile.description}
                </p>
              </div>
            </div>

            {/* Kepala KUA Card */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800">
                    Kepala Kantor Urusan Agama (KUA)
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {profile.headOfOffice.name}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {profile.headOfOffice.title} · {profile.headOfOffice.rank}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right text-xs">
                <span className="text-slate-500 block text-[10px]">Nomor Induk Pegawai:</span>
                <span className="font-mono font-bold text-slate-800">{profile.headOfOffice.nip}</span>
              </div>
            </div>

            {/* Program Layanan Unggulan KUA */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Program Layanan Unggulan KUA Kecamatan Pekat</span>
                </h4>
                <span className="text-[11px] text-emerald-800 font-semibold font-mono">
                  {profile.services?.length || 0} Layanan
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(profile.services || []).map((srv) => (
                  <div key={srv.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <h5 className="font-bold text-slate-900 text-xs text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{srv.title}</span>
                    </h5>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      {srv.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wilayah Kerja Desa */}
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Wilayah Kerja {profile.villages.length} Desa Se-Kecamatan Pekat</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  {profile.villages.length} Desa Binaan
                </span>
              </div>
              <p className="text-slate-600 mb-3 text-[11px]">
                KUA Kecamatan Pekat melayani administrasi pernikahan, perwakafan, dan rumah ibadah di desa-desa binaan:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {profile.villages.map((desa, idx) => (
                  <div
                    key={desa}
                    className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-center font-medium text-slate-800"
                  >
                    <span className="text-[10px] text-slate-400 block font-mono">0{idx + 1}</span>
                    <span>Desa {desa}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pejabat & Petugas KUA */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Struktur Aparatur, Penghulu &amp; Staf KUA</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  {profile.staffList.length} Personel
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.staffList.map((staff) => (
                  <div key={staff.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block text-xs">{staff.name}</span>
                    <span className="text-emerald-800 font-medium text-[11px] block">{staff.role}</span>
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] mt-1">
                      <span>NIP. {staff.nip}</span>
                      {staff.phone && <span>{staff.phone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jam Pelayanan & Kontak */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Jam Pelayanan Kantor</span>
                </h5>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>Senin – Kamis : {profile.serviceHours.mondayThursday}</li>
                  <li>Jum'at : {profile.serviceHours.friday}</li>
                  <li>Sabtu – Minggu : {profile.serviceHours.weekend}</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Alamat &amp; Kontak Resmi</span>
                </h5>
                <div className="text-slate-600 text-[11px] space-y-1">
                  <p>{profile.address} {profile.postalCode}</p>
                  <p className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-700" />
                    <span>{profile.email}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-700" />
                    <span>{profile.phone}</span>
                  </p>
                  <p className="text-slate-500">Wilayah Hukum: {profile.courtJurisdiction}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= EDIT MODE (KEPALA KUA FULL MANAGEMENT) ================= */
          <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
            {/* Edit Sub-navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('umum')}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'umum'
                    ? 'border-emerald-700 text-emerald-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Data Satker &amp; Visi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kepala')}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'kepala'
                    ? 'border-emerald-700 text-emerald-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Data Kepala KUA
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('staf')}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'staf'
                    ? 'border-emerald-700 text-emerald-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Aparatur / Staf ({formData.staffList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('desa')}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'desa'
                    ? 'border-emerald-700 text-emerald-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                4. Wilayah Desa ({formData.villages.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('layanan')}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'layanan'
                    ? 'border-emerald-700 text-emerald-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                5. Program Layanan ({formData.services?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('jam_kontak')}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'jam_kontak'
                    ? 'border-emerald-700 text-emerald-900 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                6. Jam &amp; Kontak
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-800">
              {/* TAB 1: DATA UMUM */}
              {activeTab === 'umum' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Satuan Kerja / Kantor
                      </label>
                      <input
                        type="text"
                        value={formData.officeName}
                        onChange={(e) => setFormData({ ...formData, officeName: e.target.value })}
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Kementerian Agama Kabupaten
                      </label>
                      <input
                        type="text"
                        value={formData.kemenagKab}
                        onChange={(e) => setFormData({ ...formData, kemenagKab: e.target.value })}
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Kecamatan
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Kabupaten
                      </label>
                      <input
                        type="text"
                        value={formData.regency}
                        onChange={(e) => setFormData({ ...formData, regency: e.target.value })}
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Provinsi
                      </label>
                      <input
                        type="text"
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Deskripsi Profil, Tugas Pokok &amp; Fungsi KUA
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Wilayah Hukum Pengadilan Agama
                    </label>
                    <input
                      type="text"
                      value={formData.courtJurisdiction}
                      onChange={(e) => setFormData({ ...formData, courtJurisdiction: e.target.value })}
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: DATA KEPALA KUA */}
              {activeTab === 'kepala' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
                    <strong>Pemberitahuan Khusus Kepala KUA:</strong> Data Kepala KUA di bawah ini digunakan secara otomatis sebagai penandatangan resmi pada <em>Kop Legalisir Surat Keterangan Pemeriksaan Arsip</em> dan <em>Petikan Register Digital</em>.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Lengkap &amp; Gelar Kepala KUA
                      </label>
                      <input
                        type="text"
                        value={formData.headOfOffice.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOfOffice: { ...formData.headOfOffice, name: e.target.value },
                          })
                        }
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        NIP (Nomor Induk Pegawai)
                      </label>
                      <input
                        type="text"
                        value={formData.headOfOffice.nip}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOfOffice: { ...formData.headOfOffice, nip: e.target.value },
                          })
                        }
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Jabatan Kedinasan
                      </label>
                      <input
                        type="text"
                        value={formData.headOfOffice.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOfOffice: { ...formData.headOfOffice, title: e.target.value },
                          })
                        }
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Pangkat / Golongan Ruang
                      </label>
                      <input
                        type="text"
                        value={formData.headOfOffice.rank}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            headOfOffice: { ...formData.headOfOffice, rank: e.target.value },
                          })
                        }
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DAFTAR STAF & APARATUR (TAMBAH, EDIT, HAPUS) */}
              {activeTab === 'staf' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Kelola Aparatur &amp; Staf KUA Pekat
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        Kepala KUA dapat <strong>menambah pegawai baru</strong>, <strong>mengubah data</strong>, atau <strong>menghapus aparatur</strong>.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {onOpenAccounts && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenAccounts();
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          title="Kelola Username & Password Login Pegawai"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Kelola Akun &amp; Sandi Login</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleAddStaff}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Petugas Baru</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {formData.staffList.map((staff, idx) => (
                      <div
                        key={staff.id || idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Aparatur #{idx + 1}: {staff.name || 'Belum diisi'}</span>
                          </span>
                          {formData.staffList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStaff(idx)}
                              className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 text-xs flex items-center gap-1 rounded transition-colors cursor-pointer border border-rose-200"
                              title="Hapus Petugas Ini dari Struktur KUA"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus Petugas</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Nama Lengkap &amp; Gelar
                            </label>
                            <input
                              type="text"
                              value={staff.name}
                              onChange={(e) => handleUpdateStaff(idx, 'name', e.target.value)}
                              required
                              placeholder="Nama Petugas"
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-emerald-700 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Tugas / Jabatan
                            </label>
                            <input
                              type="text"
                              value={staff.role}
                              onChange={(e) => handleUpdateStaff(idx, 'role', e.target.value)}
                              required
                              placeholder="Penghulu / Staf TU / Penyuluh"
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-emerald-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              NIP (Nomor Induk Pegawai)
                            </label>
                            <input
                              type="text"
                              value={staff.nip}
                              onChange={(e) => handleUpdateStaff(idx, 'nip', e.target.value)}
                              placeholder="NIP atau '-' jika non-ASN"
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:ring-1 focus:ring-emerald-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              No. Telepon / WhatsApp
                            </label>
                            <input
                              type="text"
                              value={staff.phone || ''}
                              onChange={(e) => handleUpdateStaff(idx, 'phone', e.target.value)}
                              placeholder="08XX-XXXX-XXXX"
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:ring-1 focus:ring-emerald-700"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: WILAYAH DESA (TAMBAH, EDIT, HAPUS) */}
              {activeTab === 'desa' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Kelola Wilayah Kerja Desa Binaan KUA Pekat
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        Tambah desa baru atau hapus desa dari daftar wilayah kerja KUA Kecamatan Pekat.
                      </p>
                    </div>
                  </div>

                  {/* Tambah Desa Form */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <label className="block font-bold text-emerald-950 text-xs mb-1.5">
                      Tambah Desa Baru ke Wilayah KUA:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newVillageName}
                        onChange={(e) => setNewVillageName(e.target.value)}
                        placeholder="Contoh: Desa Tambora Jaya"
                        className="flex-1 p-2 bg-white border border-emerald-300 rounded-lg text-xs text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddVillage}
                        className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Desa</span>
                      </button>
                    </div>
                  </div>

                  {/* Daftar Desa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {formData.villages.map((desa, idx) => (
                      <div
                        key={desa}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-emerald-800 text-white flex items-center justify-center font-mono text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-slate-900 text-xs">Desa {desa}</span>
                        </div>
                        {formData.villages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVillage(desa)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title={`Hapus Desa ${desa}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PROGRAM LAYANAN UNGGULAN (TAMBAH, EDIT, HAPUS) */}
              {activeTab === 'layanan' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Program Layanan Unggulan KUA Pekat
                      </h4>
                      <p className="text-slate-500 text-[11px]">
                        Kelola daftar layanan resmi yang disediakan bagi masyarakat Kecamatan Pekat.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingService(!isAddingService)}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingService ? 'Tutup Form' : 'Tambah Layanan Baru'}</span>
                    </button>
                  </div>

                  {/* Form Tambah Layanan Baru */}
                  {isAddingService && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 animate-fadeIn">
                      <h5 className="font-bold text-emerald-950 text-xs">Form Tambah Layanan KUA:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Nama / Judul Layanan
                          </label>
                          <input
                            type="text"
                            value={newServiceTitle}
                            onChange={(e) => setNewServiceTitle(e.target.value)}
                            placeholder="Contoh: Pengukuran Arah Kiblat Mandiri"
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-700 mb-1">
                            Kategori
                          </label>
                          <select
                            value={newServiceCategory}
                            onChange={(e) => setNewServiceCategory(e.target.value as any)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                          >
                            <option value="nikah">Nikah &amp; Rujuk</option>
                            <option value="wakaf">Zakat &amp; Wakaf</option>
                            <option value="kemasjidan">Kemasjidan / SIMAS</option>
                            <option value="konsultasi">Bimbingan &amp; BP4</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Deskripsi Layanan &amp; Ketentuan
                        </label>
                        <textarea
                          rows={2}
                          value={newServiceDesc}
                          onChange={(e) => setNewServiceDesc(e.target.value)}
                          placeholder="Penjelasan ringkas mengenai alur atau manfaat layanan..."
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingService(false)}
                          className="px-3 py-1.5 border border-slate-300 bg-white text-slate-700 rounded-lg text-xs"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleAddService}
                          className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          Simpan Layanan
                        </button>
                      </div>
                    </div>
                  )}

                  {/* List of Services */}
                  <div className="space-y-2.5">
                    {(formData.services || []).map((srv, idx) => (
                      <div
                        key={srv.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 group"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{srv.title}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono uppercase">
                              {srv.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            {srv.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(srv.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer shrink-0"
                          title="Hapus Layanan Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: KONTAK & JAM LAYANAN */}
              {activeTab === 'jam_kontak' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                    <h5 className="font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      <span>Jadwal Jam Pelayanan KUA</span>
                    </h5>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Senin – Kamis
                        </label>
                        <input
                          type="text"
                          value={formData.serviceHours.mondayThursday}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              serviceHours: { ...formData.serviceHours, mondayThursday: e.target.value },
                            })
                          }
                          required
                          className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Jum'at
                        </label>
                        <input
                          type="text"
                          value={formData.serviceHours.friday}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              serviceHours: { ...formData.serviceHours, friday: e.target.value },
                            })
                          }
                          required
                          className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Sabtu – Minggu / Hari Libur
                        </label>
                        <input
                          type="text"
                          value={formData.serviceHours.weekend}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              serviceHours: { ...formData.serviceHours, weekend: e.target.value },
                            })
                          }
                          required
                          className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                    <h5 className="font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span>Alamat Fisik &amp; Kontak Resmi</span>
                    </h5>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Alamat Kantor
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          required
                          className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Surel / Email Resmi
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Nomor Telepon Kantor
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Mode Footer Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {!isConfirmingReset ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(true)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Standar Awal</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-rose-700 font-semibold">Kembalikan ke data awal?</span>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold cursor-pointer"
                  >
                    Ya, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingReset(false)}
                    className="px-2 py-1 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-[11px] cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveSuccess}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Tersimpan!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Profil</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* View Mode Footer */}
        {!isEditing && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>
                {isKepalaKua
                  ? 'Anda sedang mengakses dengan Akun Kepala KUA (Otoritas Penuh).'
                  : 'Masuk dengan Akun Kepala KUA untuk hak penambahan & penghapusan penuh.'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isKepalaKua ? 'Kelola Isi Profil' : 'Edit Profil'}</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
