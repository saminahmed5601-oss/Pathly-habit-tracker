'use client';

import { useState, useEffect, useCallback } from 'react';
import { sounds, SoundscapeType } from '@/lib/sounds';

export interface SoundTrackInfo {
  id: SoundscapeType;
  label: string;
  category: string;
  icon: string;
  color: string;
  description: string;
}

export const SOUND_TRACKS: SoundTrackInfo[] = [
  {
    id: 'rain',
    label: 'Gentle Rain',
    category: 'Nature',
    icon: '🌧️',
    color: 'from-blue-400 to-indigo-500',
    description: 'Soft rhythmic raindrops with acoustic resonance',
  },
  {
    id: 'forest',
    label: 'Forest Birds',
    category: 'Nature',
    icon: '🌲',
    color: 'from-emerald-400 to-teal-600',
    description: 'Fresh pine canopy breeze & sweet morning songbirds',
  },
  {
    id: 'lofi',
    label: 'Lofi Chords',
    category: 'Music',
    icon: '☕',
    color: 'from-amber-400 to-orange-500',
    description: 'Lush mellow jazz 7th chords with warm tape saturation',
  },
  {
    id: 'ocean',
    label: 'Ocean Surf',
    category: 'Nature',
    icon: '🌊',
    color: 'from-cyan-400 to-blue-600',
    description: 'Slow 7-second rolling tidal waves & sea foam',
  },
  {
    id: 'brown_noise',
    label: 'Brown Noise',
    category: 'Focus',
    icon: '🧠',
    color: 'from-stone-500 to-amber-700',
    description: 'Deep acoustic low-frequency masking for ADHD/deep work',
  },
  {
    id: 'binaural_10hz',
    label: 'Alpha Wave',
    category: 'Focus',
    icon: '✨',
    color: 'from-purple-400 to-violet-600',
    description: '432Hz harmonic beat for calm clarity and flow state',
  },
];

export interface SoundPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  tracks: Partial<Record<SoundscapeType, number>>;
}

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'rainforest',
    name: 'Deep Rainforest',
    icon: '🌿',
    description: 'Rain + Forest Birds for refreshing clarity',
    tracks: { rain: 0.5, forest: 0.6 },
  },
  {
    id: 'lofi_cafe',
    name: 'Cozy Lofi Cafe',
    icon: '☕',
    description: 'Mellow Lofi + Soft Rain for easy coding sprints',
    tracks: { lofi: 0.6, rain: 0.3 },
  },
  {
    id: 'zen_sanctuary',
    name: 'Zen Sanctuary',
    icon: '🧘',
    description: 'Alpha Beats + Ocean Surf for deep grounding',
    tracks: { binaural_10hz: 0.5, ocean: 0.5 },
  },
  {
    id: 'deep_isolation',
    name: 'Deep Isolation',
    icon: '🎧',
    description: 'Brown Noise + Rain for complete noise block',
    tracks: { brown_noise: 0.7, rain: 0.4 },
  },
];

export function useSoundMixer() {
  const [trackVolumes, setTrackVolumes] = useState<Record<SoundscapeType, number>>({
    rain: 0.5,
    forest: 0.5,
    lofi: 0.5,
    ocean: 0.5,
    brown_noise: 0.5,
    binaural_10hz: 0.5,
  });

  const [activeTrackIds, setActiveTrackIds] = useState<Set<SoundscapeType>>(new Set());
  const [masterVolume, setMasterVolume] = useState<number>(0.7);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Sync state on mount
  useEffect(() => {
    const active = new Set<SoundscapeType>();
    SOUND_TRACKS.forEach((t) => {
      if (sounds.isTrackActive(t.id)) {
        active.add(t.id);
      }
    });
    setActiveTrackIds(active);
  }, []);

  const toggleTrack = useCallback((trackId: SoundscapeType) => {
    setActiveTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
        sounds.stopTrack(trackId);
      } else {
        next.add(trackId);
        const vol = trackVolumes[trackId] ?? 0.5;
        sounds.startTrack(trackId, vol);
      }
      return next;
    });
    setActivePresetId(null);
  }, [trackVolumes]);

  const setVolume = useCallback((trackId: SoundscapeType, volume: number) => {
    setTrackVolumes((prev) => ({ ...prev, [trackId]: volume }));
    sounds.setTrackVolume(trackId, volume);
  }, []);

  const applyPreset = useCallback((preset: SoundPreset) => {
    sounds.stopAllTracks();
    const nextActive = new Set<SoundscapeType>();

    Object.entries(preset.tracks).forEach(([id, vol]) => {
      const trackId = id as SoundscapeType;
      const trackVol = vol ?? 0.5;
      sounds.startTrack(trackId, trackVol);
      nextActive.add(trackId);
      setTrackVolumes((prev) => ({ ...prev, [trackId]: trackVol }));
    });

    setActiveTrackIds(nextActive);
    setActivePresetId(preset.id);
  }, []);

  const stopAll = useCallback(() => {
    sounds.stopAllTracks();
    setActiveTrackIds(new Set());
    setActivePresetId(null);
  }, []);

  const updateMasterVolume = useCallback((vol: number) => {
    setMasterVolume(vol);
    sounds.setSoundscapeVolume(vol);
  }, []);

  return {
    trackVolumes,
    activeTrackIds,
    masterVolume,
    activePresetId,
    toggleTrack,
    setVolume,
    applyPreset,
    stopAll,
    updateMasterVolume,
    tracks: SOUND_TRACKS,
    presets: SOUND_PRESETS,
    isPlaying: activeTrackIds.size > 0,
  };
}
