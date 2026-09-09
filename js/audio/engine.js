// ================================================================
// engine.js - Audio Engine (Web Audio API)
// TriSonic AI Studio
// ================================================================

function AudioEngine() {
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

AudioEngine.prototype.init = function() {
    if (this.initialized) return;
    
    try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = this.settings.masterVolume * this.settings.volume;
        this.masterGain.connect(this.audioContext.destination);
        
        // Reverb sederhana
        this.reverbGain = this.audioContext.createGain();
        this.reverbGain.gain.value = this.settings.reverb * 0.3;
        this.reverbGain.connect(this.masterGain);
        
        this.initialized = true;
        console.log('✅ Audio Engine initialized');
    } catch (error) {
        console.error('❌ Failed to initialize AudioContext:', error);
    }
};

AudioEngine.prototype.resume = function() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
    }
};

AudioEngine.prototype.playNote = function(noteName, frequency, duration) {
    if (!this.initialized) this.init();
    if (!this.audioContext) return null;
    
    this.resume();
    this.stopNote(noteName);
    
    var osc = this.audioContext.createOscillator();
    var gain = this.audioContext.createGain();
    
    osc.type = this.settings.waveform;
    osc.frequency.value = frequency;
    
    var now = this.audioContext.currentTime;
    var volume = this.settings.volume * 0.7;
    var dur = duration || 0.8;
    
    // ADSR Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(volume * 0.3, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur - 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    gain.connect(this.reverbGain);
    
    osc.start(now);
    osc.stop(now + dur);
    
    this.activeOscillators.push(osc);
    
    var self = this;
    osc.onended = function() {
        self.activeOscillators = self.activeOscillators.filter(function(o) {
            return o !== osc;
        });
    };
    
    console.log('🔊 Memainkan: ' + noteName + ' (' + frequency.toFixed(2) + ' Hz)');
    return { osc: osc, gain: gain };
};

AudioEngine.prototype.stopNote = function(noteName) {
    // Note berhenti otomatis karena durasi terbatas
};

AudioEngine.prototype.stopAll = function() {
    this.activeOscillators.forEach(function(osc) {
        try { osc.stop(); } catch (e) {}
    });
    this.activeOscillators = [];
};

AudioEngine.prototype.setVolume = function(value) {
    this.settings.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain) {
        this.masterGain.gain.value = this.settings.masterVolume * this.settings.volume;
    }
};

AudioEngine.prototype.setReverb = function(value) {
    this.settings.reverb = Math.max(0, Math.min(1, value));
    if (this.reverbGain) {
        this.reverbGain.gain.value = this.settings.reverb * 0.3;
    }
};

AudioEngine.prototype.setWaveform = function(type) {
    this.settings.waveform = type;
};

// Singleton
var audioEngine = new AudioEngine();

if (typeof window !== 'undefined') {
    window.audioEngine = audioEngine;
    window.AudioEngine = AudioEngine;
}

console.log('✅ engine.js loaded');