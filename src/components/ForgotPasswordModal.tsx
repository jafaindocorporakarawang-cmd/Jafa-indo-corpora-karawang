import React, { useState } from 'react';
import { Mail, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { findUserByEmail } from '../utils/storage';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = ''
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Masukkan alamat email yang valid.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = findUserByEmail(email);
      // Even if user not found, enterprise UX usually gives secure confirmation or friendly note
      if (!user) {
        setError('Email belum terdaftar dalam sistem MyJafa. Silakan buat akun terlebih dahulu.');
      } else {
        setIsSubmitted(true);
      }
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setError('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-pw-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <h3 id="forgot-pw-title" className="text-sm font-semibold text-slate-900">
              Pemulihan Kata Sandi
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-slate-900">Tautan Pemulihan Terkirim</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Instruksi reset kata sandi telah dikirimkan ke <strong className="text-slate-800">{email}</strong>. Periksa kotak masuk atau folder spam Anda.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  Kembali ke Halaman Masuk
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Masukkan alamat email resmi Anda yang terdaftar pada akun MyJafa. Sistem akan mengirimkan tautan verifikasi untuk membuat kata sandi baru.
              </p>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="reset-email" className="block text-xs font-medium text-slate-700 mb-1">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@myjafa.id atau gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <span>Kirim Tautan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
