import React, { useState } from 'react';
import { 
  Building, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Filter,
  UserCheck,
  FileCheck2
} from 'lucide-react';
import { Candidate } from '../types/dashboard';

interface BlkManagerProps {
  candidates: Candidate[];
  onUpdateBlk: (candidateId: string, statusBlk: Candidate['statusBlk'], tanggalMasukBlk: string) => void;
  initialCandidateId?: string | null;
  onOpenCandidateDetail?: (candidate: Candidate) => void;
}

export const BlkManager: React.FC<BlkManagerProps> = ({
  candidates,
  onUpdateBlk,
  initialCandidateId,
  onOpenCandidateDetail,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(initialCandidateId || '');
  const [tanggalMasukBlk, setTanggalMasukBlk] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusBlk, setStatusBlk] = useState<Candidate['statusBlk']>('Sudah Masuk BLK');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Candidate['statusBlk']>('All');
  const [successToast, setSuccessToast] = useState('');

  // Sync when initialCandidateId prop changes from CandidateList "Jadwalkan ke BLK" action
  React.useEffect(() => {
    if (initialCandidateId) {
      setSelectedCandidateId(initialCandidateId);
      const cand = candidates.find((c) => c.id === initialCandidateId);
      if (cand?.tanggalMasukBlk) {
        setTanggalMasukBlk(cand.tanggalMasukBlk);
      }
      if (cand?.statusBlk) {
        setStatusBlk(cand.statusBlk);
      }
    }
  }, [initialCandidateId, candidates]);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);

  const handleAssignBlk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) {
      alert('Silakan pilih nama anak dari Data Anak Baru Masuk terlebih dahulu.');
      return;
    }
    if (!tanggalMasukBlk) {
      alert('Silakan isi tanggal masuk BLK.');
      return;
    }

    onUpdateBlk(selectedCandidateId, statusBlk, tanggalMasukBlk);
    setSuccessToast(`Jadwal masuk BLK untuk ${selectedCandidate?.nama} berhasil diperbarui.`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleQuickStatusChange = (candidate: Candidate, newStatus: Candidate['statusBlk']) => {
    const dateToUse = candidate.tanggalMasukBlk || new Date().toISOString().split('T')[0];
    onUpdateBlk(candidate.id, newStatus, dateToUse);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchSearch =
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.namaSponsor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tempatLahir.toLowerCase().includes(searchQuery.toLowerCase());

    const matchFilter = statusFilter === 'All' || c.statusBlk === statusFilter;
    return matchSearch && matchFilter;
  });

  const countSudahBlk = candidates.filter((c) => c.statusBlk === 'Sudah Masuk BLK').length;
  const countDijadwalkan = candidates.filter((c) => c.statusBlk === 'Dijadwalkan BLK').length;
  const countBelumBlk = candidates.filter((c) => c.statusBlk === 'Belum Masuk BLK').length;

  return (
    <div className="space-y-6">
      {/* 3 Micro KPI Stat Cards for BLK Department */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Sudah Masuk BLK
            </span>
            <span className="text-[11px] text-slate-500">Aktif pelatihan & asrama</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            {countSudahBlk} <span className="text-xs font-normal text-slate-500">Siswa</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Dijadwalkan Masuk BLK
            </span>
            <span className="text-[11px] text-slate-500">Menunggu tgl keberangkatan</span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-700">
            {countDijadwalkan} <span className="text-xs font-normal text-slate-500">Siswa</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Belum Masuk BLK
            </span>
            <span className="text-[11px] text-slate-500">Antrean anak baru masuk kantor</span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-700">
            {countBelumBlk} <span className="text-xs font-normal text-slate-500">Anak</span>
          </div>
        </div>
      </div>

      {/* Top Banner / Form to assign BLK date */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
                <Building className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Menu Data Anak Masuk BLK (Balai Latihan Kerja)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ambil nama dari <strong>Data Anak Baru Masuk</strong> untuk menetapkan tanggal masuk asrama & status pelatihan BLK.
            </p>
          </div>

          {successToast && (
            <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
          )}
        </div>

        {/* Form Pilih Data Anak Terinput + Input Tanggal Masuk BLK */}
        <form onSubmit={handleAssignBlk} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Step 1: Select Candidate from Data Anak Baru Masuk */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Ambil dari Data Anak Baru Masuk <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCandidateId}
                onChange={(e) => {
                  setSelectedCandidateId(e.target.value);
                  const cand = candidates.find((c) => c.id === e.target.value);
                  if (cand?.tanggalMasukBlk) {
                    setTanggalMasukBlk(cand.tanggalMasukBlk);
                  }
                  if (cand?.statusBlk) {
                    setStatusBlk(cand.statusBlk);
                  }
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              >
                <option value="">-- Klik untuk memilih anak baru masuk --</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama} [{c.divisiNegara}] — Masuk Kantor: {c.tanggalMasuk} (Status BLK: {c.statusBlk})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Tanggal Masuk BLK */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Tanggal Masuk BLK <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={tanggalMasukBlk}
                  onChange={(e) => setTanggalMasukBlk(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* Step 3: Status BLK */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Status Pelatihan BLK <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={statusBlk}
                  onChange={(e) => setStatusBlk(e.target.value as any)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="Belum Masuk BLK">Belum Masuk BLK</option>
                  <option value="Dijadwalkan BLK">Dijadwalkan BLK</option>
                  <option value="Sudah Masuk BLK">Sudah Masuk BLK</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Simpan Jadwal BLK
                </button>
              </div>
            </div>

          </div>

          {/* Context box showing selected candidate preview */}
          {selectedCandidate && (
            <div className="p-3 bg-white border border-blue-200 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Nama Terpilih:</span>
                <span className="font-bold text-slate-900">{selectedCandidate.nama}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Sponsor Perekrut:</span>
                <span className="font-medium text-slate-800">{selectedCandidate.namaSponsor}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tgl Masuk Anak:</span>
                <span className="font-mono text-slate-800">{selectedCandidate.tanggalMasuk}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Asal Daerah:</span>
                <span className="text-slate-800">{selectedCandidate.tempatLahir}</span>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Table: Data Anak Masuk & Tanggal Masuk BLK List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3">
        {/* Table Filters Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Daftar Anak Masuk & Status BLK</h3>
            <span className="text-xs text-slate-500">({filteredCandidates.length} data)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter buttons */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('All')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  statusFilter === 'All' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Sudah Masuk BLK')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  statusFilter === 'Sudah Masuk BLK' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sudah Masuk BLK
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Dijadwalkan BLK')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  statusFilter === 'Dijadwalkan BLK' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dijadwalkan
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Belum Masuk BLK')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  statusFilter === 'Belum Masuk BLK' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Belum Masuk
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama / sponsor..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-44"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Anak (Siswa BLK)</th>
                <th className="py-3 px-3">Nama Sponsor</th>
                <th className="py-3 px-3">Tgl Baru Masuk Kantor</th>
                <th className="py-3 px-3">Tanggal Masuk BLK</th>
                <th className="py-3 px-3">Status Pelatihan BLK</th>
                <th className="py-3 px-3">Kelengkapan Dokumen</th>
                <th className="py-3 px-4 text-right">Aksi Status BLK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((c) => {
                const docCount = Object.values(c.dokumen).filter(Boolean).length;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{c.nama}</span>
                        {c.divisiNegara && (
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-sans">
                            {c.divisiNegara === 'Malaysia' ? '🇲🇾' : c.divisiNegara === 'Singapura' ? '🇸🇬' : c.divisiNegara === 'Hongkong' ? '🇭🇰' : '🇹🇼'} {c.divisiNegara}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-normal text-slate-500 font-mono">
                        {c.tempatLahir}, {c.tanggalLahir}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {c.namaSponsor}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-700">
                      <div>{c.tanggalMasuk}</div>
                      <span className="text-[10px] text-slate-400">Masuk Kantor</span>
                    </td>

                    <td className="py-3.5 px-3">
                      {c.tanggalMasukBlk ? (
                        <div>
                          <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                            {c.tanggalMasukBlk}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Jadwal Masuk BLK</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum Dijadwalkan</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {c.statusBlk === 'Sudah Masuk BLK' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sudah Masuk BLK
                        </span>
                      ) : c.statusBlk === 'Dijadwalkan BLK' ? (
                        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600" /> Dijadwalkan BLK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                          Belum Masuk BLK
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              docCount >= 7 ? 'bg-emerald-600' : docCount >= 4 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${(docCount / 8) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-700">
                          {docCount}/8
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCandidateId(c.id);
                            if (c.tanggalMasukBlk) setTanggalMasukBlk(c.tanggalMasukBlk);
                            if (c.statusBlk) setStatusBlk(c.statusBlk);
                            window.scrollTo({ top: 350, behavior: 'smooth' });
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer whitespace-nowrap"
                          title="Pilih anak ini di form atas untuk update tanggal/status BLK"
                        >
                          Ubah Jadwal
                        </button>
                        {c.statusBlk !== 'Sudah Masuk BLK' ? (
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(c, 'Sudah Masuk BLK')}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                            title="Tandai Sudah Masuk Asrama BLK Hari Ini"
                          >
                            ✓ Masuk BLK
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(c, 'Dijadwalkan BLK')}
                            className="px-2 py-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition-colors cursor-pointer whitespace-nowrap"
                            title="Kembalikan status ke Dijadwalkan"
                          >
                            Jadwalkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Tidak ada data anak masuk yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
