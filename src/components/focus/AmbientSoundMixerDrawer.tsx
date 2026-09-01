'use client';

import React from 'react';
import { useSoundMixer, SOUND_TRACKS, SOUND_PRESETS } from '@/hooks/useSoundMixer';
import { Volume2, VolumeX, Sparkles, Sliders, X, Play, Square, Layers } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface AmbientSoundMixerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AmbientSoundMixerDrawer({ isOpen, onClose }: AmbientSoundMixerDrawerProps) {
  const {
    trackVolumes,
    activeTrackIds,
    masterVolume,
    activePresetId,
    toggleTrack,
    setVolume,
    applyPreset,
    stopAll,
    updateMasterVolume,
    isPlaying,
  } = useSoundMixer();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md transition-all animate-fadeIn">
      <div className="relative w-full max-w-lg clean-card p-5 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-[var(--text-main)]">
                  Ambient Sound Mixer
                </h3>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{activeTrackIds.size} Layer{activeTrackIds.size > 1 ? 's' : ''} Playing</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Layer natural soundscapes with individual volume levels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isPlaying && (
              <button
                type="button"
                onClick={() => {
                  stopAll();
                  sounds.playTap();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-rose-500/10 hover:text-rose-500 text-xs font-bold text-[var(--text-muted)] transition-colors flex items-center gap-1"
                title="Stop all tracks"
              >
                <Square className="w-3 h-3" />
                <span>Mute All</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Ambient Sound Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Curated Sound Blends</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SOUND_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    applyPreset(preset);
                    sounds.playTap();
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer active:scale-98 ${
                    isSelected
                      ? 'bg-[var(--primary-light)] border-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]'
                      : 'bg-[var(--bg-card-subtle)] border-[var(--border)] hover:border-[var(--primary)]/60'
                  }`}
                >
                  <span className="text-xl shrink-0 p-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                    {preset.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-[var(--text-main)] truncate">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate">
                      {preset.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Track Channel Sliders */}
        <div className="space-y-2.5 pt-2 border-t border-[var(--border)]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-[var(--primary)]" />
              <span>Soundboard Channels</span>
            </span>
          </div>

          <div className="space-y-2">
            {SOUND_TRACKS.map((track) => {
              const isActive = activeTrackIds.has(track.id);
              const volume = trackVolumes[track.id] ?? 0.5;

              return (
                <div
                  key={track.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-[var(--bg-card)] border-[var(--primary)]/80 shadow-xs'
                      : 'bg-[var(--bg-card-subtle)]/70 border-[var(--border)] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    
                    {/* Track Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleTrack(track.id);
                        sounds.playTap();
                      }}
                      className={`flex items-center gap-2.5 text-left cursor-pointer transition-transform active:scale-95 min-w-0 flex-1`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 border transition-all ${
                        isActive
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs scale-105'
                          : 'bg-[var(--bg-card)] border-[var(--border)]'
                      }`}>
                        {track.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold truncate ${
                            isActive ? 'text-[var(--text-main)] font-black' : 'text-[var(--text-muted)]'
                          }`}>
                            {track.label}
                          </span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/5 text-[var(--text-muted)]">
                            {track.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">
                          {track.description}
                        </p>
                      </div>
                    </button>

                    {/* Active State Pill */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleTrack(track.id);
                        sounds.playTap();
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all shrink-0 active:scale-95 ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {isActive ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Volume Slider for active track */}
                  {isActive && (
                    <div className="mt-2.5 pt-2 border-t border-[var(--border)]/60 flex items-center gap-2.5">
                      <VolumeX className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(track.id, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                      />
                      <Volume2 className="w-3 h-3 text-[var(--primary)] shrink-0" />
                      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] w-7 text-right">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Master Volume Bar & Done */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-[200px]">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Master:</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={masterVolume}
              onChange={(e) => updateMasterVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-95 text-white font-bold text-xs shadow-xs transition-all"
          >
            Done Mixing
          </button>
        </div>

      </div>
    </div>
  );
}
