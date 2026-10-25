import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Calendar, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Users, 
  FileText 
} from 'lucide-react';
import { Candidate, DocumentStatus, Sponsor, DivisiNegara } from '../types/dashboard';

interface CandidateInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidateData: Omit<Candidate, 'id' | 'createdAt'>) => void;
  sponsors: Sponsor[];
  onQuickAddSponsor: (nama: string, alamat: string, telp: string) => Sponsor;
}

const DIVISI_NEGARA_OPTIONS: { id: DivisiNegara; label: string; flag: string; sektor: string }[] = [
  { id: 'Malaysia', label: 'Malaysia', flag: '🇲🇾', sektor: 'Manufaktur & Perkebunan' },
  { id: 'Singapura', label: 'Singapura', flag: '🇸🇬', sektor: 'Hospitality & Caregiver' },
  { id: 'Hongkong', label: 'Hongkong', flag: '🇭🇰', sektor: 'Layanan Rumah Tangga & Lansia' },
  { id: 'Taiwan', label: 'Taiwan', flag: '🇹🇼', sektor: 'Pabrik Formal & Panti Jompo' },
];

const DOCUMENT_ITEMS: { key: keyof DocumentStatus; label: string; desc: string }[] = [
  { key: 'ktp', label: 'KTP Asli', desc: 'Kartu Tanda Penduduk Republik Indonesia' },
  { key: 'kk', label: 'Kartu Keluarga (KK)', desc: 'Kartu Keluarga barcode/legalisir' },
  { key: 'aktaKelahiran', label: 'Akta Kelahiran', desc: 'Akta Kelahiran catatan sipil' },
  { key: 'ijazah', label: 'Ijazah Terakhir', desc: 'Ijazah asli pendidikan terakhir' },
  { key: 'bukuNikah', label: 'Buku Nikah', desc: 'Buku Nikah / Surat Keterangan Lajang' },
  { key: 'paspor', label: 'Paspor (Paposr)', desc: 'Buku Paspor 48 hal. jika sudah ada' },
  { key: 'bpjs', label: 'BPJS / KIS', desc: 'Kartu BPJS Ketenagakerjaan / Kesehatan' },
  { key: 'suratIjin', label: 'Surat Izin', desc: 'Surat Izin Orang Tua / Suami / Wali bermeterai' },
];

export const CandidateInputModal: React.FC<CandidateInputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sponsors,
  onQuickAddSponsor,
}) => {
  const [nama, setNama] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [alamatKtp, setAlamatKtp] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState<Candidate['pendidikanTerakhir']>('SMA/SMK');
  const [divisiNegara, setDivisiNegara] = useState<DivisiNegara>('Malaysia');
  const [namaSponsor, setNamaSponsor] = useState(sponsors[0]?.namaSponsor || '');
  const [tanggalMasuk, setTanggalMasuk] = useState(new Date().toISOString().split('T')[0]);
  const [statusBlk, setStatusBlk] = useState<Candidate['statusBlk']>('Belum Masuk BLK');
  const [tanggalMasukBlk, setTanggalMasukBlk] = useState('');
  const [catatan, setCatatan] = useState('');

  // Checkbox state for all 8 mandatory documents
  const [dokumen, setDokumen] = useState<DocumentStatus>({
    ktp: false,
    kk: false,
    aktaKelahiran: false,
    ijazah: false,
    bukuNikah: false,
    paspor: false,
    bpjs: false,
    suratIjin: false,
  });

  // Modal for quick adding new sponsor inline if needed
  const [isAddingSponsorInline, setIsAddingSponsorInline] = useState(false);
  const [newSponsorNama, setNewSponsorNama] = useState('');
  const [newSponsorAlamat, setNewSponsorAlamat] = useState('');
  const [newSponsorTelp, setNewSponsorTelp] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleToggleDoc = (key: keyof DocumentStatus) => {
    setDokumen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedDocsCount = Object.values(dokumen).filter(Boolean).length;

  const handleCreateSponsorInline = () => {
    if (!newSponsorNama.trim()) {
      alert('Nama sponsor wajib diisi');
      return;
    }
    const created = onQuickAddSponsor(newSponsorNama.trim(), newSponsorAlamat.trim(), newSponsorTelp.trim());
    setNamaSponsor(created.namaSponsor);
    setIsAddingSponsorInline(false);
    setNewSponsorNama('');
    setNewSponsorAlamat('');
    setNewSponsorTelp('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!nama.trim()) errs.nama = 'Nama anak wajib diisi';
    if (!tempatLahir.trim()) errs.tempatLahir = 'Tempat lahir wajib diisi';
    if (!tanggalLahir) errs.tanggalLahir = 'Tanggal lahir wajib diisi';
    if (!alamatKtp.trim()) errs.alamatKtp = 'Alamat sesuai KTP wajib diisi';
    if (!noTelp.trim()) errs.noTelp = 'Nomor telepon wajib diisi';
    if (!namaSponsor.trim()) errs.namaSponsor = 'Pilih atau masukkan nama sponsor';
    if (!tanggalMasuk) errs.tanggalMasuk = 'Tanggal masuk wajib diisi';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const matchedSponsor = sponsors.find((s) => s.namaSponsor === namaSponsor);

    onSave({
      nama: nama.trim(),
      tempatLahir: tempatLahir.trim(),
      tanggalLahir,
      alamatKtp: alamatKtp.trim(),
      noTelp: noTelp.trim(),
      pendidikanTerakhir,
      divisiNegara,
      namaSponsor: namaSponsor.trim(),
      sponsorId: matchedSponsor?.id,
      tanggalMasuk,
      dokumen,
      statusBlk,
      tanggalMasukBlk: tanggalMasukBlk || undefined,
      catatan: catatan.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Formulir Input Data Anak Baru Masuk
              </h2>
              <p className="text-xs text-slate-500">
                Pencatatan identitas calon anak baru, divisi negara, sponsor perekrut, tanggal masuk kantor, dan verifikasi 8 berkas dokumen
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Identitas Pribadi */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                1. Data Identitas Pribadi Sesuai KTP
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap Anak <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Siti Nurhaliza"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
                {errors.nama && <p className="text-[11px] text-rose-600 mt-0.5">{errors.nama}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="tel"
                    value={noTelp}
                    onChange={(e) => setNoTelp(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
                {errors.noTelp && <p className="text-[11px] text-rose-600 mt-0.5">{errors.noTelp}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tempat Lahir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempatLahir}
                  onChange={(e) => setTempatLahir(e.target.value)}
                  placeholder="Contoh: Karawang"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
                {errors.tempatLahir && <p className="text-[11px] text-rose-600 mt-0.5">{errors.tempatLahir}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tanggal Lahir <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
                {errors.tanggalLahir && <p className="text-[11px] text-rose-600 mt-0.5">{errors.tanggalLahir}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pendidikan Terakhir <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={pendidikanTerakhir}
                    onChange={(e) => setPendidikanTerakhir(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="SD">SD / Sederajat</option>
                    <option value="SMP">SMP / Sederajat</option>
                    <option value="SMA/SMK">SMA / SMK / MA</option>
                    <option value="Diploma">Diploma (D1-D4)</option>
                    <option value="S1/Sederajat">Sarjana (S1)</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alamat Lengkap Sesuai KTP <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-2.5 left-2.5 pointer-events-none text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <textarea
                  rows={2}
                  value={alamatKtp}
                  onChange={(e) => setAlamatKtp(e.target.value)}
                  placeholder="Dusun/Kampung, RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten/Kota"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>
              {errors.alamatKtp && <p className="text-[11px] text-rose-600 mt-0.5">{errors.alamatKtp}</p>}
            </div>
          </div>

          {/* Section 2: Pilihan Divisi Negara Tujuan Penempatan */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                2. Divisi Negara Tujuan Penempatan <span className="text-rose-500">*</span>
              </span>
              <span className="text-xs font-semibold text-blue-700">
                Pilihan: Malaysia, Singapura, Hongkong, Taiwan
              </span>
            </div>

            {/* 4 Interactive Country Selection Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DIVISI_NEGARA_OPTIONS.map((opt) => {
                const isSelected = divisiNegara === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDivisiNegara(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/90 text-blue-950 ring-2 ring-blue-600/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-lg leading-none">{opt.flag}</span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <div>
                      <span className={`text-xs font-bold block ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                        {opt.sektor}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Select fallback */}
            <div className="relative">
              <select
                value={divisiNegara}
                onChange={(e) => setDivisiNegara(e.target.value as DivisiNegara)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium text-slate-800"
              >
                <option value="Malaysia">🇲🇾 Divisi Malaysia</option>
                <option value="Singapura">🇸🇬 Divisi Singapura</option>
                <option value="Hongkong">🇭🇰 Divisi Hongkong</option>
                <option value="Taiwan">🇹🇼 Divisi Taiwan</option>
              </select>
            </div>
          </div>

          {/* Section 3: Sponsor & Tanggal Masuk */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                3. Data Sponsor Perekrut & Tanggal Masuk
              </span>
              <button
                type="button"
                onClick={() => setIsAddingSponsorInline(!isAddingSponsorInline)}
                className="text-[11px] text-blue-700 hover:underline font-semibold"
              >
                {isAddingSponsorInline ? 'Tutup Tambah Sponsor' : '+ Tambah Sponsor Baru Cepat'}
              </button>
            </div>

            {isAddingSponsorInline && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                <p className="font-semibold text-blue-900">Tambah Data Sponsor Baru</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newSponsorNama}
                    onChange={(e) => setNewSponsorNama(e.target.value)}
                    placeholder="Nama Sponsor Baru"
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newSponsorAlamat}
                    onChange={(e) => setNewSponsorAlamat(e.target.value)}
                    placeholder="Alamat / Wilayah Sponsor"
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newSponsorTelp}
                    onChange={(e) => setNewSponsorTelp(e.target.value)}
                    placeholder="No. Telpon Sponsor"
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingSponsorInline(false)}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSponsorInline}
                    className="px-3 py-1 bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    Simpan & Pilih Sponsor
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Sponsor <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={namaSponsor}
                    onChange={(e) => setNamaSponsor(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  >
                    <option value="">-- Pilih Sponsor Terdaftar --</option>
                    {sponsors.map((sp) => (
                      <option key={sp.id} value={sp.namaSponsor}>
                        {sp.namaSponsor} ({sp.noTelp})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.namaSponsor && <p className="text-[11px] text-rose-600 mt-0.5">{errors.namaSponsor}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tanggal Anak Baru Masuk <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={tanggalMasuk}
                    onChange={(e) => setTanggalMasuk(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Tanggal pendaftaran awal di kantor PT</span>
                {errors.tanggalMasuk && <p className="text-[11px] text-rose-600 mt-0.5">{errors.tanggalMasuk}</p>}
              </div>
            </div>

            {/* Optional BLK Status Setup during candidate registration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Status Masuk BLK (Pelatihan Asrama)
                </label>
                <select
                  value={statusBlk}
                  onChange={(e) => setStatusBlk(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Belum Masuk BLK">Belum Masuk BLK (Default)</option>
                  <option value="Dijadwalkan BLK">Dijadwalkan BLK</option>
                  <option value="Sudah Masuk BLK">Sudah Masuk BLK</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tanggal Masuk BLK (Opsional)
                </label>
                <input
                  type="date"
                  value={tanggalMasukBlk}
                  onChange={(e) => setTanggalMasukBlk(e.target.value)}
                  placeholder="Bisa diatur nanti di Menu Data Anak Masuk BLK"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Bisa ditentukan nanti di Menu Data Anak Masuk BLK</span>
              </div>
            </div>
          </div>

          {/* Section 4: Dokumen Anak Checklist (8 Berkas Lengkap) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                4. Dokumen Anak yang Melingkupi (8 Berkas Wajib)
              </span>
              <span className="text-xs font-semibold text-blue-700">
                Kelengkapan: {completedDocsCount}/8 Berkas
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Centang dokumen fisik asli / legalisir yang sudah diserahkan oleh calon siswa kepada pihak MyJafa:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DOCUMENT_ITEMS.map((item) => {
                const checked = dokumen[item.key];
                return (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                      checked
                        ? 'border-blue-600 bg-blue-50/60 text-blue-950'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleDoc(item.key)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-semibold block">{item.label}</span>
                      <span className="text-[10px] text-slate-500 leading-tight">{item.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 4: Catatan Tambahan */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Catatan Khusus / Riwayat Medical (Opsional)
            </label>
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Sudah medical pra-fit, siap asrama kelas Jepang/Korea"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Data Anak</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
