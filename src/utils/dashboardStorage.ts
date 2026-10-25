import { Candidate, Sponsor, BlkEntry, FeeLoan, DashboardCounts } from '../types/dashboard';

const SPONSORS_KEY = 'myjafa_sponsors_v1';
const CANDIDATES_KEY = 'myjafa_candidates_v1';
const BLK_KEY = 'myjafa_blk_v1';
const FEELOAN_KEY = 'myjafa_feeloan_v1';

// Initial realistic sponsors for Karawang & West Java CPMI ecosystem
const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'sp-001',
    namaSponsor: 'H. Suhendar (Karawang Timur)',
    alamat: 'Jl. Raya Klari No. 45, Karawang Timur, Jawa Barat',
    noTelp: '0812-8899-7711',
    keterangan: 'Sponsor Resmi Wilayah Karawang & Purwakarta',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'sp-002',
    namaSponsor: 'Ibu Hj. Maryati (Subang)',
    alamat: 'Dusun Sukamandi RT 03/02, Ciasem, Subang',
    noTelp: '0813-2244-6688',
    keterangan: 'Perekrutan Wilayah Pantura & Indramayu',
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'sp-003',
    namaSponsor: 'Pak Dedi Mulyadi (Cianjur)',
    alamat: 'Jl. Raya Ciranjang No. 12, Ciranjang, Cianjur',
    noTelp: '0857-1133-5577',
    keterangan: 'Sponsor Area Jawa Barat Selatan',
    createdAt: '2026-02-01T10:15:00Z',
  },
];

// Initial realistic candidates (Data Anak)
const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    nama: 'Siti Nurhaliza',
    tempatLahir: 'Karawang',
    tanggalLahir: '2001-05-14',
    alamatKtp: 'Kp. Pasir Jengkol RT 04/02, Rawamerta, Karawang',
    noTelp: '0812-3456-7890',
    pendidikanTerakhir: 'SMA/SMK',
    divisiNegara: 'Malaysia',
    namaSponsor: 'H. Suhendar (Karawang Timur)',
    sponsorId: 'sp-001',
    tanggalMasuk: '2026-02-10',
    dokumen: {
      ktp: true,
      kk: true,
      aktaKelahiran: true,
      ijazah: true,
      bukuNikah: false,
      paspor: true,
      bpjs: true,
      suratIjin: true,
    },
    statusBlk: 'Sudah Masuk BLK',
    tanggalMasukBlk: '2026-02-15',
    catatan: 'Siap pelatihan Bahasa & Fisik',
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 'cand-002',
    nama: 'Rizky Ramadhan',
    tempatLahir: 'Subang',
    tanggalLahir: '1999-11-20',
    alamatKtp: 'Ds. Cikaum Barat No. 18, Cikaum, Subang',
    noTelp: '0858-9876-5432',
    pendidikanTerakhir: 'SMA/SMK',
    divisiNegara: 'Taiwan',
    namaSponsor: 'Ibu Hj. Maryati (Subang)',
    sponsorId: 'sp-002',
    tanggalMasuk: '2026-02-18',
    dokumen: {
      ktp: true,
      kk: true,
      aktaKelahiran: true,
      ijazah: true,
      bukuNikah: true,
      paspor: true,
      bpjs: true,
      suratIjin: true,
    },
    statusBlk: 'Sudah Masuk BLK',
    tanggalMasukBlk: '2026-02-22',
    catatan: 'Sudah medical fit & verifikasi paspor',
    createdAt: '2026-02-18T09:00:00Z',
  },
  {
    id: 'cand-003',
    nama: 'Dewi Sartika',
    tempatLahir: 'Cianjur',
    tanggalLahir: '2002-08-03',
    alamatKtp: 'Kp. Babakan Caringin RT 02/05, Cibeber, Cianjur',
    noTelp: '0878-1234-5678',
    pendidikanTerakhir: 'SMP',
    divisiNegara: 'Hongkong',
    namaSponsor: 'Pak Dedi Mulyadi (Cianjur)',
    sponsorId: 'sp-003',
    tanggalMasuk: '2026-03-01',
    dokumen: {
      ktp: true,
      kk: true,
      aktaKelahiran: true,
      ijazah: true,
      bukuNikah: false,
      paspor: false,
      bpjs: true,
      suratIjin: true,
    },
    statusBlk: 'Dijadwalkan BLK',
    tanggalMasukBlk: '2026-03-10',
    catatan: 'Menunggu pembuatan paspor reguler',
    createdAt: '2026-03-01T10:30:00Z',
  },
  {
    id: 'cand-004',
    nama: 'Muhammad Ilham',
    tempatLahir: 'Karawang',
    tanggalLahir: '2000-02-17',
    alamatKtp: 'Dusun Krajan I RT 01/01, Tempuran, Karawang',
    noTelp: '0896-5544-3322',
    pendidikanTerakhir: 'SMA/SMK',
    divisiNegara: 'Singapura',
    namaSponsor: 'H. Suhendar (Karawang Timur)',
    sponsorId: 'sp-001',
    tanggalMasuk: '2026-03-05',
    dokumen: {
      ktp: true,
      kk: true,
      aktaKelahiran: true,
      ijazah: false,
      bukuNikah: false,
      paspor: false,
      bpjs: true,
      suratIjin: true,
    },
    statusBlk: 'Belum Masuk BLK',
    catatan: 'Ijazah asli masih dilegalisir di sekolah asal',
    createdAt: '2026-03-05T11:00:00Z',
  },
];

// Initial Fee & Loan records
const INITIAL_FEELOANS: FeeLoan[] = [
  {
    id: 'fl-001',
    namaSponsor: 'H. Suhendar (Karawang Timur)',
    candidateId: 'cand-001',
    namaAnak: 'Siti Nurhaliza',
    tanggalAnakMasuk: '2026-02-10',
    tanggalMasukBlk: '2026-02-15',
    dpFit: 2500000,
    tanggalDpFit: '2026-02-12',
    statusDp: 'Sudah DP',
    pelunasan: 7500000,
    statusPelunasan: 'Lunas',
    tanggalPelunasan: '2026-02-28',
    nominalPinjaman: 1000000,
    catatan: 'Lunas biaya medical & administrasi BLK',
    keterangan: 'Lunas transfer via Bank BCA a.n Siti',
    createdAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'fl-002',
    namaSponsor: 'Ibu Hj. Maryati (Subang)',
    candidateId: 'cand-002',
    namaAnak: 'Rizky Ramadhan',
    tanggalAnakMasuk: '2026-02-18',
    tanggalMasukBlk: '2026-02-22',
    dpFit: 2500000,
    tanggalDpFit: '2026-02-20',
    statusDp: 'Sudah DP',
    pelunasan: 7500000,
    statusPelunasan: 'Lunas',
    tanggalPelunasan: '2026-03-02',
    nominalPinjaman: 500000,
    catatan: 'Pelunasan transfer Bank Mandiri',
    keterangan: 'Pelunasan lunas 100% kwitansi #882',
    createdAt: '2026-02-18T15:00:00Z',
  },
  {
    id: 'fl-003',
    namaSponsor: 'Pak Dedi Mulyadi (Cianjur)',
    candidateId: 'cand-003',
    namaAnak: 'Dewi Sartika',
    tanggalAnakMasuk: '2026-03-01',
    tanggalMasukBlk: '2026-03-10',
    dpFit: 2500000,
    tanggalDpFit: '2026-03-03',
    statusDp: 'Sudah DP',
    pelunasan: 0,
    statusPelunasan: 'DP Fit',
    nominalPinjaman: 1500000,
    catatan: 'DP Fit diterima, pelunasan saat masuk asrama BLK',
    keterangan: 'DP Fit lunas tahap 1, pelunasan menyusul',
    createdAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'fl-004',
    namaSponsor: 'H. Suhendar (Karawang Timur)',
    candidateId: 'cand-004',
    namaAnak: 'Muhammad Ilham',
    tanggalAnakMasuk: '2026-03-05',
    dpFit: 1000000,
    statusDp: 'Sudah DP',
    pelunasan: 0,
    statusPelunasan: 'Hold',
    nominalPinjaman: 0,
    catatan: 'Menunggu kelengkapan dokumen ijazah',
    keterangan: 'Hold sementara: menunggu legalisir ijazah asli dari sekolah',
    createdAt: '2026-03-05T13:00:00Z',
  },
];

// SPONSORS HELPERS
export function getSponsors(): Sponsor[] {
  try {
    const raw = localStorage.getItem(SPONSORS_KEY);
    if (!raw) {
      localStorage.setItem(SPONSORS_KEY, JSON.stringify(INITIAL_SPONSORS));
      return INITIAL_SPONSORS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SPONSORS;
  }
}

export function saveSponsor(data: Omit<Sponsor, 'id' | 'createdAt'>): Sponsor {
  const sponsors = getSponsors();
  const newSponsor: Sponsor = {
    ...data,
    id: `sp-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newSponsor, ...sponsors];
  localStorage.setItem(SPONSORS_KEY, JSON.stringify(updated));
  return newSponsor;
}

export function deleteSponsor(id: string): void {
  const sponsors = getSponsors().filter((s) => s.id !== id);
  localStorage.setItem(SPONSORS_KEY, JSON.stringify(sponsors));
}

// CANDIDATES HELPERS (Data Anak)
export function getCandidates(): Candidate[] {
  try {
    const raw = localStorage.getItem(CANDIDATES_KEY);
    if (!raw) {
      localStorage.setItem(CANDIDATES_KEY, JSON.stringify(INITIAL_CANDIDATES));
      return INITIAL_CANDIDATES;
    }
    const parsed: Candidate[] = JSON.parse(raw);
    return parsed.map((c, idx) => ({
      ...c,
      divisiNegara: c.divisiNegara || (['Malaysia', 'Taiwan', 'Hongkong', 'Singapura'][idx % 4] as Candidate['divisiNegara']),
    }));
  } catch {
    return INITIAL_CANDIDATES;
  }
}

export function saveCandidate(data: Omit<Candidate, 'id' | 'createdAt'>): Candidate {
  const candidates = getCandidates();
  const newCandidate: Candidate = {
    ...data,
    id: `cand-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newCandidate, ...candidates];
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));

  // Automatically sync or initialize a corresponding FeeLoan record if not present
  const feeLoans = getFeeLoans();
  const existingFee = feeLoans.find((f) => f.candidateId === newCandidate.id);
  if (!existingFee) {
    const autoFee: FeeLoan = {
      id: `fl-${Date.now()}`,
      candidateId: newCandidate.id,
      namaAnak: newCandidate.nama,
      namaSponsor: newCandidate.namaSponsor,
      tanggalAnakMasuk: newCandidate.tanggalMasuk,
      tanggalMasukBlk: newCandidate.tanggalMasukBlk,
      dpFit: 0,
      statusDp: 'Belum DP',
      pelunasan: 0,
      statusPelunasan: 'Belum Lunas',
      nominalPinjaman: 0,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(FEELOAN_KEY, JSON.stringify([autoFee, ...feeLoans]));
  }

  return newCandidate;
}

export function updateCandidate(id: string, updates: Partial<Candidate>): void {
  const candidates = getCandidates().map((c) => (c.id === id ? { ...c, ...updates } : c));
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));

  // Sync to fee loan
  const feeLoans = getFeeLoans().map((f) => {
    if (f.candidateId === id) {
      return {
        ...f,
        namaAnak: updates.nama !== undefined ? updates.nama : f.namaAnak,
        namaSponsor: updates.namaSponsor !== undefined ? updates.namaSponsor : f.namaSponsor,
        tanggalAnakMasuk: updates.tanggalMasuk !== undefined ? updates.tanggalMasuk : f.tanggalAnakMasuk,
        tanggalMasukBlk: updates.tanggalMasukBlk !== undefined ? updates.tanggalMasukBlk : f.tanggalMasukBlk,
      };
    }
    return f;
  });
  localStorage.setItem(FEELOAN_KEY, JSON.stringify(feeLoans));
}

export function deleteCandidate(id: string): void {
  const candidates = getCandidates().filter((c) => c.id !== id);
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
}

// BLK ENTRIES HELPERS
export function updateBlkStatus(candidateId: string, statusBlk: Candidate['statusBlk'], tanggalMasukBlk: string): void {
  updateCandidate(candidateId, { statusBlk, tanggalMasukBlk });
}

// FEE & LOAN HELPERS
export function getFeeLoans(): FeeLoan[] {
  try {
    const raw = localStorage.getItem(FEELOAN_KEY);
    if (!raw) {
      localStorage.setItem(FEELOAN_KEY, JSON.stringify(INITIAL_FEELOANS));
      return INITIAL_FEELOANS;
    }
    const parsed: FeeLoan[] = JSON.parse(raw);
    return parsed.map((item) => ({
      ...item,
      statusPelunasan: item.statusPelunasan || (item.pelunasan > 0 ? 'Lunas' : item.dpFit > 0 ? 'DP Fit' : 'Belum Lunas'),
      keterangan: item.keterangan !== undefined ? item.keterangan : (item.catatan || ''),
    }));
  } catch {
    return INITIAL_FEELOANS;
  }
}

export function saveFeeLoan(data: Omit<FeeLoan, 'id' | 'createdAt'>): FeeLoan {
  const feeLoans = getFeeLoans();
  const newFee: FeeLoan = {
    ...data,
    id: `fl-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newFee, ...feeLoans];
  localStorage.setItem(FEELOAN_KEY, JSON.stringify(updated));
  return newFee;
}

export function updateFeeLoan(id: string, updates: Partial<FeeLoan>): void {
  const feeLoans = getFeeLoans().map((f) => (f.id === id ? { ...f, ...updates } : f));
  localStorage.setItem(FEELOAN_KEY, JSON.stringify(feeLoans));
}

export function deleteFeeLoan(id: string): void {
  const feeLoans = getFeeLoans().filter((f) => f.id !== id);
  localStorage.setItem(FEELOAN_KEY, JSON.stringify(feeLoans));
}

// AUTOMATIC COUNTERS CALCULATION
export function calculateDashboardCounts(): DashboardCounts {
  const candidates = getCandidates();
  const feeLoans = getFeeLoans();

  const totalAnakMasuk = candidates.length;
  // Dijadwalkan masuk BLK
  const totalMasukBlk = candidates.filter((c) => c.statusBlk === 'Dijadwalkan BLK').length;
  // Sudah resmi masuk BLK
  const totalSudahMasukBlk = candidates.filter((c) => c.statusBlk === 'Sudah Masuk BLK').length;

  // DP Fit
  const dpRecords = feeLoans.filter((f) => f.statusDp === 'Sudah DP' || (f.dpFit && f.dpFit > 0));
  const totalDp = dpRecords.length;
  const totalNominalDp = dpRecords.reduce((acc, curr) => acc + (curr.dpFit || 0), 0);

  // Pelunasan
  const pelunasanRecords = feeLoans.filter((f) => f.statusPelunasan === 'Lunas' || (f.pelunasan && f.pelunasan > 0));
  const totalPelunasan = pelunasanRecords.filter((f) => f.statusPelunasan === 'Lunas').length;
  const totalNominalPelunasan = pelunasanRecords.reduce((acc, curr) => acc + (curr.pelunasan || 0), 0);

  // Hitungan count anak per divisi negara (Malaysia, Singapura, Hongkong, Taiwan)
  const countsPerNegara = {
    Malaysia: candidates.filter((c) => c.divisiNegara === 'Malaysia').length,
    Singapura: candidates.filter((c) => c.divisiNegara === 'Singapura').length,
    Hongkong: candidates.filter((c) => c.divisiNegara === 'Hongkong').length,
    Taiwan: candidates.filter((c) => c.divisiNegara === 'Taiwan').length,
  };

  return {
    totalAnakMasuk,
    totalMasukBlk,
    totalSudahMasukBlk,
    totalDp,
    totalNominalDp,
    totalPelunasan,
    totalNominalPelunasan,
    countsPerNegara,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
