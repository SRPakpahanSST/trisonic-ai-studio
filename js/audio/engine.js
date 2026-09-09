// ================================================================
// engine.js - Audio Engine
// ================================================================

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.reverbGain = null;
        this.activeOscillators = [];
        this.settings = { volume: 0.7, reverb: 0.3, waveform: 'sine', masterVolume: 0.8 };
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

    playNote(noteName, frequency, duration = 0.8, waveform = null) {
        if (!this.initialized) this.init();
        if (!this.audioContext) return null;
        this.resume();
        this.stopNote(noteName);
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = waveform || this.settings.waveform;
        osc.frequency.value = frequency;
        
        const now = this.audioContext.currentTime;
        const volume = this.settings.volume * 0.7;
        const attack = 0.01, decay = 0.1, sustain = 0.3, release = 0.05;
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + attack);
        gain.gain.exponentialRampToValueAtTime(volume * sustain, now + attack + decay);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        gain.connect(this.reverbGain);
        osc.start(now);
        
        if (duration) {
            const releaseTime = now + duration - release;
            gain.gain.setValueAtTime(volume * sustain, releaseTime);
            gain.gain.exponentialRampToValueAtTime(0.001, releaseTime + release);
            osc.stop(releaseTime + release);
        }
        
        this.activeOscillators.push({ osc, gain, noteName });
        osc.onended = () => {
            this.activeOscillators = this.activeOscillators.filter(item => item.osc !== osc);
        };
        return { osc, gain };
    }

    stopNote(noteName) {
        this.activeOscillators = this.activeOscillators.filter(item => {
            if (item.noteName === noteName) {
                try { item.osc.stop(); } catch (e) {}
                return false;
            }
            return true;
        });
    }

    stopAll() {
        this.activeOscillators.forEach(item => { try { item.osc.stop(); } catch (e) {} });
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
window.audioEngine = audioEngine;
window.AudioEngine = AudioEngine;
console.log('✅ engine.js loaded');