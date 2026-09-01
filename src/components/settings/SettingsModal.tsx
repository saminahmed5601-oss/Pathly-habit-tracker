'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { sounds } from '@/lib/sounds';
import { getLocalDateString } from '@/lib/dateUtils';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { 
  X, 
  Settings, 
  Palette, 
  Volume2, 
  Download, 
  Upload, 
  ShieldAlert, 
  User,
  Sun,
  Moon,
  VolumeX,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_THEMES = [
  { id: 'emerald' as const, label: 'Emerald Focus', color: 'bg-emerald-500', text: 'text-emerald-500', hex: '#10B981' },
  { id: 'indigo' as const, label: 'Electric Violet', color: 'bg-indigo-500', text: 'text-indigo-500', hex: '#6366F1' },
  { id: 'cyan' as const, label: 'Neon Cyan', color: 'bg-cyan-500', text: 'text-cyan-500', hex: '#06B6D4' },
  { id: 'rose' as const, label: 'Sakura Rose', color: 'bg-rose-500', text: 'text-rose-500', hex: '#F43F5E' },
  { id: 'amber' as const, label: 'Solar Amber', color: 'bg-amber-500', text: 'text-amber-500', hex: '#F59E0B' },
  { id: 'coral' as const, label: 'Sunset Coral', color: 'bg-orange-500', text: 'text-orange-500', hex: '#FF5722' },
];

const DARK_STYLES = [
  { id: 'obsidian' as const, name: 'Velvet Obsidian', emoji: '🌑', desc: 'Deep carbon abyss (Default)' },
  { id: 'oled' as const, name: 'True OLED Black', emoji: '🖤', desc: '100% pure pitch black' },
  { id: 'midnight' as const, name: 'Midnight Cyber', emoji: '🌌', desc: 'Deep galactic navy space' },
  { id: 'coffee' as const, name: 'Cozy Espresso', emoji: '☕', desc: 'Warm rich roasted mocha' },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { 
    profile, 
    toggleTheme, 
    isDarkMode,
    updateProfile,
    setThemeAccent, 
    setDarkStyle,
    toggleSound, 
    setSfxVolume, 
    toggleAntiCheat, 
    resetAllDemoData,
    exportDataJSON,
    importDataJSON
  } = useApp();

  const [activeTab, setActiveTab] = useState<'themes' | 'profile' | 'audio' | 'data'>('themes');
  
  // Profile form state
  const [nameInput, setNameInput] = useState(profile.name || '');
  const [bioInput, setBioInput] = useState(profile.bio || 'Daily habit builder & explorer 🔥');
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarId || 'sprout');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const [importStatus, setImportStatus] = useState<{ text: string; isError: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentAccent = profile.themeAccent || 'emerald';
  const currentDarkStyle = profile.darkStyle || 'obsidian';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput.trim() || 'Explorer',
      bio: bioInput.trim(),
      avatarId: selectedAvatar,
    });
    setProfileSavedMsg(true);
    sounds.playTaskPop();
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pathly-backup-${getLocalDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playTaskPop();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          setImportStatus({ text: '✅ Data imported and restored successfully!', isError: false });
        } else {
          setImportStatus({ text: '❌ Failed to parse backup file. Please check file format.', isError: true });
        }
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl clean-card bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--border)] bg-[var(--bg-card-subtle)]/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--primary-light)] text-[var(--primary-text)] shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[var(--text-main)]">
                Preferences & Customization
              </h2>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                Themes, dark mode flavors, profile, audio & data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-[var(--border)] bg-[var(--bg-card)] overflow-x-auto">
          {([
            { id: 'themes' as const, label: 'Themes & Dark Mode', icon: Palette },
            { id: 'profile' as const, label: 'Profile & Avatar', icon: User },
            { id: 'audio' as const, label: 'Sound & Audio', icon: Volume2 },
            { id: 'data' as const, label: 'Backup & Privacy', icon: Download },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  sounds.playTap();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[var(--primary)] text-[var(--primary-text)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: THEMES & DARK MODE */}
          {activeTab === 'themes' && (
            <div className="space-y-5">
              
              {/* Light / Dark Mode Toggle Card */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>Theme Appearance</span>
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Currently set to <strong>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5 ${
                    isDarkMode
                      ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDarkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
                </button>
              </div>

              {/* Dark Mode Flavors (If in dark mode) */}
              {isDarkMode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>Dark Mode Flavors</span>
                    </label>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold">
                      Pick your contrast depth
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DARK_STYLES.map((flavor) => {
                      const isSelected = currentDarkStyle === flavor.id;
                      return (
                        <button
                          key={flavor.id}
                          type="button"
                          onClick={() => setDarkStyle(flavor.id)}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 active:scale-98 ${
                            isSelected
                              ? 'bg-[var(--primary-light)] border-[var(--primary)] shadow-xs ring-1 ring-[var(--primary)]'
                              : 'bg-[var(--bg-card-subtle)] border-[var(--border)] hover:border-[var(--border-focus)]'
                          }`}
                        >
                          <span className="text-2xl mt-0.5">{flavor.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[var(--text-main)]">
                                {flavor.name}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                              )}
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">
                              {flavor.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Accent Palette */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Accent Color Palette</span>
                  </label>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">
                    6 Curated Themes
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ACCENT_THEMES.map((theme) => {
                    const isSelected = currentAccent === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setThemeAccent(theme.id)}
                        className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2.5 active:scale-98 ${
                          isSelected
                            ? 'bg-[var(--primary-light)] border-[var(--primary)] shadow-xs ring-1 ring-[var(--primary)]'
                            : 'bg-[var(--bg-card-subtle)] border-[var(--border)] hover:border-[var(--border-focus)]'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full ${theme.color} flex items-center justify-center text-white shadow-xs shrink-0`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-bold text-[var(--text-main)] truncate">
                          {theme.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)] space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Live Palette Preview
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    <div>
                      <div className="text-xs font-bold text-[var(--text-main)]">Daily Flow State</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Theme accent applied cleanly</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-xs"
                  >
                    Active Button
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROFILE & IDENTITY */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Display Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-main)]">
                  Display Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your Name / Handle"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              {/* Bio / Motivation Tagline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-main)]">
                  Motto / Bio
                </label>
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="e.g. Building habits every day 🔥"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              {/* Avatar Emoji Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-main)]">
                  Choose Profile Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((av) => {
                    const isSelected = selectedAvatar === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`p-2.5 rounded-2xl border text-xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[var(--primary-light)] border-[var(--primary)] scale-105 shadow-xs'
                            : 'bg-[var(--bg-card-subtle)] border-[var(--border)] hover:border-[var(--primary)]'
                        }`}
                        title={av.name}
                      >
                        <span>{av.emoji}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {profileSavedMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated and saved!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-98 text-white font-bold text-xs shadow-xs transition-all"
              >
                Save Profile Changes
              </button>
            </form>
          )}

          {/* TAB 3: AUDIO & SOUNDS */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              
              {/* Sound Toggle */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-[var(--primary)]" /> : <VolumeX className="w-4 h-4 text-rose-500" />}
                    <span>Sound Effects & Audio Feedback</span>
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Synthesizer chimes for timer, completion, and level ups
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleSound}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    profile.soundEnabled
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {profile.soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>

              {/* Volume Slider */}
              {profile.soundEnabled && (
                <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)] space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[var(--text-main)]">
                    <span>SFX Master Volume</span>
                    <span className="text-[var(--primary)] font-mono">{Math.round((profile.sfxVolume || 0.8) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={profile.sfxVolume || 0.8}
                    onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                    className="w-full accent-[var(--primary)] cursor-pointer"
                  />
                </div>
              )}

              {/* Sound Test Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-main)]">
                  Audio &amp; Chime Playground
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => sounds.playFocusStart()}
                    className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text-main)] transition-colors active:scale-95 text-center"
                  >
                    Singing Bowl 🔔
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playTimerFinish()}
                    className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text-main)] transition-colors active:scale-95 text-center"
                  >
                    Zen Gong 🧘
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playTaskPop()}
                    className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text-main)] transition-colors active:scale-95 text-center"
                  >
                    Task Pop 🍬
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playLevelUp()}
                    className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text-main)] transition-colors active:scale-95 text-center"
                  >
                    Level Up 🚀
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playMilestoneFanfare()}
                    className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text-main)] transition-colors active:scale-95 text-center"
                  >
                    Fanfare 🎺
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playRickroll()}
                    className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text-main)] transition-colors active:scale-95 text-center"
                  >
                    Rickroll 🕺
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playVineBoom()}
                    className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text-main)] transition-colors active:scale-95 text-center"
                  >
                    Vine Boom 💥
                  </button>
                  <button
                    type="button"
                    onClick={() => sounds.playMarioCoin()}
                    className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-bold text-[var(--text-main)] transition-colors active:scale-95 text-center"
                  >
                    Mario Coin 🪙
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: BACKUP & PRIVACY */}
          {activeTab === 'data' && (
            <div className="space-y-5">
              
              {/* Anti-Cheat Guard Toggle */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                    <span>Anti-Cheat Pacing Guard</span>
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Enforces genuine cooldown verification between rapid milestone checks
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleAntiCheat}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    profile.antiCheatEnabled
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {profile.antiCheatEnabled ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Export & Import Backup */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)] space-y-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-[var(--primary)]" />
                    <span>1-Click Offline Backup (JSON)</span>
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Save a full offline snapshot of your habits, milestones, streak history & XP
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExport}
                    className="py-2.5 px-3 rounded-xl bg-[var(--primary)] text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--text-main)] font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Restore JSON</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {importStatus && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold ${
                    importStatus.isError ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {importStatus.text}
                  </div>
                )}
              </div>

              {/* Danger Zone: Reset Data */}
              <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Reset All Data</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(!showResetConfirm)}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition-colors"
                  >
                    {showResetConfirm ? 'Cancel' : 'Reset'}
                  </button>
                </div>

                {showResetConfirm && (
                  <div className="pt-2 space-y-2 border-t border-rose-500/20">
                    <p className="text-[11px] text-rose-400">
                      Are you sure you want to reset all tasks, milestones, and XP to factory defaults?
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        resetAllDemoData();
                        setShowResetConfirm(false);
                        onClose();
                      }}
                      className="w-full py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                    >
                      Yes, Wipe and Start Fresh
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
