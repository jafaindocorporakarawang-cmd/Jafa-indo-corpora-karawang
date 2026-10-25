import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle, 
  Users, 
  FileCheck2, 
  LockKeyhole,
  ArrowRight
} from 'lucide-react';
import { AuthMode } from '../types/auth';

interface AuthLayoutProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  mode,
  onModeChange,
  children
}) => {
  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar Contract */}
      <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Brand Zone: 1 text/logo wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                MyJafa
              </span>
              <span className="text-xs text-slate-400 block -mt-0.5 font-normal">
                PT Jafa Indo Corpora
              </span>
            </div>
          </div>

          {/* Quick Context & Support */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Sistem Terproteksi Enterprise
            </span>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <a 
              href="mailto:jafaindocorporakarawang@gmail.com" 
              className="hover:text-blue-400 transition-colors hidden md:inline"
            >
              Bantuan TI: jafaindocorporakarawang@gmail.com
            </a>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-800/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
          
          {/* Left Column: Visual Showcase & Enterprise Assurance (5 cols on lg) */}
          <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 text-white bg-slate-950 overflow-hidden">
            {/* Background Image with Measured Contrast Scrim */}
            <img
              src="/src/assets/images/myjafa_corporate_hero_1792891397576.jpg"
              alt="Gedung Enterprise PT Jafa Indo Corpora"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-105"
              referrerPolicy="no-referrer"
            />
            {/* Measured Scrim for WCAG contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/60" />

            {/* Top Brand Badge on Scrim */}
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs font-medium backdrop-blur-sm">
                <LockKeyhole className="w-3.5 h-3.5 text-blue-400" />
                <span>Portal Resmi Karyawan & Mitra</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white text-balance">
                Infrastruktur Digital Terpadu MyJafa
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Platform operasional, inventaris, dan administrasi kepegawaian modern PT Jafa Indo Corpora Karawang.
              </p>
            </div>

            {/* Middle Workflow Guide / Core Pre-requisite Rule */}
            <div className="relative z-10 my-auto py-6 space-y-4">
              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Alur Akses Portal:
                </h3>
                
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      mode === 'register' ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-white">Buat Akun (Wajib Awal)</p>
                      <p className="text-[11px] text-slate-400">Lengkapi data pribadi, nomor HP, dan unit kerja untuk pendaftaran resmi.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      mode === 'login' ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-white">Log In ke Akun Terverifikasi</p>
                      <p className="text-[11px] text-slate-400">Gunakan email & kata sandi yang telah didaftarkan untuk masuk ke portal.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-white">Akses Dashboard Enterprise</p>
                      <p className="text-[11px] text-slate-400">Kelola operasional harian, presensi, surat pengajuan, dan logistik.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Proof Metrics & Security Trust Markers */}
            <div className="relative z-10 pt-4 border-t border-slate-800/80">
              <div className="grid grid-cols-3 gap-3 text-center text-slate-300">
                <div className="space-y-0.5">
                  <div className="text-base font-bold text-white font-mono tabular-nums">99.9%</div>
                  <div className="text-[10px] text-slate-400">SLA Keandalan</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-base font-bold text-white font-mono tabular-nums">ISO 27001</div>
                  <div className="text-[10px] text-slate-400">Standar Data</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-base font-bold text-white font-mono tabular-nums">1,200+</div>
                  <div className="text-[10px] text-slate-400">Staf & Mitra</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Viewport (7 cols on lg) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Form Header & Segmented Tab Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {mode === 'register' ? 'Buat Akun Baru MyJafa' : 'Masuk ke Portal MyJafa'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {mode === 'register'
                      ? 'Langkah awal: Isi formulir di bawah untuk membuka akses akun resmi Anda.'
                      : 'Masukkan kredensial akun terdaftar Anda untuk melanjutkan.'}
                  </p>
                </div>

                {/* Segmented Mode Control */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto shrink-0 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => onModeChange('register')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      mode === 'register'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1. Buat Akun
                  </button>
                  <button
                    type="button"
                    onClick={() => onModeChange('login')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      mode === 'login'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    2. Masuk
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="py-6">
                {children}
              </div>
            </div>

            {/* Bottom Footer Notice */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>© 2026 PT Jafa Indo Corpora</span>
                <span>·</span>
                <span>Karawang, Jawa Barat</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Portal v2.6.4</span>
                <span>·</span>
                <span className="text-slate-400">Hak Cipta Dilindungi</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Global Minimal Footer */}
      <footer className="w-full py-3 text-center text-xs text-slate-500 border-t border-slate-800 bg-slate-950">
        <p>Aplikasi Resmi MyJafa — Seluruh transaksi dan aktivitas sistem dicatat untuk keperluan audit kepatuhan perusahaan.</p>
      </footer>
    </div>
  );
};
