// Pure Web Audio API Synthesizer with natural acoustic resonators, organic focus soundscapes & meme synthesizers
export type SoundscapeType = 'rain' | 'forest' | 'lofi' | 'ocean' | 'brown_noise' | 'binaural_10hz';

interface ActiveTrackState {
  nodes: AudioNode[];
  gainNode: GainNode;
  volume: number;
  timerInterval?: NodeJS.Timeout | number;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;

  // Multi-Track Ambient Soundboard State
  private activeTracks: Map<SoundscapeType, ActiveTrackState> = new Map();
  private masterAmbientGain: GainNode | null = null;
  private currentSoundscape: SoundscapeType | null = null;
  private soundscapeVolume: number = 0.5;
  private isMobileUnlocked: boolean = false;

  constructor() {
    // Automatically register mobile touch unlock on first user gesture
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('touchend', unlock);
        window.removeEventListener('click', unlock);
      };
      window.addEventListener('touchstart', unlock, { passive: true });
      window.addEventListener('touchend', unlock, { passive: true });
      window.addEventListener('click', unlock, { passive: true });
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx && !this.masterAmbientGain) {
      this.masterAmbientGain = this.ctx.createGain();
      this.masterAmbientGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterAmbientGain.connect(this.ctx.destination);
    }
  }

  public unlockAudio() {
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMobileUnlocked = true;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAllTracks();
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public setSoundscapeVolume(vol: number) {
    this.soundscapeVolume = Math.max(0, Math.min(1, vol));
    if (this.masterAmbientGain && this.ctx) {
      this.masterAmbientGain.gain.setValueAtTime(this.soundscapeVolume * 0.7, this.ctx.currentTime);
    }
  }

  public getActiveSoundscape(): SoundscapeType | null {
    return this.currentSoundscape;
  }

  public getActiveTrackList(): { id: SoundscapeType; volume: number }[] {
    const list: { id: SoundscapeType; volume: number }[] = [];
    this.activeTracks.forEach((state, id) => {
      list.push({ id, volume: state.volume });
    });
    return list;
  }

  public isTrackActive(track: SoundscapeType): boolean {
    return this.activeTracks.has(track);
  }

  // --- MULTI-TRACK AMBIENT SOUNDBOARD ENGINE ---

  public setTrackVolume(type: SoundscapeType, volume: number) {
    const track = this.activeTracks.get(type);
    if (track && this.ctx) {
      track.volume = Math.max(0, Math.min(1, volume));
      track.gainNode.gain.setValueAtTime(track.volume * 0.35, this.ctx.currentTime);
    }
  }

  public toggleTrack(type: SoundscapeType, defaultVolume: number = 0.5) {
    if (this.isTrackActive(type)) {
      this.stopTrack(type);
    } else {
      this.startTrack(type, defaultVolume);
    }
  }

  public startTrack(type: SoundscapeType, volume: number = 0.5) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterAmbientGain) return;

    // If track already running, update volume
    if (this.activeTracks.has(type)) {
      this.setTrackVolume(type, volume);
      return;
    }

    const trackGain = this.ctx.createGain();
    trackGain.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);
    trackGain.connect(this.masterAmbientGain);

    const nodes: AudioNode[] = [];
    let timerInterval: NodeJS.Timeout | number | undefined;

    // Register track state immediately so activeTracks.has(type) is true during initial playback
    const trackState: ActiveTrackState = {
      nodes,
      gainNode: trackGain,
      volume,
    };
    this.activeTracks.set(type, trackState);
    this.currentSoundscape = type;

    try {
      if (type === 'brown_noise') {
        // Deep Natural Warm Brownian Noise
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.2;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);

        noiseNode.connect(filter);
        filter.connect(trackGain);
        noiseNode.start();
        nodes.push(noiseNode, filter);

      } else if (type === 'rain') {
        // Natural Soothing Rain: Warm low-frequency shower bed + gentle rain wave swell + acoustic droplet patter
        
        // Layer 1: Warm low-frequency rain shower base (smooth Brownian roll-off, eliminates TV static hiss)
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        let b0 = 0, b1 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.04 * white) / 1.04;
          b0 = 0.99 * b0 + white * 0.06;
          b1 = 0.95 * b1 + white * 0.12;
          data[i] = (lastOut * 2.2 + b0 * 0.4 + b1 * 0.2) * 0.16;
        }

        const rainSource = this.ctx.createBufferSource();
        rainSource.buffer = buffer;
        rainSource.loop = true;

        // Warm Lowpass filter removing all harsh high-frequency static
        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = 'lowpass';
        rainFilter.frequency.setValueAtTime(480, this.ctx.currentTime);
        rainFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

        // Gentle breathing rain swell LFO (8-second natural ebb & flow)
        const swellLfo = this.ctx.createOscillator();
        swellLfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
        const swellGain = this.ctx.createGain();
        swellGain.gain.setValueAtTime(140, this.ctx.currentTime);
        swellLfo.connect(swellGain);
        swellGain.connect(rainFilter.frequency);
        swellLfo.start();

        const rainBaseGain = this.ctx.createGain();
        rainBaseGain.gain.setValueAtTime(0.42, this.ctx.currentTime);

        rainSource.connect(rainFilter);
        rainFilter.connect(rainBaseGain);
        rainBaseGain.connect(trackGain);
        rainSource.start();
        nodes.push(rainSource, rainFilter, swellLfo, swellGain, rainBaseGain);

        // Layer 2: Natural Acoustic Raindrop Patter (Soft randomized water droplet impacts on leaves/window)
        const dropletGain = this.ctx.createGain();
        dropletGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        dropletGain.connect(trackGain);
        nodes.push(dropletGain);

        const playRainDrop = () => {
          if (!this.ctx || !this.activeTracks.has('rain')) return;
          try {
            const now = this.ctx.currentTime;
            // Play a cluster of 1-3 soft micro-droplets
            const dropCount = Math.floor(Math.random() * 3) + 1;
            for (let d = 0; d < dropCount; d++) {
              if (!this.ctx) return;
              const delay = d * (0.03 + Math.random() * 0.05);
              const osc = this.ctx.createOscillator();
              const g = this.ctx.createGain();

              // Resonant droplet pitch (800Hz - 1600Hz sliding down to simulate droplet splash)
              const startFreq = 750 + Math.random() * 700;
              osc.type = 'sine';
              osc.frequency.setValueAtTime(startFreq, now + delay);
              osc.frequency.exponentialRampToValueAtTime(startFreq * 0.55, now + delay + 0.035);

              const dropVol = 0.04 + Math.random() * 0.06;
              g.gain.setValueAtTime(0.0001, now + delay);
              g.gain.linearRampToValueAtTime(dropVol, now + delay + 0.004);
              g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.04);

              osc.connect(g);
              g.connect(dropletGain);
              osc.start(now + delay);
              osc.stop(now + delay + 0.045);
            }
          } catch {}
        };

        // Trigger immediate droplets
        playRainDrop();

        // Rhythmic organic rain interval
        timerInterval = setInterval(() => {
          playRainDrop();
        }, 110);

      } else if (type === 'forest') {
        // Natural Forest Canopy Breeze + Soothing Songbirds
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.997 * b0 + white * 0.05;
          b1 = 0.985 * b1 + white * 0.08;
          b2 = 0.950 * b2 + white * 0.15;
          data[i] = (b0 + b1 + b2) * 0.18;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // gentle breathing wind
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        const breezeGain = this.ctx.createGain();
        breezeGain.gain.setValueAtTime(0.28, this.ctx.currentTime);

        noiseNode.connect(filter);
        filter.connect(breezeGain);
        breezeGain.connect(trackGain);
        noiseNode.start();
        nodes.push(noiseNode, filter, lfo, lfoGain, breezeGain);

        // Dynamic, organic multi-tone songbirds
        const playBirdChirp = () => {
          if (!this.ctx || !this.activeTracks.has('forest')) return;
          try {
            const now = this.ctx.currentTime;
            const birdGain = this.ctx.createGain();
            birdGain.gain.setValueAtTime(0.22, now);
            birdGain.connect(trackGain);

            const patternType = Math.floor(Math.random() * 3);

            if (patternType === 0) {
              // Pattern 1: Sweet 3-step Warbler Trill
              const notes = [
                { f1: 2400, f2: 3200, time: 0, dur: 0.09 },
                { f1: 3300, f2: 4100, time: 0.11, dur: 0.1 },
                { f1: 3900, f2: 2700, time: 0.23, dur: 0.12 },
              ];
              notes.forEach(({ f1, f2, time, dur }) => {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f1, now + time);
                osc.frequency.exponentialRampToValueAtTime(f2, now + time + dur * 0.8);

                g.gain.setValueAtTime(0.001, now + time);
                g.gain.linearRampToValueAtTime(0.24, now + time + 0.02);
                g.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

                osc.connect(g);
                g.connect(birdGain);
                osc.start(now + time);
                osc.stop(now + time + dur + 0.02);
              });
            } else if (patternType === 1) {
              // Pattern 2: Forest Robin Melodic Whistle
              const osc = this.ctx.createOscillator();
              const g = this.ctx.createGain();
              osc.type = 'sine';
              const base = 2800 + Math.random() * 400;
              osc.frequency.setValueAtTime(base, now);
              osc.frequency.linearRampToValueAtTime(base + 700, now + 0.08);
              osc.frequency.exponentialRampToValueAtTime(base - 200, now + 0.22);

              const vib = this.ctx.createOscillator();
              const vibGain = this.ctx.createGain();
              vib.frequency.setValueAtTime(25, now);
              vibGain.gain.setValueAtTime(45, now);
              vib.connect(osc.frequency);
              vib.start(now);
              vib.stop(now + 0.25);

              g.gain.setValueAtTime(0.001, now);
              g.gain.linearRampToValueAtTime(0.26, now + 0.03);
              g.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

              osc.connect(g);
              g.connect(birdGain);
              osc.start(now);
              osc.stop(now + 0.26);
            } else {
              // Pattern 3: Playful Morning Peep (double chirp)
              [0, 0.12].forEach((offset) => {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'sine';
                const f = 3400 + Math.random() * 300;
                osc.frequency.setValueAtTime(f, now + offset);
                osc.frequency.exponentialRampToValueAtTime(f + 600, now + offset + 0.07);

                g.gain.setValueAtTime(0.001, now + offset);
                g.gain.linearRampToValueAtTime(0.20, now + offset + 0.02);
                g.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.08);

                osc.connect(g);
                g.connect(birdGain);
                osc.start(now + offset);
                osc.stop(now + offset + 0.09);
              });
            }
          } catch {}
        };

        // Welcome bird chirp
        setTimeout(() => {
          playBirdChirp();
        }, 150);

        timerInterval = setInterval(() => {
          playBirdChirp();
        }, 2400);

      } else if (type === 'lofi') {
        // Warm vinyl surface texture and low hum
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          last = (last + 0.015 * white) / 1.015;
          const crackle = Math.random() > 0.9992 ? (Math.random() * 2 - 1) * 0.4 : 0;
          data[i] = (last * 0.6 + crackle) * 0.15;
        }

        const vinylSource = this.ctx.createBufferSource();
        vinylSource.buffer = buffer;
        vinylSource.loop = true;

        const vinylFilter = this.ctx.createBiquadFilter();
        vinylFilter.type = 'bandpass';
        vinylFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
        vinylFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

        const vinylGain = this.ctx.createGain();
        vinylGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

        vinylSource.connect(vinylFilter);
        vinylFilter.connect(vinylGain);
        vinylGain.connect(trackGain);
        vinylSource.start();
        nodes.push(vinylSource, vinylFilter, vinylGain);

        // 4 Warm Lofi 7th/9th Rhodes jazz chords (Cmaj9 -> Am9 -> Dm9 -> G13)
        const chords = [
          [130.81, 196.00, 246.94, 329.63, 493.88], // Cmaj9
          [110.00, 164.81, 196.00, 261.63, 392.00], // Am9
          [146.83, 220.00, 261.63, 349.23, 440.00], // Dm9
          [98.00, 146.83, 196.00, 246.94, 349.23],  // G7(add9)
        ];
        let chordIdx = 0;

        const playChord = () => {
          if (!this.ctx || !this.activeTracks.has('lofi')) return;
          try {
            const freqs = chords[chordIdx % chords.length];
            chordIdx++;
            const now = this.ctx.currentTime;
            const chordDuration = 4.2;

            // Shared chord filter for vintage warm electric piano / tape tone
            const chordFilter = this.ctx.createBiquadFilter();
            chordFilter.type = 'lowpass';
            chordFilter.frequency.setValueAtTime(1400, now);
            chordFilter.Q.setValueAtTime(1.1, now);

            // Subtle tape pitch wow & flutter LFO
            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(0.32, now);
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(1.8, now);
            lfo.connect(lfoGain);
            lfo.start(now);
            lfo.stop(now + chordDuration + 0.2);

            const chordBus = this.ctx.createGain();
            chordBus.gain.setValueAtTime(0.001, now);
            chordBus.gain.linearRampToValueAtTime(0.28, now + 0.35);
            chordBus.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

            chordFilter.connect(chordBus);
            chordBus.connect(trackGain);

            freqs.forEach((freq, i) => {
              if (!this.ctx) return;
              // Primary warm sine voice
              const osc = this.ctx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now);
              lfoGain.connect(osc.frequency);

              // Secondary overtone for warm Rhodes chime body
              const overtone = this.ctx.createOscillator();
              overtone.type = 'triangle';
              overtone.frequency.setValueAtTime(freq, now);
              const overtoneGain = this.ctx.createGain();
              overtoneGain.gain.setValueAtTime(0.25, now);
              overtone.connect(overtoneGain);
              overtoneGain.connect(chordFilter);

              const voiceGain = this.ctx.createGain();
              const strumOffset = i * 0.018;
              voiceGain.gain.setValueAtTime(0.001, now + strumOffset);
              voiceGain.gain.linearRampToValueAtTime(0.22, now + strumOffset + 0.15);
              voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

              osc.connect(voiceGain);
              voiceGain.connect(chordFilter);

              osc.start(now + strumOffset);
              osc.stop(now + chordDuration + 0.1);
              overtone.start(now + strumOffset);
              overtone.stop(now + chordDuration + 0.1);
            });
          } catch {}
        };

        // Play first chord immediately
        playChord();
        // Crossfade seamlessly into next chord every 3.8 seconds
        timerInterval = setInterval(playChord, 3800);

      } else if (type === 'ocean') {
        // Organic Tidal Surf with gentle 7s swell
        const bufferSize = this.ctx.sampleRate * 5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99765 * b0 + white * 0.0990460;
          b1 = 0.96300 * b1 + white * 0.2965164;
          b2 = 0.57000 * b2 + white * 1.0526913;
          data[i] = (b0 + b1 + b2) * 0.09;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(260, this.ctx.currentTime);

        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.14, this.ctx.currentTime);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        noiseNode.connect(filter);
        filter.connect(trackGain);
        noiseNode.start();
        nodes.push(noiseNode, filter, lfo, lfoGain);

      } else if (type === 'binaural_10hz') {
        // 432Hz Calm Alpha Wave (432Hz Left, 442Hz Right = 10Hz Alpha pulse)
        const merger = this.ctx.createChannelMerger(2);

        const oscL = this.ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(432, this.ctx.currentTime);

        const gainL = this.ctx.createGain();
        gainL.gain.setValueAtTime(0.08, this.ctx.currentTime);
        oscL.connect(gainL);
        gainL.connect(merger, 0, 0);

        const oscR = this.ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(442, this.ctx.currentTime);

        const gainR = this.ctx.createGain();
        gainR.gain.setValueAtTime(0.08, this.ctx.currentTime);
        oscR.connect(gainR);
        gainR.connect(merger, 0, 1);

        merger.connect(trackGain);
        oscL.start();
        oscR.start();
        nodes.push(oscL, oscR, gainL, gainR, merger);
      }

      this.activeTracks.set(type, {
        nodes,
        gainNode: trackGain,
        volume,
        timerInterval,
      });
      this.currentSoundscape = type;

    } catch {}
  }

  public stopTrack(type: SoundscapeType) {
    const track = this.activeTracks.get(type);
    if (!track) return;

    if (track.timerInterval) {
      clearInterval(track.timerInterval as NodeJS.Timeout);
    }

    track.nodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {}
    });

    try {
      track.gainNode.disconnect();
    } catch {}

    this.activeTracks.delete(type);
    if (this.activeTracks.size === 0) {
      this.currentSoundscape = null;
    }
  }

  public stopAllTracks() {
    this.activeTracks.forEach((_, type) => {
      this.stopTrack(type);
    });
    this.currentSoundscape = null;
  }

  public startSoundscape(type: SoundscapeType, volume: number = 0.5) {
    this.stopAllTracks();
    this.startTrack(type, volume);
  }

  public stopSoundscape() {
    this.stopAllTracks();
  }

  // --- NATURAL ORGANIC SOUND EFFECTS ---

  // Water Drop Ripple Chime (for cheer / watering buddies)
  public playWaterDrop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150, now);
      osc.frequency.exponentialRampToValueAtTime(1780, now + 0.07);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // --- NATURAL ORGANIC SOUND EFFECTS ---

  // Natural Tibetan Singing Bowl / Wooden Chime (For starting focus)
  public playFocusStart() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Fundamental 432Hz + warm 864Hz harmonic
      [432, 864, 1296].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const vol = (idx === 0 ? 0.16 : idx === 1 ? 0.08 : 0.03) * this.sfxVolume;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch {}
  }

  // Natural Resonant Zen Gong (For timer completion)
  public playTimerFinish() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const harmonics = [
        { freq: 288, gain: 0.18, decay: 3.5 }, // D4 Zen root
        { freq: 432, gain: 0.14, decay: 3.2 }, // A4
        { freq: 576, gain: 0.09, decay: 2.8 }, // D5
        { freq: 864, gain: 0.05, decay: 2.2 }, // A5
      ];

      harmonics.forEach(({ freq, gain: baseGain, decay }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(baseGain * this.sfxVolume, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + decay + 0.1);
      });
    } catch {}
  }

  public playTaskPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

      gain.gain.setValueAtTime(0.12 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  public playTap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);

      gain.gain.setValueAtTime(0.06 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  public playLevelUp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [
        { freq: 440.0, time: 0.0 },
        { freq: 554.37, time: 0.07 },
        { freq: 659.25, time: 0.14 },
        { freq: 880.0, time: 0.22 },
        { freq: 1108.73, time: 0.32 },
        { freq: 1318.51, time: 0.42 }
      ];
      const now = this.ctx.currentTime;

      notes.forEach(({ freq, time }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        const startTime = now + time;
        const duration = 0.45;

        gain.gain.setValueAtTime(0.12 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {}
  }

  public playMilestoneFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        const startTime = now + idx * 0.08;
        const duration = 0.35;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12 * this.sfxVolume, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {}
  }

  public playStreakShield() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);

      gain.gain.setValueAtTime(0.14 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  public playWarning() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);

      gain.gain.setValueAtTime(0.08 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  // --- MEME SOUND EFFECTS SYNTHESIZERS ---

  // 1. Rickroll Melody Riff ("Never Gonna Give You Up")
  public playRickroll() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // F4, G4, Bb4, G4, D5, D5, C5, F4, G4, Bb4, G4, C5, C5, Bb4, A4, G4
      const notes = [
        { freq: 349.23, time: 0.00, dur: 0.12 }, // F4
        { freq: 392.00, time: 0.13, dur: 0.12 }, // G4
        { freq: 466.16, time: 0.26, dur: 0.14 }, // Bb4
        { freq: 392.00, time: 0.41, dur: 0.12 }, // G4
        { freq: 587.33, time: 0.54, dur: 0.20 }, // D5
        { freq: 587.33, time: 0.76, dur: 0.20 }, // D5
        { freq: 523.25, time: 0.98, dur: 0.35 }, // C5
      ];

      notes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + time);

        const startTime = now + time;
        gain.gain.setValueAtTime(0.16 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.05);
      });
    } catch {}
  }

  // 2. Leonardo DiCaprio / Chuckle Laughter Synth
  public playLeoLaugh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chuckles = [0, 0.1, 0.2, 0.3, 0.42, 0.55];
      chuckles.forEach((t, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const startPitch = 600 + (idx % 2) * 120;
        osc.frequency.setValueAtTime(startPitch, now + t);
        osc.frequency.exponentialRampToValueAtTime(startPitch - 140, now + t + 0.08);

        const startTime = now + t;
        gain.gain.setValueAtTime(0.15 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.09);
      });
    } catch {}
  }

  // 3. Vine Boom Sub-Drop
  public playVineBoom() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.55);

      gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {}
  }

  // 4. Bruh Low Synth
  public playBruh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(165, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.38);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  // 5. Airhorn Triple Burst
  public playAirhorn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bursts = [0, 0.11, 0.22, 0.35];
      const freqs = [466.16, 466.16, 466.16, 622.25];

      bursts.forEach((timeOffset, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freqs[idx], now + timeOffset);

        const startTime = now + timeOffset;
        const duration = idx === 3 ? 0.35 : 0.08;

        gain.gain.setValueAtTime(0.2 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {}
  }

  // 6. Sad Trombone (Wah Wah Wah)
  public playSadTrombone() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [
        { freq: 293.66, dur: 0.25, time: 0 },
        { freq: 277.18, dur: 0.25, time: 0.28 },
        { freq: 261.63, dur: 0.25, time: 0.56 },
        { freq: 246.94, dur: 0.65, time: 0.84 }
      ];

      notes.forEach(({ freq, dur, time }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);
        if (dur > 0.4) {
          osc.frequency.linearRampToValueAtTime(freq - 18, now + time + dur);
        }

        const startTime = now + time;
        gain.gain.setValueAtTime(0.18 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    } catch {}
  }

  // 7. Mario Coin
  public playMarioCoin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {}
  }

  // 8. Emotional Damage Punch
  public playEmotionalDamage() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.45);

      gain.gain.setValueAtTime(0.28 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {}
  }

  // 9. Pedro Pedro Pedro Raccoon Dance
  public playPedroDance() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Fast catchy triplet bounce
      const notes = [
        { freq: 440, time: 0.00, dur: 0.1 },
        { freq: 440, time: 0.12, dur: 0.1 },
        { freq: 493.88, time: 0.24, dur: 0.1 },
        { freq: 523.25, time: 0.36, dur: 0.18 },
        { freq: 440, time: 0.56, dur: 0.14 },
      ];

      notes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        const startTime = now + time;
        gain.gain.setValueAtTime(0.16 * this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    } catch {}
  }

  // 10. Tibetan Resonant Singing Bowl (Mindfulness & Breathwork)
  public playSingingBowl() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 432; // Sacred harmonic pitch

      // Harmonics array
      const harmonics = [
        { mult: 1.0, gain: 0.22, decay: 4.8 },
        { mult: 2.02, gain: 0.12, decay: 3.8 },
        { mult: 2.98, gain: 0.07, decay: 2.9 },
        { mult: 4.04, gain: 0.04, decay: 2.2 },
      ];

      harmonics.forEach(({ mult, gain: maxGain, decay }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * mult, now);

        // Subtle slow warmth vibrato
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(4.5, now);
        lfoGain.gain.setValueAtTime(1.5, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + decay);

        // Exponential warm decay
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(maxGain * this.sfxVolume, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + decay + 0.1);
      });
    } catch {}
  }

  // 11. Shuffling / Card Flip Tactile Swish
  public playCardFlip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  // 12. Plant Watering Garden Splash
  public playWaterSplash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const pitches = [520, 680, 840, 960];
      pitches.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const offset = idx * 0.04;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + offset + 0.08);

        gain.gain.setValueAtTime(0.12 * this.sfxVolume, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
    } catch {}
  }

  // Master Meme Dispatcher
  public playMemeSound(type: string) {
    this.unlockAudio();
    switch (type) {
      case 'rickroll':
        this.playRickroll();
        break;
      case 'leo_laugh':
      case 'laugh':
        this.playLeoLaugh();
        break;
      case 'pedro':
        this.playPedroDance();
        break;
      case 'emotional_damage':
      case 'damage':
        this.playEmotionalDamage();
        break;
      case 'vine_boom':
        this.playVineBoom();
        break;
      case 'bruh':
        this.playBruh();
        break;
      case 'airhorn':
        this.playAirhorn();
        break;
      case 'sad_trombone':
        this.playSadTrombone();
        break;
      case 'mario_coin':
        this.playMarioCoin();
        break;
      case 'pop':
        this.playTaskPop();
        break;
      case 'level_up':
        this.playLevelUp();
        break;
      case 'fanfare':
        this.playMilestoneFanfare();
        break;
      default:
        this.playTaskPop();
        break;
    }
  }
}

export const sounds = new SoundEngine();
