// ============================================================
// aiComposer.js - Logika AI Composer
// TriSonic AI Studio
// ============================================================

class AIComposer {
    constructor() {
        this.audioEngine = null;
        this.currentComposition = [];
        this.isPlaying = false;
        this.compositionTimeout = null;
        this.sequenceIndex = 0;
    }
    
    /**
     * Inisialisasi dengan AudioEngine
     */
    init(audioEngine) {
        this.audioEngine = audioEngine;
    }
    
    /**
     * Generate komposisi berdasarkan genre dan parameter
     * @param {string} genre - 'classical', 'jazz', 'ambient', 'ethnic', 'experimental'
     * @param {number} length - Jumlah nada
     * @param {number} tempo - BPM
     * @param {number} baseOctave - Oktaf dasar
     * @returns {Array} Array dari { note, frequency, duration }
     */
    generateComposition(genre = 'classical', length = 8, tempo = 120, baseOctave = 4) {
        const composition = [];
        const noteDuration = 60 / tempo; // durasi per ketuk dalam detik
        
        // Genre-specific patterns
        const patterns = {
            classical: {
                intervals: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 18, 19],
                rhythm: [1, 0.5, 1, 0.5, 1, 1, 0.5, 0.5],
                range: [-5, 5],
                repeatChance: 0.3,
            },
            jazz: {
                intervals: [0, 3, 4, 7, 8, 10, 12, 14, 15, 17, 19],
                rhythm: [1.5, 0.5, 0.75, 0.25, 1, 0.5, 1.5],
                range: [-3, 7],
                repeatChance: 0.2,
            },
            ambient: {
                intervals: [0, 2, 4, 7, 9, 12, 14, 16, 19],
                rhythm: [2, 1, 2, 2, 1, 2, 1],
                range: [-2, 4],
                repeatChance: 0.5,
            },
            ethnic: {
                intervals: [0, 1, 3, 5, 7, 8, 10, 12, 13, 15, 17],
                rhythm: [1, 0.5, 0.5, 1, 0.5, 0.5, 1],
                range: [-4, 4],
                repeatChance: 0.25,
            },
            experimental: {
                intervals: [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 19],
                rhythm: [0.5, 0.75, 0.25, 1.5, 0.5, 0.25, 0.75, 1],
                range: [-6, 6],
                repeatChance: 0.15,
            }
        };
        
        const pattern = patterns[genre] || patterns.classical;
        const totalNotes = Math.max(4, length);
        let currentNote = 7; // Mulai dari A (index 7 dalam 20-note)
        let prevNote = currentNote;
        
        for (let i = 0; i < totalNotes; i++) {
            // Pilih interval dari pattern
            let intervalIndex = Math.floor(Math.random() * pattern.intervals.length);
            let interval = pattern.intervals[intervalIndex];
            
            // Arah: naik atau turun
            const direction = Math.random() > 0.5 ? 1 : -1;
            let newNote = currentNote + (direction * interval);
            
            // Batasi dalam range
            const minNote = 0;
            const maxNote = 19;
            if (newNote < minNote) newNote = minNote + Math.floor(Math.random() * 5);
            if (newNote > maxNote) newNote = maxNote - Math.floor(Math.random() * 5);
            
            // Chance untuk mengulang nada sebelumnya
            if (Math.random() < pattern.repeatChance && i > 0) {
                newNote = prevNote;
            }
            
            // Oktaf
            const octaveShift = Math.floor(Math.random() * (pattern.range[1] - pattern.range[0] + 1)) + pattern.range[0];
            const octave = baseOctave + Math.floor(octaveShift / 20);
            const noteIndex = ((newNote % 20) + 20) % 20;
            
            // Durasi
            const rhythmIndex = i % pattern.rhythm.length;
            const duration = pattern.rhythm[rhythmIndex] * noteDuration;
            
            // Nama dan frekuensi
            const noteObj = getNoteByIndex ? getNoteByIndex(noteIndex) : { name: 'C' };
            const noteName = noteObj.name + octave;
            const freq = getFrequency ? getFrequency(noteIndex, octave) : 440;
            
            composition.push({
                note: noteName,
                frequency: freq,
                duration: duration,
                index: noteIndex,
                octave: octave,
            });
            
            prevNote = currentNote;
            currentNote = newNote;
        }
        
        this.currentComposition = composition;
        return composition;
    }
    
    /**
     * Memainkan komposisi
     * @param {Array} composition - Array dari komposisi
     * @param {Function} onNotePlay - Callback per nada
     * @param {Function} onComplete - Callback selesai
     */
    playComposition(composition, onNotePlay = null, onComplete = null) {
        if (!this.audioEngine) return;
        if (!composition || composition.length === 0) return;
        
        this.stopComposition();
        this.audioEngine.resume();
        
        this.isPlaying = true;
        this.sequenceIndex = 0;
        
        const playNext = () => {
            if (!this.isPlaying || this.sequenceIndex >= composition.length) {
                this.isPlaying = false;
                if (onComplete) onComplete();
                return;
            }
            
            const item = composition[this.sequenceIndex];
            if (onNotePlay) onNotePlay(item, this.sequenceIndex);
            
            // Mainkan nada
            if (item.frequency > 0) {
                this.audioEngine.playNote(item.note, item.frequency, item.duration);
            }
            
            this.sequenceIndex++;
            const delay = Math.max(0.05, item.duration * 1000);
            this.compositionTimeout = setTimeout(playNext, delay);
        };
        
        playNext();
    }
    
    /**
     * Menghentikan komposisi
     */
    stopComposition() {
        this.isPlaying = false;
        if (this.compositionTimeout) {
            clearTimeout(this.compositionTimeout);
            this.compositionTimeout = null;
        }
        if (this.audioEngine) {
            this.audioEngine.stopAll();
        }
        this.sequenceIndex = 0;
    }
    
    /**
     * Mendapatkan statistik komposisi
     */
    getCompositionStats(composition) {
        if (!composition || composition.length === 0) return null;
        
        const totalDuration = composition.reduce((sum, item) => sum + item.duration, 0);
        const uniqueNotes = new Set(composition.map(item => item.note));
        
        return {
            totalNotes: composition.length,
            totalDuration: totalDuration.toFixed(2),
            uniqueNotes: uniqueNotes.size,
            tempo: Math.round(60 / (composition.reduce((sum, item) => sum + item.duration, 0) / composition.length)),
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIComposer;
}