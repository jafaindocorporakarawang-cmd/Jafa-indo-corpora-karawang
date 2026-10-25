import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { User, LoginFormData } from '../types/auth';
import { 
  findUserByEmail, 
  setCurrentUser, 
  getRememberedEmail, 
  setRememberedEmail 
} from '../utils/storage';

interface LoginFormProps {
  onSuccess: (user: User) => void;
  onSwitchToRegister: (prefilledEmail?: string) => void;
  onOpenForgotPassword: (email?: string) => void;
  prefilledEmail?: string;
  successMessage?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onOpenForgotPassword,
  prefilledEmail = '',
  successMessage = ''
}) => {
  const initialEmail = prefilledEmail || getRememberedEmail() || '';

  const [formData, setFormData] = useState<LoginFormData>({
    email: initialEmail,
    password: '',
    rememberMe: Boolean(getRememberedEmail())
  });

  const [showPassword, setShowPassword] = useState(false);
  const [unregisteredError, setUnregisteredError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUnregisteredError(null);
    setPasswordError(null);

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      setUnregisteredError('Silakan masukkan alamat email Anda.');
      return;
    }

    if (!password) {
      setPasswordError('Silakan masukkan kata sandi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const existingUser = findUserByEmail(email);

      // Core business requirement: user MUST create account first if not registered
      if (!existingUser) {
        setUnregisteredError(
          `Akun dengan email "${email}" belum terdaftar. Anda harus membuat akun (registrasi) terlebih dahulu sebelum dapat masuk ke MyJafa.`
        );
        return;
      }

      // Check password
      if (existingUser.password && existingUser.password !== password) {
        setPasswordError('Kata sandi yang Anda masukkan salah. Periksa kembali atau gunakan Lupa Kata Sandi.');
        return;
      }

      // Handle remember me
      if (formData.rememberMe) {
        setRememberedEmail(email);
      } else {
        setRememberedEmail('');
      }

      // Establish session
      setCurrentUser(existingUser);
      onSuccess(existingUser);
    }, 500);
  };

  const handleUseDemoAccount = (demoEmail: string, demoPass: string) => {
    setFormData({
      ...formData,
      email: demoEmail,
      password: demoPass,
      rememberMe: true
    });
    setUnregisteredError(null);
    setPasswordError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Registration Pre-requisite Notice Banner */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/90 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-snug">
          <strong className="font-semibold block text-amber-950 mb-0.5">Ketentuan Akses MyJafa</strong>
          Pengguna baru wajib membuat akun terlebih dahulu. Sistem akan menolak upaya log in jika data akun belum terverifikasi di pangkalan data.
        </div>
      </div>

      {/* Success banner if redirected from successful registration */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Explicit Unregistered Account Error Callout with Action to Register */}
      {unregisteredError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold text-rose-900">Akun Belum Dibuat / Belum Terdaftar</p>
              <p className="mt-0.5 text-rose-700 leading-relaxed">{unregisteredError}</p>
            </div>
          </div>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onSwitchToRegister(formData.email)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Buat Akun Terlebih Dahulu Sekarang</span>
            </button>
          </div>
        </div>
      )}

      {/* Email input */}
      <div>
        <label htmlFor="login-email" className="block text-xs font-medium text-slate-700 mb-1">
          Alamat Email Resmi
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="login-email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setUnregisteredError(null);
            }}
            placeholder="nama@myjafa.id atau gmail.com"
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            required
          />
        </div>
      </div>

      {/* Password input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="login-pwd" className="text-xs font-medium text-slate-700">
            Kata Sandi
          </label>
          <button
            type="button"
            onClick={() => onOpenForgotPassword(formData.email)}
            className="text-[11px] text-blue-700 hover:text-blue-800 hover:underline"
          >
            Lupa kata sandi?
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="login-pwd"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setPasswordError(null);
            }}
            placeholder="Masukkan kata sandi akun Anda"
            className={`w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
              passwordError ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {passwordError && <p className="mt-1 text-[11px] text-rose-600">{passwordError}</p>}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 focus:ring-offset-0 transition-colors"
          />
          <span className="text-xs text-slate-600">Ingat email di perangkat ini</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Memverifikasi Data Akun...
            </span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Masuk ke MyJafa</span>
            </>
          )}
        </button>
      </div>

      {/* Don't have account yet section */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2 mt-4">
        <p className="text-xs text-slate-600">
          Belum memiliki akun MyJafa yang terdaftar?
        </p>
        <button
          type="button"
          onClick={() => onSwitchToRegister(formData.email)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50/50 hover:border-blue-300 rounded-lg transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Wajib Buat Akun Terlebih Dahulu</span>
        </button>
      </div>

      {/* Quick Testing / Demo Accounts Shortcut */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
          <span className="flex items-center gap-1 font-medium text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-500" /> Akun Uji Coba Cepat (Demo):
          </span>
          <span className="text-[10px]">Klik untuk isi otomatis</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleUseDemoAccount('budi.santoso@myjafa.id', 'Password123!')}
            className="p-2 text-left bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-[11px] transition-colors cursor-pointer"
          >
            <div className="font-semibold text-slate-800">Operator</div>
            <div className="text-slate-500 text-[10px] font-mono truncate">budi.santoso@...</div>
          </button>
          <button
            type="button"
            onClick={() => handleUseDemoAccount('jafaindocorporakarawang@gmail.com', 'Password123!')}
            className="p-2 text-left bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-[11px] transition-colors cursor-pointer"
          >
            <div className="font-semibold text-slate-800">Admin</div>
            <div className="text-slate-500 text-[10px] font-mono truncate">jafaindocorpora...</div>
          </button>
          <button
            type="button"
            onClick={() => handleUseDemoAccount('hendra.directur@myjafa.id', 'Password123!')}
            className="p-2 text-left bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-[11px] transition-colors cursor-pointer"
          >
            <div className="font-semibold text-slate-800">Directur</div>
            <div className="text-slate-500 text-[10px] font-mono truncate">hendra.directur@...</div>
          </button>
        </div>
      </div>

      {/* Security certification badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Enkripsi SSL 256-bit standar enterprise</span>
      </div>
    </form>
  );
};
