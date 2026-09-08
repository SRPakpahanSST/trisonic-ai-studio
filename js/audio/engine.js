// ============================================================
// engine.js - AudioContext, Oscillators, Reverb, Delay
// TriSonic AI Studio
// ============================================================

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.reverbNode = null;
        this.delayNode = null;
        this.oscillator = null;
        this.gainNode = null;
        this.isPlaying = false;
        this.activeNotes = new Map(); // key: noteName, value: { osc, gain }
        
        // Default settings
        this.settings = {
            volume: 0.7,
            reverb: 0.3,
            delay: 0.2,
            waveform: 'sine',
            masterVolume: 0.8,
        };
        
        this.initialized = false;
    }
    
    /**
     * Inisialisasi Audio Context
     */
    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Master Gain
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.settings.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            // Reverb (sederhana menggunakan Convolver atau Gain + Delay)
            this.reverbNode = this.audioContext.createGain();
            this.reverbNode.gain.value = this.settings.reverb;
            
            // Delay
            this.delayNode = this.audioContext.createDelay(2);
            this.delayNode.delayTime.value = 0.3;
            
            // Feedback delay dengan gain
            const delayFeedback = this.audioContext.createGain();
            delayFeedback.gain.value = 0.3;
            
            this.delayNode.connect(delayFeedback);
            delayFeedback.connect(this.delayNode);
            
            // Hubungkan reverb ke master
            this.reverbNode.connect(this.masterGain);
            this.delayNode.connect(this.masterGain);
            
            this.initialized = true;
            console.log('Audio Engine initialized');
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
        }
    }
    
    /**
     * Resume AudioContext (dipanggil saat interaksi user)
     */
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    /**
     * Memainkan nada
     * @param {string} noteName - Nama nada (contoh: "C4")
     * @param {number} frequency - Frekuensi dalam Hz
     * @param {number} duration - Durasi dalam detik (opsional)
     */
    playNote(noteName, frequency, duration = null) {
        if (!this.initialized) this.init();
        if (!this.audioContext) return;
        
        this.resume();
        
        // Hentikan note yang sama jika sedang dimainkan
        this.stopNote(noteName);
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = this.settings.waveform;
        osc.frequency.value = frequency;
        
        // Envelope
        const now = this.audioContext.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.settings.volume * 0.8, now + 0.01);
        gain.gain.setValueAtTime(this.settings.volume * 0.8, now + 0.1);
        
        // Hubungkan
        osc.connect(gain);
        gain.connect(this.masterGain);
        // Juga sambungkan ke reverb dan delay
        gain.connect(this.reverbNode);
        gain.connect(this.delayNode);
        
        osc.start(now);
        
        if (duration) {
            // Release
            const releaseTime = now + duration - 0.05;
            gain.gain.setValueAtTime(this.settings.volume * 0.8, releaseTime);
            gain.gain.linearRampToValueAtTime(0, releaseTime + 0.05);
            osc.stop(releaseTime + 0.05);
        }
        
        // Simpan referensi
        this.activeNotes.set(noteName, { osc, gain });
        this.isPlaying = true;
        
        return { osc, gain };
    }
    
    /**
     * Menghentikan nada
     * @param {string} noteName - Nama nada
     */
    stopNote(noteName) {
        const note = this.activeNotes.get(noteName);
        if (note) {
            try {
                const now = this.audioContext.currentTime;
                note.gain.gain.setValueAtTime(note.gain.gain.value, now);
                note.gain.gain.linearRampToValueAtTime(0, now + 0.05);
                note.osc.stop(now + 0.05);
            } catch (e) {
                // Ignore
            }
            this.activeNotes.delete(noteName);
        }
        
        if (this.activeNotes.size === 0) {
            this.isPlaying = false;
        }
    }
    
    /**
     * Menghentikan semua nada
     */
    stopAll() {
        for (const [noteName] of this.activeNotes) {
            this.stopNote(noteName);
        }
        this.isPlaying = false;
    }
    
    /**
     * Memainkan komposisi (sequence)
     * @param {Array} sequence - Array dari { note, frequency, duration }
     * @param {Function} onComplete - Callback setelah selesai
     */
    playSequence(sequence, onComplete = null) {
        if (!sequence || sequence.length === 0) return;
        
        this.stopAll();
        this.resume();
        
        let currentIndex = 0;
        const playNext = () => {
            if (currentIndex >= sequence.length) {
                if (onComplete) onComplete();
                return;
            }
            
            const item = sequence[currentIndex];
            const { note, frequency, duration } = item;
            
            if (frequency > 0) {
                this.playNote(note, frequency, duration);
            }
            
            currentIndex++;
            const nextDelay = duration || 0.3;
            setTimeout(playNext, nextDelay * 1000 + 50); // +50ms untuk gap
        };
        
        playNext();
    }
    
    /**
     * Set volume master
     * @param {number} value - 0-1
     */
    setVolume(value) {
        this.settings.volume = Math.max(0, Math.min(1, value));
        if (this.masterGain) {
            this.masterGain.gain.value = this.settings.masterVolume * this.settings.volume;
        }
    }
    
    /**
     * Set reverb
     * @param {number} value - 0-1
     */
    setReverb(value) {
        this.settings.reverb = Math.max(0, Math.min(1, value));
        if (this.reverbNode) {
            this.reverbNode.gain.value = this.settings.reverb * 0.5;
        }
    }
    
    /**
     * Set waveform
     * @param {string} type - 'sine', 'square', 'sawtooth', 'triangle'
     */
    setWaveform(type) {
        this.settings.waveform = type;
    }
    
    /**
     * Get state
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            activeNotes: this.activeNotes.size,
            waveform: this.settings.waveform,
            volume: this.settings.volume,
            reverb: this.settings.reverb,
        };
    }
}

// Singleton
const audioEngine = new AudioEngine();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = audioEngine;
}