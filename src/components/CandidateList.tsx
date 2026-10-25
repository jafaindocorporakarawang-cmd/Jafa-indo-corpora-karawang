import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Building, 
  Calendar,
  FileCheck2,
  Clock,
  Eye,
  Filter
} from 'lucide-react';
import { Candidate, DocumentStatus, Sponsor, DivisiNegara } from '../types/dashboard';

interface CandidateListProps {
  candidates: Candidate[];
  sponsors: Sponsor[];
  onOpenAddModal: () => void;
  onDeleteCandidate: (id: string) => void;
  onUpdateCandidate: (id: string, updates: Partial<Candidate>) => void;
  onScheduleToBlk?: (candidateId: string) => void;
}

export const getCountryFlag = (negara: DivisiNegara) => {
  switch (negara) {
    case 'Malaysia':
      return '🇲🇾';
    case 'Singapura':
      return '🇸🇬';
    case 'Hongkong':
      return '🇭🇰';
    case 'Taiwan':
      return '🇹🇼';
    default:
      return '🌐';
  }
};

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  sponsors,
  onOpenAddModal,
  onDeleteCandidate,
  onUpdateCandidate,
  onScheduleToBlk,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSponsorFilter, setSelectedSponsorFilter] = useState('All');
  const [selectedNegaraFilter, setSelectedNegaraFilter] = useState<'All' | DivisiNegara>('All');
  const [selectedBlkFilter, setSelectedBlkFilter] = useState<'All' | Candidate['statusBlk']>('All');
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);

  const filteredCandidates = candidates.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      c.nama.toLowerCase().includes(q) ||
      c.tempatLahir.toLowerCase().includes(q) ||
      c.namaSponsor.toLowerCase().includes(q) ||
      c.alamatKtp.toLowerCase().includes(q) ||
      (c.divisiNegara && c.divisiNegara.toLowerCase().includes(q));

    const matchSponsor = selectedSponsorFilter === 'All' || c.namaSponsor === selectedSponsorFilter;
    const matchNegara = selectedNegaraFilter === 'All' || c.divisiNegara === selectedNegaraFilter;
    const matchBlk = selectedBlkFilter === 'All' || c.statusBlk === selectedBlkFilter;
    return matchSearch && matchSponsor && matchNegara && matchBlk;
  });

  const getDocBadge = (hasDoc: boolean, label: string) => {
    return hasDoc ? (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200" title={`${label}: Lengkap`}>
        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
        <span>{label}</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-normal bg-slate-100 text-slate-400 border border-slate-200" title={`${label}: Belum Ada`}>
        <XCircle className="w-2.5 h-2.5 text-slate-400" />
        <span>{label}</span>
      </span>
    );
  };

  const countBelumBlk = candidates.filter((c) => c.statusBlk === 'Belum Masuk BLK').length;
  const countSudahBlk = candidates.filter((c) => c.statusBlk === 'Sudah Masuk BLK').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Data Anak Baru Masuk (Registrasi Kantor)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data lengkap pendaftaran anak baru masuk PT Jafa Indo Corpora: biodata KTP, divisi negara tujuan, sponsor perekrut, dan verifikasi 8 berkas dokumen wajib.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Data Anak Baru</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status BLK filter buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedBlkFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedBlkFilter === 'All'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Anak Baru ({candidates.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBlkFilter('Belum Masuk BLK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedBlkFilter === 'Belum Masuk BLK'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Belum Masuk BLK ({countBelumBlk})
            </button>
            <button
              type="button"
              onClick={() => setSelectedBlkFilter('Sudah Masuk BLK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedBlkFilter === 'Sudah Masuk BLK'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Sudah Masuk BLK ({countSudahBlk})
            </button>
          </div>

          {/* Search bar & dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Divisi Negara Filter */}
            <div className="relative">
              <select
                value={selectedNegaraFilter}
                onChange={(e) => setSelectedNegaraFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-slate-800"
              >
                <option value="All">🌍 Semua Negara</option>
                <option value="Malaysia">🇲🇾 Malaysia</option>
                <option value="Singapura">🇸🇬 Singapura</option>
                <option value="Hongkong">🇭🇰 Hongkong</option>
                <option value="Taiwan">🇹🇼 Taiwan</option>
              </select>
            </div>

            {/* Sponsor Filter */}
            <div className="relative">
              <select
                value={selectedSponsorFilter}
                onChange={(e) => setSelectedSponsorFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 max-w-[150px]"
              >
                <option value="All">Semua Sponsor</option>
                {sponsors.map((sp) => (
                  <option key={sp.id} value={sp.namaSponsor}>
                    {sp.namaSponsor}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, tempat lahir..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-36 sm:w-44"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table of Candidates */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & TTL</th>
                <th className="py-3 px-3">Divisi Negara</th>
                <th className="py-3 px-3">Kontak & Alamat KTP</th>
                <th className="py-3 px-3">Pendidikan</th>
                <th className="py-3 px-3">Nama Sponsor</th>
                <th className="py-3 px-3">Tanggal Masuk</th>
                <th className="py-3 px-3">Status BLK</th>
                <th className="py-3 px-3">Status 8 Berkas Dokumen</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((c) => {
                const docCount = Object.values(c.dokumen).filter(Boolean).length;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="text-sm font-bold text-slate-900">{c.nama}</div>
                      <div className="text-[11px] font-normal text-slate-500 font-mono">
                        {c.tempatLahir}, {c.tanggalLahir}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-bold text-[11px] bg-blue-50 text-blue-900 border border-blue-200">
                        <span>{getCountryFlag(c.divisiNegara)}</span>
                        <span>{c.divisiNegara}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 max-w-[200px]">
                      <div className="font-mono text-xs font-medium text-slate-900">{c.noTelp}</div>
                      <div className="text-[11px] text-slate-500 truncate" title={c.alamatKtp}>
                        {c.alamatKtp}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-[11px]">
                        <GraduationCap className="w-3 h-3 text-slate-500" />
                        {c.pendidikanTerakhir}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-blue-900">
                      {c.namaSponsor}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-700 font-semibold">
                      <div>{c.tanggalMasuk}</div>
                      <span className="text-[10px] text-slate-400 font-normal">Masuk Kantor</span>
                    </td>

                    <td className="py-3.5 px-3">
                      {c.statusBlk === 'Sudah Masuk BLK' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Sudah Masuk BLK
                          </span>
                          {c.tanggalMasukBlk && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Tgl: {c.tanggalMasukBlk}
                            </div>
                          )}
                        </div>
                      ) : c.statusBlk === 'Dijadwalkan BLK' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                            <Clock className="w-2.5 h-2.5 text-amber-600" /> Dijadwalkan BLK
                          </span>
                          {c.tanggalMasukBlk && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Tgl: {c.tanggalMasukBlk}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                          Belum Masuk BLK
                        </span>
                      )}
                    </td>

                    {/* Dokumen Badges (KTP, KK, Akta, Ijazah, Buku Nikah, Paspor, BPJS, Surat Ijin) */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {getDocBadge(c.dokumen.ktp, 'KTP')}
                        {getDocBadge(c.dokumen.kk, 'KK')}
                        {getDocBadge(c.dokumen.aktaKelahiran, 'Akta')}
                        {getDocBadge(c.dokumen.ijazah, 'Ijazah')}
                        {getDocBadge(c.dokumen.bukuNikah, 'Nikah')}
                        {getDocBadge(c.dokumen.paspor, 'Paspor')}
                        {getDocBadge(c.dokumen.bpjs, 'BPJS')}
                        {getDocBadge(c.dokumen.suratIjin, 'Izin')}
                      </div>
                      <div className="mt-1 text-[10px] text-slate-400 font-medium">
                        Total berkas lengkap: {docCount}/8
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onScheduleToBlk && (
                          <button
                            type="button"
                            onClick={() => onScheduleToBlk(c.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                            title="Jadwalkan atau perbarui tanggal masuk BLK untuk anak ini"
                          >
                            <Building className="w-3 h-3" />
                            <span>Jadwal BLK</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setViewingCandidate(c)}
                          className="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                          title="Lihat Detail Profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus data anak "${c.nama}"?`)) {
                              onDeleteCandidate(c.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    Belum ada data anak yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Profil Anak */}
      {viewingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">
                Rincian Data Calon Siswa: {viewingCandidate.nama}
              </h3>
              <button
                type="button"
                onClick={() => setViewingCandidate(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                Tutup
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block">Nama Lengkap:</span>
                  <span className="font-bold text-slate-900">{viewingCandidate.nama}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Divisi Negara Tujuan:</span>
                  <span className="font-bold text-blue-900 flex items-center gap-1.5 mt-0.5">
                    <span>{getCountryFlag(viewingCandidate.divisiNegara)}</span>
                    <span>{viewingCandidate.divisiNegara}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tempat, Tanggal Lahir:</span>
                  <span className="font-medium text-slate-800">{viewingCandidate.tempatLahir}, {viewingCandidate.tanggalLahir}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">No. Telepon / WA:</span>
                  <span className="font-mono text-slate-800">{viewingCandidate.noTelp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pendidikan Terakhir:</span>
                  <span className="font-medium text-slate-800">{viewingCandidate.pendidikanTerakhir}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Nama Sponsor:</span>
                  <span className="font-bold text-blue-900">{viewingCandidate.namaSponsor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tanggal Anak Masuk:</span>
                  <span className="font-mono text-slate-800">{viewingCandidate.tanggalMasuk}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status Pelatihan BLK:</span>
                  <span className="font-bold text-slate-900">{viewingCandidate.statusBlk}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tanggal Masuk BLK:</span>
                  <span className="font-mono text-slate-800">{viewingCandidate.tanggalMasukBlk || 'Belum masuk'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Alamat Sesuai KTP:</span>
                <p className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                  {viewingCandidate.alamatKtp}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1.5">Status 8 Berkas Dokumen Fisik:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-2 rounded border flex items-center justify-between ${viewingCandidate.dokumen.ktp ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <span>1. KTP Asli</span>
                    <span>{viewingCandidate.dokumen.ktp ? 'Lengkap' : 'Belum'}</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center justify-between ${viewingCandidate.dokumen.kk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <span>2. Kartu Keluarga (KK)</span>
                    <span>{viewingCandidate.dokumen.kk ? 'Lengkap' : 'Belum'}</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center justify-between ${viewingCandidate.dokumen.aktaKelahiran ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <span>3. Akta Kelahiran</span>
                    <span>{viewingCandidate.dokumen.aktaKelahiran ? 'Lengkap' : 'Belum'}</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center justify-between ${viewingCandidate.dokumen.ijazah ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <span>4. Ijazah Terakhir</span>
                    <span>{viewingCandidate.dokumen.ijazah ? 'Lengkap' : 'Belum'}</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center justify-between ${viewingCandidate.dokumen.bukuNikah ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <span>5. Buku Nikah / Lajang</span>
                    <span>{viewingCandidate.dokumen.bukuNikah ? 'Lengkap' : 'Belum'}</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center justify-between ${viewingCandidate.dokumen.paspor ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <span>6. Paspor (Paposr)</span>
                    <span>{viewingCandidate.dokumen.paspor ? 'Lengkap' : 'Belum'}</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center justify-between ${viewingCandidate.dokumen.bpjs ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <span>7. Kartu BPJS</span>
                    <span>{viewingCandidate.dokumen.bpjs ? 'Lengkap' : 'Belum'}</span>
                  </div>
                  <div className={`p-2 rounded border flex items-center justify-between ${viewingCandidate.dokumen.suratIjin ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <span>8. Surat Izin Wali/Ortu</span>
                    <span>{viewingCandidate.dokumen.suratIjin ? 'Lengkap' : 'Belum'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
