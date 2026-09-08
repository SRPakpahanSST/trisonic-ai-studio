// ============================================================
// chordProgression.js - Chord Progression Generator
// TriSonic AI Studio
// ============================================================

class ChordProgression {
    constructor() {
        this.chords = [];
        this.key = 'E';
        this.scaleType = 'mayor';
    }

    /**
     * Analisis progresi dari sequence nada
     * @param {Array} notes - Array nama nada (contoh: ['E4', 'G4', 'A4'])
     * @returns {Object} { key, scale, chords }
     */
    analyze(notes) {
        if (!notes || notes.length < 3) {
            return { key: 'E', scale: 'Mayor', chords: [] };
        }
        
        // Count frequency of each note
        const freqCount = {};
        notes.forEach(n => {
            const noteName = n.replace(/[0-9]/g, '');
            freqCount[noteName] = (freqCount[noteName] || 0) + 1;
        });
        
        // Find most frequent note as key
        let maxCount = 0;
        let key = 'E';
        for (const [note, count] of Object.entries(freqCount)) {
            if (count > maxCount) {
                maxCount = count;
                key = note;
            }
        }
        
        // Determine scale type
        const scale = this.determineScale(notes);
        this.key = key;
        this.scaleType = scale;
        
        // Build chords
        this.chords = this.buildChords(key, scale);
        
        return {
            key: key,
            scale: scale === 'mayor' ? 'Mayor' : 'Minor',
            chords: this.chords
        };
    }

    /**
     * Menentukan jenis skala
     */
    determineScale(notes) {
        const noteNames = notes.map(n => n.replace(/[0-9]/g, ''));
        const scaleNotes = window.buildScale ? window.buildScale('E', 'mayor') : ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'A', 'B', 'C', 'D'];
        const minorScaleNotes = window.buildScale ? window.buildScale('A', 'minor') : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
        
        let mayorMatch = 0;
        let minorMatch = 0;
        
        noteNames.forEach(n => {
            if (scaleNotes.includes(n)) mayorMatch++;
            if (minorScaleNotes.includes(n)) minorMatch++;
        });
        
        return minorMatch > mayorMatch ? 'minor' : 'mayor';
    }

    /**
     * Membangun akord
     */
    buildChords(key, scaleType) {
        const rootIdx = window.getNoteIndex ? window.getNoteIndex(key) : 0;
        const intervals = scaleType === 'minor' ? 
            (window.MINOR_INTERVALS || [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2]) : 
            (window.MAYOR_INTERVALS || [2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1]);
        
        const scale = [key];
        let current = rootIdx;
        for (const step of intervals) {
            current = (current + step) % 20;
            scale.push(window.getNoteName ? window.getNoteName(current) : 'E');
        }
        
        const chords = [];
        const romanMap = {
            'mayor': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
            'minor': ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
        };
        const roman = romanMap[scaleType] || romanMap['mayor'];
        
        for (let i = 0; i < Math.min(7, scale.length); i++) {
            const root = scale[i];
            const rootIdx2 = window.getNoteIndex ? window.getNoteIndex(root) : 0;
            const thirdIdx = (rootIdx2 + 4) % 20;
            const thirdName = window.getNoteName ? window.getNoteName(thirdIdx) : 'E';
            const isMajor = scale.includes(thirdName);
            const fifthIdx = (rootIdx2 + 7) % 20;
            const fifthName = window.getNoteName ? window.getNoteName(fifthIdx) : 'E';
            const isDiminished = !scale.includes(fifthName);
            
            let type = 'mayor';
            if (isDiminished) type = 'diminished';
            else if (!isMajor) type = 'minor';
            
            const chordNotes = window.buildChord ? window.buildChord(root, type) : [root, thirdName, fifthName];
            const typeSymbol = type === 'mayor' ? '' : (type === 'minor' ? 'm' : '°');
            
            chords.push({
                root: root,
                type: type,
                symbol: root + typeSymbol,
                roman: roman[i] || '',
                notes: chordNotes
            });
        }
        
        return chords;
    }

    /**
     * Mendapatkan rekomendasi progresi
     */
    getRecommendation() {
        if (this.chords.length === 0) return [];
        
        const commonProgressions = {
            'mayor': [
                ['I', 'IV', 'V', 'I'],
                ['I', 'vi', 'IV', 'V'],
                ['I', 'V', 'vi', 'IV'],
                ['I', 'IV', 'I', 'V']
            ],
            'minor': [
                ['i', 'iv', 'v', 'i'],
                ['i', 'VI', 'III', 'VII'],
                ['i', 'iv', 'VII', 'III'],
                ['i', 'v', 'VI', 'iv']
            ]
        };
        
        const progressions = commonProgressions[this.scaleType] || commonProgressions['mayor'];
        const chordMap = {};
        this.chords.forEach(c => {
            chordMap[c.roman] = c;
        });
        
        const recommendations = progressions.map(prog => {
            return prog.map(roman => chordMap[roman] || null).filter(c => c !== null);
        }).filter(p => p.length > 0);
        
        return recommendations;
    }
}

// Export untuk browser
if (typeof window !== 'undefined') {
    window.ChordProgression = ChordProgression;
}