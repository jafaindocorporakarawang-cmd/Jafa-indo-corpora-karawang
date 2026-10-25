import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Briefcase, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  IdCard
} from 'lucide-react';
import { Jabatan, RegisterFormData } from '../types/auth';
import { findUserByEmail, saveUser } from '../utils/storage';

interface RegisterFormProps {
  onSuccess: (email: string, fullName: string) => void;
  onSwitchToLogin: (prefilledEmail?: string) => void;
  onOpenTerms: () => void;
  isTermsAgreed: boolean;
  onSetTermsAgreed: (agreed: boolean) => void;
  initialEmail?: string;
}

const JABATAN_OPTIONS: { id: Jabatan; label: string; desc: string }[] = [
  { 
    id: 'Operator', 
    label: 'Operator', 
    desc: 'Operasional harian & presensi' 
  },
  { 
    id: 'Admin', 
    label: 'Admin', 
    desc: 'Pengelolaan sistem & data' 
  },
  { 
    id: 'Directur', 
    label: 'Directur', 
    desc: 'Persetujuan & wewenang eksekutif' 
  }
];

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  onOpenTerms,
  isTermsAgreed,
  onSetTermsAgreed,
  initialEmail = ''
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: initialEmail,
    phone: '',
    jabatan: 'Operator',
    employeeId: '',
    password: '',
    confirmPassword: '',
    agreeTerms: isTermsAgreed
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync prop changes for terms agreement
  React.useEffect(() => {
    setFormData((prev) => ({ ...prev, agreeTerms: isTermsAgreed }));
  }, [isTermsAgreed]);

  // Evaluate password strength
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Sangat Lemah', color: 'bg-rose-500', text: 'text-rose-600' };
      case 2:
        return { score: 50, label: 'Cukup', color: 'bg-amber-500', text: 'text-amber-600' };
      case 3:
        return { score: 75, label: 'Kuat', color: 'bg-blue-600', text: 'text-blue-600' };
      case 4:
        return { score: 100, label: 'Sangat Kuat', color: 'bg-emerald-600', text: 'text-emerald-600' };
      default:
        return { score: 10, label: 'Terlalu Pendek', color: 'bg-rose-400', text: 'text-rose-500' };
    }
  };

  const strength = calculatePasswordStrength(formData.password);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Nama lengkap wajib diisi.';
    } else if (formData.fullName.trim().length < 3) {
      errs.fullName = 'Nama minimal 3 karakter.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Alamat email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Format email tidak valid.';
    } else if (findUserByEmail(formData.email.trim())) {
      errs.email = 'Email sudah terdaftar. Silakan langsung masuk ke sistem.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Nomor telepon wajib diisi.';
    } else if (formData.phone.trim().length < 8) {
      errs.phone = 'Nomor telepon minimal 8 digit.';
    }

    if (!formData.jabatan) {
      errs.jabatan = 'Pilih salah satu jabatan: Operator, Admin, atau Directur.';
    }

    if (!formData.password) {
      errs.password = 'Kata sandi wajib diisi.';
    } else if (formData.password.length < 8) {
      errs.password = 'Kata sandi minimal 8 karakter.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'Anda harus menyetujui syarat & ketentuan MyJafa.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        saveUser({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          jabatan: formData.jabatan,
          division: `Divisi ${formData.jabatan}`,
          employeeId: formData.employeeId.trim() || `JFA-${formData.jabatan.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
          password: formData.password,
          role: formData.jabatan
        });

        setIsSubmitting(false);
        onSuccess(formData.email.trim().toLowerCase(), formData.fullName.trim());
      } catch {
        setIsSubmitting(false);
        setGeneralError('Terjadi kendala saat menyimpan data akun. Silakan coba kembali.');
      }
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Notice Callout */}
      <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-snug">
          <strong className="font-semibold block text-blue-950 mb-0.5">Wajib Buat Akun Terlebih Dahulu</strong>
          Untuk menjaga keamanan akses data perusahaan, pengguna yang belum terdaftar diwajibkan menyelesaikan registrasi akun sebelum dapat masuk.
        </div>
      </div>

      {generalError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Row 1: Full Name & Employee ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="reg-name" className="block text-xs font-medium text-slate-700 mb-1">
            Nama Lengkap <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              id="reg-name"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="cth: Ahmad Pratama"
              className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                errors.fullName ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.fullName && <p className="mt-1 text-[11px] text-rose-600">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="reg-empid" className="block text-xs font-medium text-slate-700 mb-1">
            ID Karyawan / NIK <span className="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IdCard className="w-4 h-4" />
            </div>
            <input
              id="reg-empid"
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              placeholder="cth: JFA-2024-102"
              className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="reg-email" className="block text-xs font-medium text-slate-700 mb-1">
            Alamat Email Resmi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reg-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="nama@myjafa.id"
              className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.email && <p className="mt-1 text-[11px] text-rose-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="reg-phone" className="block text-xs font-medium text-slate-700 mb-1">
            Nomor Telepon / WA <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="reg-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
              className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                errors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.phone && <p className="mt-1 text-[11px] text-rose-600">{errors.phone}</p>}
        </div>
      </div>

      {/* Row 3: Jabatan Selection - Exactly 3 Options: Operator, Admin, Directur */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="reg-jabatan" className="block text-xs font-medium text-slate-700">
            Jabatan <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400">Pilih salah satu (3 opsi)</span>
        </div>

        {/* 3-card interactive selector */}
        <div className="grid grid-cols-3 gap-2.5">
          {JABATAN_OPTIONS.map((item) => {
            const isSelected = formData.jabatan === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormData({ ...formData, jabatan: item.id })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-600/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                    {item.label}
                  </span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Compact select dropdown for accessibility */}
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <select
            id="reg-jabatan"
            value={formData.jabatan}
            onChange={(e) => setFormData({ ...formData, jabatan: e.target.value as Jabatan })}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800 font-medium"
          >
            <option value="Operator">Operator</option>
            <option value="Admin">Admin</option>
            <option value="Directur">Directur</option>
          </select>
        </div>
        {errors.jabatan && <p className="mt-1 text-[11px] text-rose-600">{errors.jabatan}</p>}
      </div>

      {/* Row 4: Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="reg-pwd" className="block text-xs font-medium text-slate-700 mb-1">
            Kata Sandi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-pwd"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimal 8 karakter"
              className={`w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                errors.password ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
              }`}
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
          {errors.password && <p className="mt-1 text-[11px] text-rose-600">{errors.password}</p>}
          
          {formData.password && (
            <div className="mt-1.5 space-y-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Kekuatan Sandi</span>
                <span className={`font-medium ${strength.text}`}>{strength.label}</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="reg-conf-pwd" className="block text-xs font-medium text-slate-700 mb-1">
            Konfirmasi Sandi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-conf-pwd"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Ulangi kata sandi"
              className={`w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                errors.confirmPassword ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-[11px] text-rose-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Row 5: Terms & Agreement */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => {
              setFormData({ ...formData, agreeTerms: e.target.checked });
              onSetTermsAgreed(e.target.checked);
            }}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600 focus:ring-offset-0 transition-colors"
          />
          <span className="text-xs text-slate-600 leading-snug">
            Saya menyetujui{' '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onOpenTerms();
              }}
              className="text-blue-700 font-medium hover:underline inline-flex items-center"
            >
              Syarat & Ketentuan Penggunaan
            </button>{' '}
            serta Kebijakan Kerahasiaan Data PT Jafa Indo Corpora.
          </span>
        </label>
        {errors.agreeTerms && <p className="mt-1 text-[11px] text-rose-600">{errors.agreeTerms}</p>}
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Mendaftarkan Akun Anda...
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Daftar Akun Baru MyJafa</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Switch to Login */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Sudah memiliki akun terdaftar?{' '}
          <button
            type="button"
            onClick={() => onSwitchToLogin(formData.email)}
            className="text-blue-700 font-semibold hover:text-blue-800 hover:underline inline-flex items-center gap-0.5"
          >
            Masuk ke MyJafa
          </button>
        </p>
      </div>
    </form>
  );
};
