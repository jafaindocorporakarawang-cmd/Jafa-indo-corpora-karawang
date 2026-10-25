import React from 'react';
import { ShieldCheck, X, FileText, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="terms-title" className="text-base font-semibold text-slate-900">
                Syarat & Ketentuan Penggunaan MyJafa
              </h3>
              <p className="text-xs text-slate-500">PT Jafa Indo Corpora Karawang</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Portal MyJafa adalah sistem internal resmi yang dilindungi oleh standar keamanan data ISO 27001 dan enkripsi end-to-end.
            </span>
          </div>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">1. Keabsahan Akun & Pengguna</h4>
            <p className="text-xs">
              Setiap pengguna wajib memberikan informasi nama lengkap, email kerja/aktif, dan unit kerja yang sah. Akun bersifat personal dan tidak diperkenankan untuk dipindahtangankan kepada pihak lain tanpa izin manajemen.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">2. Kerahasiaan Data Perusahaan</h4>
            <p className="text-xs">
              Semua dokumen, laporan logistik, inventaris, data keuangan, dan komunikasi internal di dalam MyJafa merupakan rahasia operasional PT Jafa Indo Corpora. Dilarang mendistribusikan data ke luar ekosistem resmi.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">3. Keamanan Sandi & Akses</h4>
            <p className="text-xs">
              Pengguna bertanggung jawab penuh atas keamanan kata sandi yang digunakan. Disarankan menggunakan kata sandi minimal 8 karakter dengan perpaduan angka dan simbol. Laporkan segera ke tim TI bila dicurigai ada akses tidak sah.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">4. Kebijakan Privasi</h4>
            <p className="text-xs">
              Data pribadi yang dihimpun hanya dipergunakan untuk keperluan administrasi kepegawaian, verifikasi operasional, dan sistem audit internal perusahaan secara terenkripsi.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Saya Menyetujui Ketentuan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
