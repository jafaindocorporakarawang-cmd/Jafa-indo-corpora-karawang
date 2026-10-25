export interface DocumentStatus {
  ktp: boolean;
  kk: boolean;
  aktaKelahiran: boolean;
  ijazah: boolean;
  bukuNikah: boolean;
  paspor: boolean;
  bpjs: boolean;
  suratIjin: boolean;
}

export type DivisiNegara = 'Malaysia' | 'Singapura' | 'Hongkong' | 'Taiwan';

export interface Candidate {
  id: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamatKtp: string;
  noTelp: string;
  pendidikanTerakhir: 'SD' | 'SMP' | 'SMA/SMK' | 'Diploma' | 'S1/Sederajat' | 'Lainnya';
  divisiNegara: DivisiNegara;
  namaSponsor: string;
  sponsorId?: string;
  tanggalMasuk: string;
  dokumen: DocumentStatus;
  statusBlk: 'Belum Masuk BLK' | 'Dijadwalkan BLK' | 'Sudah Masuk BLK';
  tanggalMasukBlk?: string;
  catatan?: string;
  createdAt: string;
}

export interface Sponsor {
  id: string;
  namaSponsor: string;
  alamat: string;
  noTelp: string;
  keterangan?: string;
  createdAt: string;
}

export interface BlkEntry {
  id: string;
  candidateId: string;
  namaAnak: string;
  namaSponsor: string;
  tanggalMasukAnak: string;
  tanggalMasukBlk: string;
  statusBlk: 'Belum Masuk BLK' | 'Dijadwalkan BLK' | 'Sudah Masuk BLK';
  ruangAsrama?: string;
  catatan?: string;
  createdAt: string;
}

export type StatusKeuangan = 'Lunas' | 'DP Fit' | 'Hold' | 'Belum Lunas';

export interface FeeLoan {
  id: string;
  sponsorId?: string;
  namaSponsor: string;
  candidateId: string;
  namaAnak: string;
  tanggalAnakMasuk: string;
  tanggalMasukBlk?: string;
  dpFit: number; // Nominal DP Fit
  tanggalDpFit?: string;
  statusDp: 'Belum DP' | 'Sudah DP';
  pelunasan: number; // Nominal Pelunasan
  statusPelunasan: StatusKeuangan;
  tanggalPelunasan?: string;
  nominalPinjaman?: number; // Pinjaman sponsor/anak
  catatan?: string;
  keterangan?: string; // Keterangan bebas yang bisa diisi sendiri
  createdAt: string;
}

export interface DashboardCounts {
  totalAnakMasuk: number;
  totalMasukBlk: number; // total in BLK queue / planned
  totalSudahMasukBlk: number; // confirmed in BLK
  totalDp: number; // count of records with DP
  totalNominalDp: number;
  totalPelunasan: number; // count of records fully settled
  totalNominalPelunasan: number;
  countsPerNegara: {
    Malaysia: number;
    Singapura: number;
    Hongkong: number;
    Taiwan: number;
  };
}
