/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthMode, User } from './types/auth';
import { getCurrentUser, setCurrentUser } from './utils/storage';
import { AuthLayout } from './components/AuthLayout';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { TermsModal } from './components/TermsModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  // Default mode: 'register' to honor "ketikan akan log in harus creat akun dulu", but user can toggle anytime
  const [authMode, setAuthMode] = useState<AuthMode>('register');
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setCurrentUserState(savedUser);
    }
    setIsInitialized(true);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    setSuccessMessage('');
  };

  const handleRegisterSuccess = (email: string, fullName: string) => {
    setPrefilledEmail(email);
    setSuccessMessage(
      `Akun atas nama "${fullName}" (${email}) berhasil didaftarkan! Silakan masukkan kata sandi Anda untuk masuk ke sistem MyJafa.`
    );
    setAuthMode('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setSuccessMessage('Anda telah berhasil keluar (logout) dari portal MyJafa.');
    setAuthMode('login');
  };

  const handleSwitchToRegister = (email?: string) => {
    if (email) setPrefilledEmail(email);
    setSuccessMessage('');
    setAuthMode('register');
  };

  const handleSwitchToLogin = (email?: string) => {
    if (email) setPrefilledEmail(email);
    setAuthMode('login');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Memuat Portal MyJafa...</span>
        </div>
      </div>
    );
  }

  // If user is logged in, show Enterprise Dashboard
  if (currentUser) {
    return (
      <Dashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Otherwise, show the professional split-screen Authentication View
  return (
    <>
      <AuthLayout mode={authMode} onModeChange={setAuthMode}>
        {authMode === 'register' ? (
          <RegisterForm
            initialEmail={prefilledEmail}
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={handleSwitchToLogin}
            onOpenTerms={() => setIsTermsOpen(true)}
            isTermsAgreed={isTermsAgreed}
            onSetTermsAgreed={setIsTermsAgreed}
          />
        ) : (
          <LoginForm
            prefilledEmail={prefilledEmail}
            successMessage={successMessage}
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
            onOpenForgotPassword={(email) => {
              if (email) setPrefilledEmail(email);
              setIsForgotPasswordOpen(true);
            }}
          />
        )}
      </AuthLayout>

      {/* Global Modals */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => setIsTermsAgreed(true)}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialEmail={prefilledEmail}
      />
    </>
  );
}
