// ============================================================
// frequencies.js - Frekuensi 20 Nada per Oktaf (5 Oktaf)
// TriSonic AI Studio
// ============================================================

/**
 * Menghitung frekuensi untuk 20-nada per oktaf
 * A4 = 440 Hz (referensi)
 * Rasio: 2^(1/20) ≈ 1.0352649238413775
 * Rumus: f = 440 * 2^(n/20)
 * n = jumlah step dari A4
 */

const A4_FREQ = 440;
const NOTES_PER_OCTAVE = 20;
const RATIO = Math.pow(2, 1 / NOTES_PER_OCTAVE);

// Index A4 pada skala Mayor (A = 13)
const A4_INDEX = 13;

/**
 * Menghitung frekuensi dari index dan oktaf
 * @param {number} index - Index nada (0-19)
 * @param {number} octave - Oktaf (4 = referensi)
 * @returns {number} Frekuensi dalam Hz
 */
function getFrequency(index, octave) {
    const midiNumber = (octave * NOTES_PER_OCTAVE) + index;
    const midiA4 = (4 * NOTES_PER_OCTAVE) + A4_INDEX;
    const semitoneDiff = midiNumber - midiA4;
    return A4_FREQ * Math.pow(RATIO, semitoneDiff);
}

/**
 * Mendapatkan frekuensi dari nama nada
 * @param {string} noteName - Nama nada (contoh: 'A4', 'F#5')
 * @returns {number} Frekuensi dalam Hz
 */
function getFrequencyFromNote(noteName) {
    const match = noteName.match(/^([A-Z#]+)(\d+)$/);
    if (!match) return 0;
    const [, note, octave] = match;
    const index = window.getNoteIndex ? window.getNoteIndex(note) : 0;
    return getFrequency(index, parseInt(octave));
}

/**
 * Mendapatkan nama nada dari frekuensi (approksimasi)
 * @param {number} freq - Frekuensi dalam Hz
 * @param {number} tolerance - Toleransi error (default 0.02)
 * @returns {Object} { note, index, octave, frequency }
 */
function getNoteFromFrequency(freq, tolerance = 0.02) {
    if (freq <= 0) return null;
    
    // Cari di semua oktaf
    for (let octave = 2; octave <= 6; octave++) {
        for (let index = 0; index < NOTES_PER_OCTAVE; index++) {
            const f = getFrequency(index, octave);
            const diff = Math.abs(f - freq) / freq;
            if (diff < tolerance) {
                return {
                    note: window.getNoteName ? window.getNoteName(index) : 'E',
                    index: index,
                    octave: octave,
                    frequency: f
                };
            }
        }
    }
    return null;
}

/**
 * Menghasilkan semua frekuensi untuk 5 oktaf (C2 - D6)
 * @returns {Object} Map nama nada -> frekuensi
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

// Build full frequency map
const FREQ_MAP = generateAllFrequencies();

// Export untuk browser
if (typeof window !== 'undefined') {
    window.A4_FREQ = A4_FREQ;
    window.NOTES_PER_OCTAVE = NOTES_PER_OCTAVE;
    window.RATIO = RATIO;
    window.FREQ_MAP = FREQ_MAP;
    window.getFrequency = getFrequency;
    window.getFrequencyFromNote = getFrequencyFromNote;
    window.getNoteFromFrequency = getNoteFromFrequency;
    window.generateAllFrequencies = generateAllFrequencies;
}