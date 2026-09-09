// ================================================================
// engine.js - Audio Engine
// TriSonic AI Studio
// ================================================================

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.reverbGain = null;
        this.activeOscillators = [];
        this.settings = {
            volume: 0.7,
            reverb: 0.3,
            waveform: 'sine',
            masterVolume: 0.8
        };
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.settings.masterVolume * this.settings.volume;
            this.masterGain.connect(this.audioContext.destination);
            
            this.reverbGain = this.audioContext.createGain();
            this.reverbGain.gain.value = this.settings.reverb * 0.3;
            this.reverbGain.connect(this.masterGain);
            
            this.initialized = true;
            console.log('✅ Audio Engine initialized');
        } catch (error) {
            console.error('❌ Failed to initialize AudioContext:', error);
        }
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    playNote(noteName, frequency, duration = 0.8) {
        if (!this.initialized) this.init();
        if (!this.audioContext) return null;
        
        this.resume();
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = this.settings.waveform;
        osc.frequency.value = frequency;
        
        const now = this.audioContext.currentTime;
        const volume = this.settings.volume * 0.7;
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(volume * 0.3, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.05);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        gain.connect(this.reverbGain);
        
        osc.start(now);
        osc.stop(now + duration);
        
        this.activeOscillators.push(osc);
        
        osc.onended = () => {
            this.activeOscillators = this.activeOscillators.filter(o => o !== osc);
        };
        
        return { osc, gain };
    }

    stopAll() {
        this.activeOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
        });
        this.activeOscillators = [];
    }

    setVolume(value) {
        this.settings.volume = Math.max(0, Math.min(1, value));
        if (this.masterGain) {
            this.masterGain.gain.value = this.settings.masterVolume * this.settings.volume;
        }
    }

    setReverb(value) {
        this.settings.reverb = Math.max(0, Math.min(1, value));
        if (this.reverbGain) {
            this.reverbGain.gain.value = this.settings.reverb * 0.3;
        }
    }

    setWaveform(type) {
        this.settings.waveform = type;
    }
}

const audioEngine = new AudioEngine();

if (typeof window !== 'undefined') {
    window.audioEngine = audioEngine;
    window.AudioEngine = AudioEngine;
}

console.log('✅ engine.js loaded');