import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  DollarSign, 
  Calendar,
  AlertCircle,
  Edit,
  PauseCircle,
  FileText,
  Save,
  X,
  Check
} from 'lucide-react';
import { FeeLoan, Candidate, Sponsor, StatusKeuangan } from '../types/dashboard';
import { formatRupiah } from '../utils/dashboardStorage';

interface FeeLoanManagerProps {
  feeLoans: FeeLoan[];
  candidates: Candidate[];
  sponsors: Sponsor[];
  onSaveFeeLoan: (data: Omit<FeeLoan, 'id' | 'createdAt'>) => void;
  onUpdateFeeLoan: (id: string, updates: Partial<FeeLoan>) => void;
  onDeleteFeeLoan: (id: string) => void;
}

export const FeeLoanManager: React.FC<FeeLoanManagerProps> = ({
  feeLoans,
  candidates,
  sponsors,
  onSaveFeeLoan,
  onUpdateFeeLoan,
  onDeleteFeeLoan,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | StatusKeuangan>('All');

  // Inline row edit state
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineDpFit, setInlineDpFit] = useState<number>(0);
  const [inlinePelunasan, setInlinePelunasan] = useState<number>(0);
  const [inlineStatus, setInlineStatus] = useState<StatusKeuangan>('DP Fit');
  const [inlineKeterangan, setInlineKeterangan] = useState<string>('');

  // Modal / Drawer state for "Edit Langsung Nominal DP, Pelunasan & Status"
  const [editingItem, setEditingItem] = useState<FeeLoan | null>(null);
  const [editDpFit, setEditDpFit] = useState<number>(0);
  const [editPelunasan, setEditPelunasan] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<StatusKeuangan>('Lunas');
  const [editKeterangan, setEditKeterangan] = useState<string>('');

  // Add Form State
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [namaSponsor, setNamaSponsor] = useState('');
  const [tanggalAnakMasuk, setTanggalAnakMasuk] = useState('');
  const [tanggalMasukBlk, setTanggalMasukBlk] = useState('');
  const [dpFit, setDpFit] = useState<number>(2500000);
  const [statusDp, setStatusDp] = useState<FeeLoan['statusDp']>('Sudah DP');
  const [pelunasan, setPelunasan] = useState<number>(0);
  const [statusPelunasan, setStatusPelunasan] = useState<StatusKeuangan>('DP Fit');
  const [nominalPinjaman, setNominalPinjaman] = useState<number>(0);
  const [catatan, setCatatan] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Start inline editing
  const handleStartInlineEdit = (item: FeeLoan) => {
    setInlineEditId(item.id);
    setInlineDpFit(item.dpFit || 0);
    setInlinePelunasan(item.pelunasan || 0);
    setInlineStatus(item.statusPelunasan || 'Belum Lunas');
    setInlineKeterangan(item.keterangan || item.catatan || '');
  };

  const handleCancelInlineEdit = () => {
    setInlineEditId(null);
  };

  const handleSaveInlineEdit = (id: string) => {
    const item = feeLoans.find((f) => f.id === id);
    if (!item) return;

    onUpdateFeeLoan(id, {
      dpFit: Number(inlineDpFit) || 0,
      pelunasan: Number(inlinePelunasan) || 0,
      statusPelunasan: inlineStatus,
      statusDp: inlineDpFit > 0 ? 'Sudah DP' : 'Belum DP',
      keterangan: inlineKeterangan.trim(),
      tanggalPelunasan: inlineStatus === 'Lunas' ? new Date().toISOString().split('T')[0] : item.tanggalPelunasan,
    });

    setInlineEditId(null);
  };

  // Quick 1-click status change
  const handleQuickStatusChange = (item: FeeLoan, newStatus: StatusKeuangan) => {
    onUpdateFeeLoan(item.id, {
      statusPelunasan: newStatus,
      tanggalPelunasan: newStatus === 'Lunas' ? new Date().toISOString().split('T')[0] : item.tanggalPelunasan,
    });
  };

  const handleOpenEditModal = (item: FeeLoan) => {
    setEditingItem(item);
    setEditDpFit(item.dpFit || 0);
    setEditPelunasan(item.pelunasan || 0);
    setEditStatus(item.statusPelunasan || 'Belum Lunas');
    setEditKeterangan(item.keterangan || item.catatan || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    onUpdateFeeLoan(editingItem.id, {
      dpFit: Number(editDpFit) || 0,
      pelunasan: Number(editPelunasan) || 0,
      statusPelunasan: editStatus,
      statusDp: editDpFit > 0 ? 'Sudah DP' : 'Belum DP',
      keterangan: editKeterangan.trim(),
      tanggalPelunasan: editStatus === 'Lunas' ? new Date().toISOString().split('T')[0] : editingItem.tanggalPelunasan,
    });

    setEditingItem(null);
  };

  const handleCandidateChange = (candId: string) => {
    setSelectedCandidateId(candId);
    const cand = candidates.find((c) => c.id === candId);
    if (cand) {
      setNamaSponsor(cand.namaSponsor);
      setTanggalAnakMasuk(cand.tanggalMasuk);
      setTanggalMasukBlk(cand.tanggalMasukBlk || '');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cand = candidates.find((c) => c.id === selectedCandidateId);
    if (!cand) {
      alert('Pilih data anak terlebih dahulu.');
      return;
    }

    onSaveFeeLoan({
      candidateId: cand.id,
      namaAnak: cand.nama,
      namaSponsor: namaSponsor || cand.namaSponsor,
      tanggalAnakMasuk: tanggalAnakMasuk || cand.tanggalMasuk,
      tanggalMasukBlk: tanggalMasukBlk || cand.tanggalMasukBlk,
      dpFit: Number(dpFit) || 0,
      statusDp,
      pelunasan: Number(pelunasan) || 0,
      statusPelunasan,
      nominalPinjaman: Number(nominalPinjaman) || 0,
      catatan: catatan.trim() || undefined,
      keterangan: keterangan.trim() || undefined,
    });

    setShowAddForm(false);
    setSelectedCandidateId('');
    setCatatan('');
    setKeterangan('');
    setNominalPinjaman(0);
    setPelunasan(0);
    setDpFit(2500000);
  };

  const filtered = feeLoans.filter((f) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      f.namaAnak.toLowerCase().includes(q) ||
      f.namaSponsor.toLowerCase().includes(q) ||
      (f.keterangan && f.keterangan.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'All' || f.statusPelunasan === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalDpNominal = feeLoans.reduce((sum, f) => sum + (f.dpFit || 0), 0);
  const totalPelunasanNominal = feeLoans.reduce((sum, f) => sum + (f.pelunasan || 0), 0);
  const totalPinjamanNominal = feeLoans.reduce((sum, f) => sum + (f.nominalPinjaman || 0), 0);
  const countLunas = feeLoans.filter((f) => f.statusPelunasan === 'Lunas').length;
  const countDpFit = feeLoans.filter((f) => f.statusPelunasan === 'DP Fit').length;
  const countHold = feeLoans.filter((f) => f.statusPelunasan === 'Hold').length;

  return (
    <div className="space-y-6">
      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Dana DP Fit
          </span>
          <div className="text-xl font-bold font-mono text-blue-700 tabular-nums">
            {formatRupiah(totalDpNominal)}
          </div>
          <span className="text-[11px] text-slate-400 block">
            {feeLoans.filter((f) => f.dpFit > 0).length} anak telah DP
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Pelunasan Kas
          </span>
          <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
            {formatRupiah(totalPelunasanNominal)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            {countLunas} anak status Lunas
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
            Data Status Hold
          </span>
          <div className="text-xl font-bold font-mono text-amber-800 tabular-nums">
            {countHold} Anak
          </div>
          <span className="text-[11px] text-amber-700 block">
            Tertahan / Menunggu Dokumen
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Pinjaman Aktif
          </span>
          <div className="text-xl font-bold font-mono text-slate-800 tabular-nums">
            {formatRupiah(totalPinjamanNominal)}
          </div>
          <span className="text-[11px] text-slate-400 block">
            {feeLoans.filter((f) => (f.nominalPinjaman || 0) > 0).length} pinjaman tercatat
          </span>
        </div>
      </div>

      {/* Top Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Menu Pelunasan, DP & Keuangan Anak
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Edit langsung nominal DP dan pelunasan, serta tombol ubah status: <strong className="text-emerald-700">Lunas</strong>, <strong className="text-blue-700">DP Fit</strong>, atau <strong className="text-amber-700">Hold</strong> dengan keterangan bebas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari anak, sponsor, keterangan..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-44 sm:w-60"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Tutup Input' : '+ Input Transaksi Baru'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs for Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setStatusFilter('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            statusFilter === 'All'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Status ({feeLoans.length})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Lunas')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            statusFilter === 'Lunas'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Lunas ({countLunas})</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('DP Fit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            statusFilter === 'DP Fit'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-blue-800 hover:bg-blue-50 border border-blue-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>DP Fit ({countDpFit})</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Hold')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            statusFilter === 'Hold'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-300'
          }`}
        >
          <PauseCircle className="w-3.5 h-3.5" />
          <span>Hold ({countHold})</span>
        </button>
      </div>

      {/* Form Tambah Catatan Finansial Baru */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Formulir Input Fee, DP Fit & Pelunasan Baru</h3>
            <span className="text-xs text-slate-400">Pilih anak terdaftar dan tentukan status keuangan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pilih Nama Anak <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCandidateId}
                onChange={(e) => handleCandidateChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              >
                <option value="">-- Pilih Anak Terdaftar --</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama} ({c.divisiNegara || 'Negara'}) — Sponsor: {c.namaSponsor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Sponsor <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={namaSponsor}
                onChange={(e) => setNamaSponsor(e.target.value)}
                placeholder="Nama Sponsor Perekrut"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tanggal Anak Masuk <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={tanggalAnakMasuk}
                onChange={(e) => setTanggalAnakMasuk(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nominal DP Fit (Rp)
              </label>
              <input
                type="number"
                value={dpFit}
                onChange={(e) => setDpFit(Number(e.target.value))}
                placeholder="2500000"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nominal Pelunasan (Rp)
              </label>
              <input
                type="number"
                value={pelunasan}
                onChange={(e) => setPelunasan(Number(e.target.value))}
                placeholder="7500000"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pilihan Status Pembayaran <span className="text-rose-500">*</span>
              </label>
              <select
                value={statusPelunasan}
                onChange={(e) => setStatusPelunasan(e.target.value as StatusKeuangan)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold text-slate-800"
              >
                <option value="Lunas">✅ Lunas</option>
                <option value="DP Fit">💳 DP Fit</option>
                <option value="Hold">⏸️ Hold (Tertahan)</option>
                <option value="Belum Lunas">⏳ Belum Lunas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Keterangan Bebas (Bisa diisi sendiri)
            </label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Lunas via transfer BCA / Hold: menunggu hasil medical fit / DP tahap 1"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
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
              <span>Simpan Catatan</span>
            </button>
          </div>
        </form>
      )}

      {/* Main Table: Fee, DP, Pelunasan & Status dengan Tombol Edit Langsung */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Anak & Sponsor</th>
                <th className="py-3 px-3">Tgl Masuk Anak / BLK</th>
                <th className="py-3 px-3">Nominal DP Fit</th>
                <th className="py-3 px-3">Nominal Pelunasan</th>
                <th className="py-3 px-3">Status Pembayaran</th>
                <th className="py-3 px-3">Keterangan Catatan</th>
                <th className="py-3 px-4 text-right">Aksi Edit Langsung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isInline = inlineEditId === item.id;
                const isLunas = item.statusPelunasan === 'Lunas';
                const isDpFit = item.statusPelunasan === 'DP Fit';
                const isHold = item.statusPelunasan === 'Hold';

                if (isInline) {
                  return (
                    <tr key={item.id} className="bg-blue-50/60 border-2 border-blue-400">
                      {/* Nama Anak & Sponsor */}
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="text-xs font-bold text-slate-900">{item.namaAnak}</div>
                        <div className="text-[11px] text-slate-500">Sponsor: {item.namaSponsor}</div>
                        <span className="inline-block mt-1 text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded font-bold">
                          Sedang Diedit
                        </span>
                      </td>

                      {/* Tanggal */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        <div>M: {item.tanggalAnakMasuk}</div>
                        <div className="text-slate-400">BLK: {item.tanggalMasukBlk || '-'}</div>
                      </td>

                      {/* Edit Langsung Nominal DP */}
                      <td className="py-3 px-3">
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Nominal DP</label>
                        <input
                          type="number"
                          value={inlineDpFit}
                          onChange={(e) => setInlineDpFit(Number(e.target.value))}
                          className="w-28 px-2 py-1 text-xs bg-white border border-blue-400 rounded focus:ring-2 focus:ring-blue-600 font-mono font-bold text-blue-900"
                        />
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {formatRupiah(inlineDpFit || 0)}
                        </div>
                      </td>

                      {/* Edit Langsung Nominal Pelunasan */}
                      <td className="py-3 px-3">
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Nominal Pelunasan</label>
                        <input
                          type="number"
                          value={inlinePelunasan}
                          onChange={(e) => setInlinePelunasan(Number(e.target.value))}
                          className="w-28 px-2 py-1 text-xs bg-white border border-emerald-400 rounded focus:ring-2 focus:ring-emerald-600 font-mono font-bold text-emerald-900"
                        />
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {formatRupiah(inlinePelunasan || 0)}
                        </div>
                      </td>

                      {/* Tombol Ubah Status: Lunas, DP Fit, Hold */}
                      <td className="py-3 px-3">
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Pilih Status:</label>
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setInlineStatus('Lunas');
                              if (inlinePelunasan === 0) setInlinePelunasan(7500000);
                            }}
                            className={`px-2 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors ${
                              inlineStatus === 'Lunas'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                          >
                            ✓ Lunas
                          </button>
                          <button
                            type="button"
                            onClick={() => setInlineStatus('DP Fit')}
                            className={`px-2 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors ${
                              inlineStatus === 'DP Fit'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                          >
                            DP Fit
                          </button>
                          <button
                            type="button"
                            onClick={() => setInlineStatus('Hold')}
                            className={`px-2 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors ${
                              inlineStatus === 'Hold'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            }`}
                          >
                            Hold
                          </button>
                        </div>
                      </td>

                      {/* Keterangan Kosong yang Bisa Diisi Sendiri */}
                      <td className="py-3 px-3">
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Keterangan:</label>
                        <input
                          type="text"
                          value={inlineKeterangan}
                          onChange={(e) => setInlineKeterangan(e.target.value)}
                          placeholder="Isi keterangan bebas..."
                          className="w-full min-w-[150px] px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:ring-2 focus:ring-blue-600"
                        />
                      </td>

                      {/* Aksi Simpan & Batal */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSaveInlineEdit(item.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelInlineEdit}
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nama Anak & Sponsor */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="text-sm font-bold text-slate-900">{item.namaAnak}</div>
                      <div className="text-[11px] font-medium text-slate-500">
                        Sponsor: {item.namaSponsor}
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td className="py-3.5 px-3 font-mono text-slate-600 text-[11px]">
                      <div>Masuk: {item.tanggalAnakMasuk}</div>
                      <div className="text-slate-400">BLK: {item.tanggalMasukBlk || '-'}</div>
                    </td>

                    {/* Nominal DP Fit */}
                    <td className="py-3.5 px-3">
                      <div className="font-mono font-bold text-blue-700 text-xs tabular-nums">
                        {formatRupiah(item.dpFit || 0)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.dpFit > 0 ? 'DP Terbayar' : 'Belum DP'}
                      </span>
                    </td>

                    {/* Nominal Pelunasan */}
                    <td className="py-3.5 px-3">
                      <div className="font-mono font-bold text-emerald-700 text-xs tabular-nums">
                        {formatRupiah(item.pelunasan || 0)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {item.pelunasan > 0 ? 'Pelunasan Terbayar' : 'Belum Ada Pelunasan'}
                      </span>
                    </td>

                    {/* Status Pilihan: Lunas, DP Fit, Hold + Tombol Ubah Cepat 1-Klik */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1.5">
                        {isLunas ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Lunas
                          </span>
                        ) : isDpFit ? (
                          <span className="inline-flex items-center gap-1 text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-bold text-[11px]">
                            <Clock className="w-3 h-3 text-blue-600" /> DP Fit
                          </span>
                        ) : isHold ? (
                          <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-full font-bold text-[11px]">
                            <PauseCircle className="w-3 h-3 text-amber-600" /> Hold (Tertahan)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full font-semibold text-[11px]">
                            Belum Lunas
                          </span>
                        )}

                        {/* Tombol Ubah Cepat Pilihan Status */}
                        <div className="flex items-center gap-1 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(item, 'Lunas')}
                            title="Ubah langsung status jadi Lunas"
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border cursor-pointer transition-colors ${
                              isLunas 
                                ? 'bg-emerald-600 text-white border-emerald-600' 
                                : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            Lunas
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(item, 'DP Fit')}
                            title="Ubah langsung status jadi DP Fit"
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border cursor-pointer transition-colors ${
                              isDpFit 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
                            }`}
                          >
                            DP Fit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(item, 'Hold')}
                            title="Ubah langsung status jadi Hold"
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border cursor-pointer transition-colors ${
                              isHold 
                                ? 'bg-amber-600 text-white border-amber-500' 
                                : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                            }`}
                          >
                            Hold
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Keterangan Bebas */}
                    <td className="py-3.5 px-3 max-w-[220px]">
                      {item.keterangan ? (
                        <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 leading-snug">
                          {item.keterangan}
                        </div>
                      ) : (
                        <span className="text-slate-300 italic text-[11px]">- Kosong -</span>
                      )}
                    </td>

                    {/* Tombol Aksi Edit Langsung */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartInlineEdit(item)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                          title="Edit Langsung Nominal DP, Pelunasan, Status & Keterangan di Baris Ini"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Langsung</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus catatan fee untuk ${item.namaAnak}?`)) {
                              onDeleteFeeLoan(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Tidak ada data keuangan yang sesuai dengan pencarian atau filter status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT LANGSUNG NOMINAL DP, PELUNASAN, STATUS (LUNAS, DP FIT, HOLD) & KETERANGAN */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in zoom-in-95 duration-150">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Langsung Nominal & Status Keuangan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Calon Anak: <strong className="text-slate-800">{editingItem.namaAnak}</strong> (Sponsor: {editingItem.namaSponsor})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              
              {/* Row 1: Edit Langsung Nominal DP Fit & Pelunasan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Nominal DP Fit (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={editDpFit}
                      onChange={(e) => setEditDpFit(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono font-bold text-blue-900"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    Format: {formatRupiah(editDpFit || 0)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Nominal Pelunasan (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={editPelunasan}
                      onChange={(e) => setEditPelunasan(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono font-bold text-emerald-900"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    Format: {formatRupiah(editPelunasan || 0)}
                  </span>
                </div>
              </div>

              {/* Row 2: Tombol Ubah untuk Pilihan Lunas, DP Fit, Hold */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Tombol Ubah Status Pembayaran <span className="text-rose-500">*</span>
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                  {/* Tombol Lunas */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditStatus('Lunas');
                      if (editPelunasan === 0) setEditPelunasan(7500000);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs flex flex-col items-center justify-center gap-1 ${
                      editStatus === 'Lunas'
                        ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                        : 'bg-emerald-50/60 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lunas</span>
                  </button>

                  {/* Tombol DP Fit */}
                  <button
                    type="button"
                    onClick={() => setEditStatus('DP Fit')}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs flex flex-col items-center justify-center gap-1 ${
                      editStatus === 'DP Fit'
                        ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                        : 'bg-blue-50/60 text-blue-800 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>DP Fit</span>
                  </button>

                  {/* Tombol Hold */}
                  <button
                    type="button"
                    onClick={() => setEditStatus('Hold')}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs flex flex-col items-center justify-center gap-1 ${
                      editStatus === 'Hold'
                        ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-600/20 shadow-xs'
                        : 'bg-amber-50/60 text-amber-800 border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    <PauseCircle className="w-4 h-4" />
                    <span>Hold</span>
                  </button>
                </div>
              </div>

              {/* Row 3: Keterangan Kosong yang Bisa Diisi Sendiri */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Keterangan Tambahan (Bisa diisi bebas sendiri)
                </label>
                <textarea
                  rows={3}
                  value={editKeterangan}
                  onChange={(e) => setEditKeterangan(e.target.value)}
                  placeholder="Ketik keterangan bebas di sini, contoh: 'Hold sementara: menunggu paspor asli' / 'Lunas 100% kwitansi #481 via transfer Bank Mandiri' / 'DP Fit tahap 1 telah dikonfirmasi bendahara'..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Keterangan ini akan langsung tampil di kolom tabel pelunasan.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
