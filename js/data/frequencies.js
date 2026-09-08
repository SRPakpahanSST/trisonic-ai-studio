// ============================================================
// frequencies.js - Frekuensi 20 Nada per Oktaf (5 Oktaf: C2-D6)
// TriSonic AI Studio
// ============================================================

const A4_FREQ = 440;
const NOTES_PER_OCTAVE = 20;
const RATIO = Math.pow(2, 1 / NOTES_PER_OCTAVE);
const A4_INDEX = 13; // A = index 13 pada skala Mayor

/**
 * Menghitung frekuensi dari index dan oktaf
 * Rumus: f = 440 * 2^(n/20) dimana n = (oktaf * 20 + index) - (4 * 20 + 13)
 */
function getFrequency(index, octave) {
    const midiNumber = (octave * NOTES_PER_OCTAVE) + index;
    const midiA4 = (4 * NOTES_PER_OCTAVE) + A4_INDEX;
    const semitoneDiff = midiNumber - midiA4;
    return A4_FREQ * Math.pow(RATIO, semitoneDiff);
}

/**
 * Mendapatkan frekuensi dari nama nada
 */
function getFrequencyFromNote(noteName) {
    const match = noteName.match(/^([A-Z#]+)(\d+)$/);
    if (!match) return 0;
    const [, note, octave] = match;
    const index = window.getNoteIndex ? window.getNoteIndex(note) : 0;
    return getFrequency(index, parseInt(octave));
}

/**
 * Menghasilkan semua frekuensi untuk 5 oktaf (C2 - D6)
 */
function generateAllFrequencies() {
    const freqMap = {};
    const startOctave = 2;
    const endOctave = 6;
    
    for (let octave = startOctave; octave <= endOctave; octave++) {
        for (let index = 0; index < NOTES_PER_OCTAVE; index++) {
            const noteName = window.getNoteName ? window.getNoteName(index) : 'E';
            const fullName = noteName + octave;
            freqMap[fullName] = getFrequency(index, octave);
        }
    }
    return freqMap;
}

const FREQ_MAP = generateAllFrequencies();

// Export untuk browser
if (typeof window !== 'undefined') {
    window.A4_FREQ = A4_FREQ;
    window.NOTES_PER_OCTAVE = NOTES_PER_OCTAVE;
    window.RATIO = RATIO;
    window.FREQ_MAP = FREQ_MAP;
    window.getFrequency = getFrequency;
    window.getFrequencyFromNote = getFrequencyFromNote;
    window.generateAllFrequencies = generateAllFrequencies;
}