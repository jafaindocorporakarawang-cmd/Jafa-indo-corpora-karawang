import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  Trash2, 
  CheckCircle2, 
  FileText,
  UserCheck
} from 'lucide-react';
import { Sponsor, Candidate } from '../types/dashboard';

interface SponsorManagerProps {
  sponsors: Sponsor[];
  candidates: Candidate[];
  onAddSponsor: (data: Omit<Sponsor, 'id' | 'createdAt'>) => void;
  onDeleteSponsor: (id: string) => void;
  onSelectSponsorFilter?: (namaSponsor: string) => void;
}

export const SponsorManager: React.FC<SponsorManagerProps> = ({
  sponsors,
  candidates,
  onAddSponsor,
  onDeleteSponsor,
  onSelectSponsorFilter,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [namaSponsor, setNamaSponsor] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [error, setError] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSponsor.trim()) {
      setError('Nama sponsor wajib diisi.');
      return;
    }
    if (!alamat.trim()) {
      setError('Alamat sponsor wajib diisi.');
      return;
    }
    if (!noTelp.trim()) {
      setError('Nomor telepon sponsor wajib diisi.');
      return;
    }

    onAddSponsor({
      namaSponsor: namaSponsor.trim(),
      alamat: alamat.trim(),
      noTelp: noTelp.trim(),
      keterangan: keterangan.trim() || undefined,
    });

    setNamaSponsor('');
    setAlamat('');
    setNoTelp('');
    setKeterangan('');
    setError('');
    setShowAddForm(false);
  };

  const filteredSponsors = sponsors.filter((sp) => {
    const q = searchQuery.toLowerCase();
    return (
      sp.namaSponsor.toLowerCase().includes(q) ||
      sp.alamat.toLowerCase().includes(q) ||
      sp.noTelp.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Manajemen Nama Sponsor</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data mitra sponsor perekrut anak, alamat wilayah, dan kontak telepon aktif.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sponsor / alamat..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-48 sm:w-60"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Tutup Formulir' : 'Tambah Sponsor Baru'}</span>
          </button>
        </div>
      </div>

      {/* Form Tambah Sponsor Baru */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Formulir Pendaftaran Sponsor Baru</h3>
            <span className="text-xs text-slate-400">Data akan langsung tersambung ke menu data anak & fee</span>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Lengkap Sponsor <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={namaSponsor}
                onChange={(e) => setNamaSponsor(e.target.value)}
                placeholder="Contoh: H. Suhendar (Karawang Timur)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
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
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Keterangan / Wilayah Perekrutan
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Area Purwakarta & Cikampek"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Alamat Lengkap Sponsor <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-2.5 pointer-events-none text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <textarea
                rows={2}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Jalan, No Rumah, Desa/Kelurahan, Kecamatan, Kabupaten/Kota"
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Sponsor</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid of Sponsors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSponsors.map((sp) => {
          const sponsoredCandidates = candidates.filter(
            (c) => c.namaSponsor === sp.namaSponsor || c.sponsorId === sp.id
          );
          const sudahBlkCount = sponsoredCandidates.filter((c) => c.statusBlk === 'Sudah Masuk BLK').length;

          return (
            <div
              key={sp.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {sp.namaSponsor}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus data sponsor "${sp.namaSponsor}"?`)) {
                        onDeleteSponsor(sp.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Hapus Sponsor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{sp.alamat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{sp.noTelp}</span>
                  </div>
                  {sp.keterangan && (
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{sp.keterangan}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sponsor Stats Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{sponsoredCandidates.length} Anak Dibina</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {sudahBlkCount} Sudah BLK
                </span>
              </div>
            </div>
          );
        })}

        {filteredSponsors.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">Tidak Ada Sponsor Ditemukan</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik &quot;Tambah Sponsor Baru&quot; untuk mendaftarkan nama sponsor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
