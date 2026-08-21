'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Cloud, ShieldCheck, Users, LogOut, Check, Copy } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { authUser, handleGoogleSignIn, handleSignOut, friendCode } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const onSignInClick = async () => {
    try {
      setIsLoading(true);
      await handleGoogleSignIn();
      sounds.playTaskPop();
      onClose();
    } catch (err) {
      console.error('Sign in failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignOutClick = async () => {
    await handleSignOut();
    sounds.playTap();
    onClose();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(friendCode);
    setCopiedCode(true);
    sounds.playTaskPop();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm clean-card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {authUser ? (
          /* Signed In State */
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] border-2 border-[var(--primary)] overflow-hidden flex items-center justify-center text-3xl mb-2">
                {authUser.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={authUser.photoURL} alt={authUser.displayName || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <span>🌱</span>
                )}
              </div>
              <h2 className="text-base font-black text-[var(--text-main)]">
                {authUser.displayName || 'Pathly Explorer'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {authUser.email}
              </p>
            </div>

            {/* Friend Code Box */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-left">
              <div className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Your Unique Friend Code
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-black text-[var(--primary)]">
                  {friendCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-[var(--primary)] text-white text-[11px] font-bold flex items-center gap-1 hover:opacity-90 transition-opacity"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                Give this code to friends so they can add you to their accountability pod!
              </p>
            </div>

            {/* Sync status */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--primary)] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud Sync Active (Data Safe)</span>
            </div>

            <button
              onClick={onSignOutClick}
              className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Sign In Prompt */
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] mx-auto flex items-center justify-center text-2xl mb-1">
              <Cloud className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-base font-black text-[var(--text-main)]">
                Keep Progress Safe in the Cloud
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Sign in with Google so your habits and friend connections are never lost
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-2 text-left text-xs p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span>Never lose milestones on device change</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500 shrink-0" />
                <span>See real-time progress from friends</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Automatic 100% free cloud backups</span>
              </div>
            </div>

            {/* 1-Click Google Sign In */}
            <button
              onClick={onSignInClick}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-[var(--primary)] text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
