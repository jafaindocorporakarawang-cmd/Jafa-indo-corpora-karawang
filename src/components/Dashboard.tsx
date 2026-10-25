import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  LogOut, 
  User as UserIcon, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Bell, 
  ShieldCheck, 
  Briefcase, 
  Phone, 
  Mail, 
  Check, 
  AlertCircle,
  Plus,
  Users,
  Building,
  CreditCard,
  FileCheck,
  TrendingUp,
  MapPin,
  IdCard,
  DollarSign,
  Globe2
} from 'lucide-react';
import { User } from '../types/auth';
import { Candidate, Sponsor, BlkEntry, FeeLoan, DashboardCounts } from '../types/dashboard';
import { 
  getCandidates, 
  saveCandidate, 
  updateCandidate, 
  deleteCandidate, 
  getSponsors, 
  saveSponsor, 
  deleteSponsor, 
  getFeeLoans, 
  saveFeeLoan, 
  updateFeeLoan, 
  deleteFeeLoan, 
  calculateDashboardCounts, 
  updateBlkStatus,
  formatRupiah 
} from '../utils/dashboardStorage';
import { CandidateInputModal } from './CandidateInputModal';
import { CandidateList } from './CandidateList';
import { SponsorManager } from './SponsorManager';
import { BlkManager } from './BlkManager';
import { FeeLoanManager } from './FeeLoanManager';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  
  // Navigation tabs between the 4 main modules (Separated: Anak Baru Masuk & Anak Masuk BLK)
  const [activeTab, setActiveTab] = useState<'anak_baru_masuk' | 'anak_masuk_blk' | 'nama_sponsor' | 'fee_pinjaman'>('anak_baru_masuk');
  const [preselectedBlkCandidateId, setPreselectedBlkCandidateId] = useState<string | null>(null);
  
  // Storage state
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [feeLoans, setFeeLoans] = useState<FeeLoan[]>([]);
  const [counts, setCounts] = useState<DashboardCounts>({
    totalAnakMasuk: 0,
    totalMasukBlk: 0,
    totalSudahMasukBlk: 0,
    totalDp: 0,
    totalNominalDp: 0,
    totalPelunasan: 0,
    totalNominalPelunasan: 0,
    countsPerNegara: {
      Malaysia: 0,
      Singapura: 0,
      Hongkong: 0,
      Taiwan: 0,
    },
  });

  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(2);
  const [showNotificationList, setShowNotificationList] = useState(false);

  // Load and refresh all data
  const refreshAllData = () => {
    const cands = getCandidates();
    const sps = getSponsors();
    const fees = getFeeLoans();
    const computedCounts = calculateDashboardCounts();

    setCandidates(cands);
    setSponsors(sps);
    setFeeLoans(fees);
    setCounts(computedCounts);
  };

  useEffect(() => {
    refreshAllData();

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // HANDLERS
  const handleSaveCandidate = (data: Omit<Candidate, 'id' | 'createdAt'>) => {
    saveCandidate(data);
    refreshAllData();
    showToast(`Data anak "${data.nama}" berhasil disimpan & dokumen diverifikasi.`);
  };

  const handleDeleteCandidate = (id: string) => {
    deleteCandidate(id);
    refreshAllData();
    showToast('Data anak berhasil dihapus.');
  };

  const handleUpdateCandidate = (id: string, updates: Partial<Candidate>) => {
    updateCandidate(id, updates);
    refreshAllData();
    showToast('Data anak berhasil diperbarui.');
  };

  const handleAddSponsor = (data: Omit<Sponsor, 'id' | 'createdAt'>) => {
    saveSponsor(data);
    refreshAllData();
    showToast(`Sponsor "${data.namaSponsor}" berhasil ditambahkan.`);
  };

  const handleQuickAddSponsor = (nama: string, alamat: string, telp: string): Sponsor => {
    const created = saveSponsor({
      namaSponsor: nama,
      alamat: alamat || 'Alamat Belum Diisi',
      noTelp: telp || '08xx-xxxx-xxxx',
    });
    refreshAllData();
    return created;
  };

  const handleDeleteSponsor = (id: string) => {
    deleteSponsor(id);
    refreshAllData();
    showToast('Data sponsor berhasil dihapus.');
  };

  const handleUpdateBlk = (candidateId: string, statusBlk: Candidate['statusBlk'], tanggalMasukBlk: string) => {
    updateBlkStatus(candidateId, statusBlk, tanggalMasukBlk);
    refreshAllData();
    showToast('Status & tanggal masuk BLK berhasil disinkronkan.');
  };

  const handleScheduleToBlk = (candidateId: string) => {
    setPreselectedBlkCandidateId(candidateId);
    setActiveTab('anak_masuk_blk');
    showToast('Mengarahkan ke menu Data Anak Masuk BLK.');
  };

  const handleSaveFeeLoan = (data: Omit<FeeLoan, 'id' | 'createdAt'>) => {
    saveFeeLoan(data);
    refreshAllData();
    showToast(`Data fee & pinjaman untuk ${data.namaAnak} berhasil disimpan.`);
  };

  const handleUpdateFeeLoan = (id: string, updates: Partial<FeeLoan>) => {
    updateFeeLoan(id, updates);
    refreshAllData();
    showToast('Catatan fee & pelunasan diperbarui.');
  };

  const handleDeleteFeeLoan = (id: string) => {
    deleteFeeLoan(id);
    refreshAllData();
    showToast('Catatan fee berhasil dihapus.');
  };

  const handleToggleAttendance = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setCheckInTime(timeStr);
      showToast(`Presensi Masuk berhasil dicatat pukul ${timeStr} WIB.`);
    } else {
      setIsCheckedIn(false);
      showToast('Presensi Kepulangan berhasil dicatat.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-900 text-sm">MyJafa</span>
                <span>/</span>
                <span className="font-medium text-slate-700">PT Jafa Indo Corpora</span>
                <span>/</span>
                <span className="text-blue-700 font-semibold">Jabatan: {user.jabatan || user.role}</span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotificationList(!showNotificationList);
                  setNotificationCount(0);
                }}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full" />
                )}
              </button>

              {showNotificationList && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-900">
                    <span>Notifikasi MyJafa</span>
                    <span className="text-[10px] text-slate-400">Terbaru</span>
                  </div>
                  <div className="space-y-2 py-2">
                    <div className="p-2 bg-blue-50/70 rounded-lg text-slate-700">
                      <p className="font-medium text-blue-900">Pembaruan Masuk BLK</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {counts.totalSudahMasukBlk} anak telah resmi terkonfirmasi berada di BLK Karawang.
                      </p>
                    </div>
                    <div className="p-2 bg-emerald-50/70 rounded-lg text-slate-700">
                      <p className="font-medium text-emerald-900">Kas DP Fit & Pelunasan</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {counts.totalPelunasan} transaksi pelunasan terverifikasi di sistem kas.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
              title="Keluar dari akun MyJafa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* KATA SAMBUTAN (Welcome Banner) */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-7 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-xs text-blue-200 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Portal Operasional & Keuangan PT Jafa Indo Corpora</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Selamat Datang, {user.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Anda terhubung sebagai <strong className="text-white underline decoration-blue-400 underline-offset-2">{user.jabatan || user.role}</strong> di aplikasi MyJafa. Kelola pendaftaran data anak, sponsor perekrut, penetapan tanggal masuk BLK, serta pelunasan fee dan pinjaman secara real-time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3.5 min-w-[210px] text-right shrink-0">
            <div className="text-[11px] text-blue-200 font-medium">{currentDate}</div>
            <div className="text-2xl font-bold font-mono tabular-nums tracking-wide text-white mt-0.5">
              {currentTime || '--:--:--'}
            </div>
            <div className="text-[10px] text-blue-300 mt-1">Zona Waktu: WIB (Karawang)</div>
          </div>
        </div>

        {/* 5 AUTOMATIC COUNTS STRIP (Hitungan Otomatis Sistem) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          {/* Count 1: Data Anak Baru Masuk */}
          <button
            type="button"
            onClick={() => setActiveTab('anak_baru_masuk')}
            className="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            title="Buka Data Anak Baru Masuk"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">Data Anak Baru Masuk</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">
              {counts.totalAnakMasuk}
            </div>
            <div className="text-[10px] text-slate-400">Total anak baru di kantor</div>
          </button>

          {/* Count 2: Data Masuk BLK (Dijadwalkan) */}
          <button
            type="button"
            onClick={() => setActiveTab('anak_masuk_blk')}
            className="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer"
            title="Buka Data Anak Masuk BLK"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Data Masuk BLK</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-700 tabular-nums">
              {counts.totalMasukBlk}
            </div>
            <div className="text-[10px] text-slate-400">Dijadwalkan masuk BLK</div>
          </button>

          {/* Count 3: Data Sudah Masuk BLK */}
          <button
            type="button"
            onClick={() => setActiveTab('anak_masuk_blk')}
            className="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer"
            title="Buka Siswa Aktif BLK"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Sudah Masuk BLK</span>
              <Building className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-700 tabular-nums">
              {counts.totalSudahMasukBlk}
            </div>
            <div className="text-[10px] text-slate-400">Aktif pelatihan di asrama</div>
          </button>

          {/* Count 4: Data DP (DP Fit) */}
          <button
            type="button"
            onClick={() => setActiveTab('fee_pinjaman')}
            className="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            title="Buka Menu DP & Keuangan"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">Data DP (Fit)</span>
              <CreditCard className="w-4 h-4 text-blue-700" />
            </div>
            <div className="text-2xl font-black font-mono text-blue-700 tabular-nums">
              {counts.totalDp}
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate" title={formatRupiah(counts.totalNominalDp)}>
              {formatRupiah(counts.totalNominalDp)}
            </div>
          </button>

          {/* Count 5: Data Pelunasan */}
          <button
            type="button"
            onClick={() => setActiveTab('fee_pinjaman')}
            className="text-left bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1 col-span-2 sm:col-span-1 hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer"
            title="Buka Menu Pelunasan"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">Data Pelunasan</span>
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black font-mono text-teal-700 tabular-nums">
              {counts.totalPelunasan}
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate" title={formatRupiah(counts.totalNominalPelunasan)}>
              {formatRupiah(counts.totalNominalPelunasan)}
            </div>
          </button>

        </div>

        {/* DATA COUNT ANAK DI SETIAP DIVISI NEGARA (Malaysia, Singapura, Hongkong, Taiwan) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-xs">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Data Count Anak di Setiap Divisi Negara
                </h3>
                <p className="text-[11px] text-slate-500">
                  Total anak/CPMI yang terdaftar untuk penempatan kerja luar negeri per divisi negara tujuan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                Akumulasi: {counts.totalAnakMasuk} Anak
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Divisi Malaysia */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🇲🇾</span>
                  <span className="font-bold text-xs text-slate-900">Malaysia</span>
                </div>
                <div className="text-[10px] text-slate-500">Pabrik & Perkebunan</div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-blue-800 tabular-nums">
                  {counts.countsPerNegara?.Malaysia || 0}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Anak</span>
              </div>
            </div>

            {/* Divisi Singapura */}
            <div className="p-3.5 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 flex items-center justify-between shadow-xs hover:border-rose-300 transition-all">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🇸🇬</span>
                  <span className="font-bold text-xs text-slate-900">Singapura</span>
                </div>
                <div className="text-[10px] text-slate-500">Hospitality & Care</div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-rose-800 tabular-nums">
                  {counts.countsPerNegara?.Singapura || 0}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Anak</span>
              </div>
            </div>

            {/* Divisi Hongkong */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 flex items-center justify-between shadow-xs hover:border-amber-300 transition-all">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🇭🇰</span>
                  <span className="font-bold text-xs text-slate-900">Hongkong</span>
                </div>
                <div className="text-[10px] text-slate-500">Layanan & Domestik</div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-amber-800 tabular-nums">
                  {counts.countsPerNegara?.Hongkong || 0}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Anak</span>
              </div>
            </div>

            {/* Divisi Taiwan */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 flex items-center justify-between shadow-xs hover:border-emerald-300 transition-all">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🇹🇼</span>
                  <span className="font-bold text-xs text-slate-900">Taiwan</span>
                </div>
                <div className="text-[10px] text-slate-500">Pabrik & Caregiver</div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-emerald-800 tabular-nums">
                  {counts.countsPerNegara?.Taiwan || 0}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Anak</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: Content Modules on Left, Menu Profil on Right Corner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT AREA: Nav Tabs & Active Management Module (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Navigation Tabs Bar - Explicitly Separating Data Anak Baru Masuk & Data Anak Masuk BLK */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
              
              {/* Tab 1: Data Anak Baru Masuk */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('anak_baru_masuk');
                  setPreselectedBlkCandidateId(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'anak_baru_masuk'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Data Anak Baru Masuk</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'anak_baru_masuk' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {counts.totalAnakMasuk}
                </span>
              </button>

              {/* Tab 2: Data Anak Masuk BLK */}
              <button
                type="button"
                onClick={() => setActiveTab('anak_masuk_blk')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'anak_masuk_blk'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Data Anak Masuk BLK</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'anak_masuk_blk' ? 'bg-blue-800 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {counts.totalSudahMasukBlk} Siswa
                </span>
              </button>

              {/* Tab 3: Nama Sponsor */}
              <button
                type="button"
                onClick={() => setActiveTab('nama_sponsor')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'nama_sponsor'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Nama Sponsor</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  activeTab === 'nama_sponsor' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {sponsors.length}
                </span>
              </button>

              {/* Tab 4: Fee dan Pinjaman */}
              <button
                type="button"
                onClick={() => setActiveTab('fee_pinjaman')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'fee_pinjaman'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Fee dan Pinjaman</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  activeTab === 'fee_pinjaman' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {feeLoans.length}
                </span>
              </button>
            </div>

            {/* TAB CONTENT */}

            {/* 1. Menu Data Anak Baru Masuk (Registrasi Kantor, 8 Dokumen Fisik & Tombol Jadwal BLK) */}
            {activeTab === 'anak_baru_masuk' && (
              <CandidateList
                candidates={candidates}
                sponsors={sponsors}
                onOpenAddModal={() => setIsCandidateModalOpen(true)}
                onDeleteCandidate={handleDeleteCandidate}
                onUpdateCandidate={handleUpdateCandidate}
                onScheduleToBlk={handleScheduleToBlk}
              />
            )}

            {/* 2. Menu Data Anak Masuk BLK (Jadwal Tanggal Masuk BLK & Ambil Nama Terinput) */}
            {activeTab === 'anak_masuk_blk' && (
              <BlkManager
                candidates={candidates}
                onUpdateBlk={handleUpdateBlk}
                initialCandidateId={preselectedBlkCandidateId}
              />
            )}

            {/* 3. Menu Nama Sponsor */}
            {activeTab === 'nama_sponsor' && (
              <SponsorManager
                sponsors={sponsors}
                candidates={candidates}
                onAddSponsor={handleAddSponsor}
                onDeleteSponsor={handleDeleteSponsor}
              />
            )}

            {/* 4. Menu Fee dan Pinjaman */}
            {activeTab === 'fee_pinjaman' && (
              <FeeLoanManager
                feeLoans={feeLoans}
                candidates={candidates}
                sponsors={sponsors}
                onSaveFeeLoan={handleSaveFeeLoan}
                onUpdateFeeLoan={handleUpdateFeeLoan}
                onDeleteFeeLoan={handleDeleteFeeLoan}
              />
            )}

          </div>

          {/* RIGHT COLUMN: MENU PROFIL DI POJOK KANAN DI BAWAH KATA SAMBUTAN (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Card Menu Profil */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-700" />
                  <h3 className="text-sm font-bold text-slate-900">Menu Profil Pengguna</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Aktif Online
                </span>
              </div>

              {/* User Avatar & Identity Lockup */}
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-900/20 shrink-0">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-900 text-sm truncate" title={user.fullName}>
                    {user.fullName}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-bold text-white bg-blue-700 px-2 py-0.5 rounded-md">
                      {user.jabatan || user.role}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {user.employeeId || 'JFA-STF-01'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Profile Attributes */}
              <div className="space-y-2.5 pt-2 text-xs border-t border-slate-100">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5" /> ID / NIK Pegawai
                  </span>
                  <span className="font-mono font-semibold text-slate-800">{user.employeeId || 'JFA-2026-001'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Resmi
                  </span>
                  <span className="font-mono text-slate-700 truncate max-w-[170px]" title={user.email}>
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> No. Telepon
                  </span>
                  <span className="font-mono text-slate-800">{user.phone || '0812-xxxx-xxxx'}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Jabatan & Otoritas
                  </span>
                  <span className="font-semibold text-blue-900">
                    {user.jabatan === 'Directur'
                      ? 'Otoritas Eksekutif'
                      : user.jabatan === 'Admin'
                      ? 'Otoritas Pengelola Data'
                      : 'Otoritas Lapangan'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Terdaftar Sejak
                  </span>
                  <span className="font-mono text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Presensi Button inside Menu Profil */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleToggleAttendance}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCheckedIn
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{isCheckedIn ? 'Presensi Pulang Kerja' : 'Presensi Masuk Kerja'}</span>
                </button>
                {checkInTime && isCheckedIn && (
                  <p className="text-[10px] text-center text-emerald-700 mt-1.5 font-medium">
                    Masuk tercatat: {checkInTime} WIB
                  </p>
                )}
              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar dari Akun MyJafa</span>
                </button>
              </div>
            </div>

            {/* Quick Action Box: Input Data Anak Langsung */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-5 text-white shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-200" />
                <h4 className="font-bold text-sm">Pendaftaran Calon Anak</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Tambahkan data calon anak/CPMI baru lengkap dengan verifikasi 8 berkas fisik (KTP, KK, Akta, Ijazah, Buku Nikah, Paspor, BPJS, Surat Izin).
              </p>
              <button
                type="button"
                onClick={() => setIsCandidateModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buka Form Input Data Anak</span>
              </button>
            </div>

            {/* Corporate Address & Contact */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <h5 className="font-bold uppercase tracking-wider text-[11px]">PT Jafa Indo Corpora</h5>
              </div>
              <p className="text-slate-300 leading-snug">
                Pusat Rekrutmen, Penempatan & Pelatihan Kerja (BLK) Karawang, Jawa Barat.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>Email: jafaindocorporakarawang@gmail.com</div>
                <div>Layanan Sistem: 24/7 Terproteksi SSL ISO 27001</div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* MODAL INPUT DATA ANAK */}
      <CandidateInputModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        onSave={handleSaveCandidate}
        sponsors={sponsors}
        onQuickAddSponsor={handleQuickAddSponsor}
      />
    </div>
  );
};
