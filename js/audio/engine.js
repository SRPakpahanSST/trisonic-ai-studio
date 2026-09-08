// ============================================================
// engine.js - Audio Engine (Web Audio API)
// TriSonic AI Studio
// ============================================================

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.reverbNode = null;
        this.reverbGain = null;
        this.delayNode = null;
        this.delayGain = null;
        this.activeOscillators = [];
        this.settings = {
            volume: 0.7,
            reverb: 0.3,
            waveform: 'sine',
            masterVolume: 0.8
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
            this.masterGain.gain.value = this.settings.masterVolume * this.settings.volume;
            this.masterGain.connect(this.audioContext.destination);
            
            // Reverb (sederhana dengan Gain)
            this.reverbNode = this.audioContext.createGain();
            this.reverbGain = this.audioContext.createGain();
            this.reverbGain.gain.value = this.settings.reverb * 0.3;
            this.reverbNode.connect(this.reverbGain);
            this.reverbGain.connect(this.masterGain);
            
            // Delay sederhana
            this.delayNode = this.audioContext.createDelay(1.5);
            this.delayNode.delayTime.value = 0.3;
            const delayFeedback = this.audioContext.createGain();
            delayFeedback.gain.value = 0.2;
            this.delayNode.connect(delayFeedback);
            delayFeedback.connect(this.delayNode);
            
            this.initialized = true;
            console.log('✅ Audio Engine initialized');
        } catch (error) {
            console.error('❌ Failed to initialize AudioContext:', error);
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
     * @param {string} noteName - Nama nada (contoh: "A4")
     * @param {number} frequency - Frekuensi dalam Hz
     * @param {number} duration - Durasi dalam detik (opsional)
     * @param {string} waveform - Tipe waveform (opsional)
     * @returns {Object} { osc, gain }
     */
    playNote(noteName, frequency, duration = null, waveform = null) {
        if (!this.initialized) this.init();
        if (!this.audioContext) return null;
        
        this.resume();
        
        // Hentikan note yang sama jika sedang dimainkan
        this.stopNote(noteName);
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = waveform || this.settings.waveform;
        osc.frequency.value = frequency;
        
        const now = this.audioContext.currentTime;
        
        // Envelope ADSR
        const attack = 0.01;
        const decay = 0.1;
        const sustain = 0.3;
        const release = 0.05;
        const volume = this.settings.volume * 0.7;
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + attack);
        gain.gain.exponentialRampToValueAtTime(volume * sustain, now + attack + decay);
        
        // Hubungkan
        osc.connect(gain);
        gain.connect(this.masterGain);
        gain.connect(this.reverbNode);
        gain.connect(this.delayNode);
        
        osc.start(now);
        
        if (duration) {
            const releaseTime = now + duration - release;
            gain.gain.setValueAtTime(volume * sustain, releaseTime);
            gain.gain.exponentialRampToValueAtTime(0.001, releaseTime + release);
            osc.stop(releaseTime + release);
        }
        
        // Simpan referensi
        this.activeOscillators.push({ osc, gain, noteName });
        
        // Cleanup setelah selesai
        osc.onended = () => {
            this.activeOscillators = this.activeOscillators.filter(
                item => item.osc !== osc
            );
        };
        
        return { osc, gain };
    }

    /**
     * Menghentikan nada
     * @param {string} noteName - Nama nada
     */
    stopNote(noteName) {
        this.activeOscillators = this.activeOscillators.filter(item => {
            if (item.noteName === noteName) {
                try {
                    item.osc.stop();
                } catch (e) {}
                return false;
            }
            return true;
        });
    }

    /**
     * Menghentikan semua nada
     */
    stopAll() {
        this.activeOscillators.forEach(item => {
            try {
                item.osc.stop();
            } catch (e) {}
        });
        this.activeOscillators = [];
    }

    /**
     * Memainkan sequence (komposisi)
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
            if (item.frequency > 0) {
                this.playNote(item.note, item.frequency, item.duration);
            }
            
            currentIndex++;
            const nextDelay = (item.duration || 0.3) * 1000 + 50;
            setTimeout(playNext, nextDelay);
        };
        
        playNext();
    }

    /**
     * Set volume
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
        if (this.reverbGain) {
            this.reverbGain.gain.value = this.settings.reverb * 0.3;
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
     * Mendapatkan state
     */
    getState() {
        return {
            isPlaying: this.activeOscillators.length > 0,
            activeNotes: this.activeOscillators.length,
            waveform: this.settings.waveform,
            volume: this.settings.volume,
            reverb: this.settings.reverb
        };
    }
}

// Singleton instance
const audioEngine = new AudioEngine();

// Export untuk browser
if (typeof window !== 'undefined') {
    window.audioEngine = audioEngine;
    window.AudioEngine = AudioEngine;
}