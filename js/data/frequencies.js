// ============================================================
// frequencies.js - FREQ_MAP (Daftar Frekuensi 20 Nada)
// TriSonic AI Studio
// ============================================================

/**
 * Frekuensi untuk 20 nada per oktaf (mikrotonal)
 * Berbasis A4 = 440 Hz, dengan pembagian 20 interval per oktaf
 * Rasio: 2^(1/20) ≈ 1.0352649238413775
 */

const FREQ_MAP = {
    // Oktaf 4 (referensi)
    'C4': 261.63,
    'C4♯': 270.98,
    'D4': 280.60,
    'D4♯': 290.60,
    'E4': 301.00,
    'E4♯': 311.70,
    'F4': 322.80,
    'F4♯': 334.30,
    'G4': 346.20,
    'G4♯': 358.60,
    'A4': 371.40,
    'A4♯': 384.70,
    'B4': 398.40,
    'B4♯': 412.60,
    'C5': 427.30,
    'C5♯': 442.60,
    'D5': 458.40,
    'D5♯': 474.70,
    'E5': 491.60,
    'E5♯': 509.20,
    'F5': 527.40,
    'F5♯': 546.20,
    'G5': 565.70,
    'G5♯': 585.80,
    'A5': 606.70,
    'A5♯': 628.30,
    'B5': 650.70,
    'B5♯': 674.00,
    'C6': 698.00,
    'C6♯': 722.90,
    'D6': 748.80,
    'D6♯': 775.60,
    'E6': 803.10,
    'E6♯': 831.80,
    'F6': 861.40,
    'F6♯': 892.20,
    'G6': 924.00,
    'G6♯': 957.00,
    'A6': 991.20,
    'A6♯': 1026.60,
    'B6': 1063.40,
    'B6♯': 1101.60,
};

// Base frequency for A4
const A4_FREQ = 440;

// Number of notes per octave (microtonal)
const NOTES_PER_OCTAVE = 20;

// Ratio for one microtonal step: 2^(1/20)
const MICROTONAL_RATIO = Math.pow(2, 1 / NOTES_PER_OCTAVE);

/**
 * Menghitung frekuensi untuk nada dengan indeks
 * @param {number} index - Indeks nada (0-19 dalam oktaf)
 * @param {number} octave - Oktaf (4 = reference)
 * @returns {number} Frekuensi dalam Hz
 */
function getFrequency(index, octave = 4) {
    const midiNumber = (octave * NOTES_PER_OCTAVE) + index;
    const midiA4 = (4 * NOTES_PER_OCTAVE) + 9; // A4 di index 9
    const semitoneDiff = midiNumber - midiA4;
    return A4_FREQ * Math.pow(MICROTONAL_RATIO, semitoneDiff);
}

/**
 * Mendapatkan nama nada berdasarkan index dan oktaf
 * @param {number} index - Indeks nada (0-19)
 * @param {number} octave - Oktaf
 * @returns {string} Nama nada (contoh: "C4", "F♯5")
 */
function getNoteName(index, octave = 4) {
    const noteNames = [
        'C', 'C♯', 'D', 'D♯', 'E', 'E♯', 
        'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 
        'B', 'B♯', 'C', 'C♯', 'D', 'D♯', 
        'E', 'E♯'
    ];
    return noteNames[index % NOTES_PER_OCTAVE] + octave;
}

/**
 * Mendapatkan indeks MIDI untuk notasi
 * @param {string} noteName - Nama nada (contoh: "C4")
 * @returns {number} Indeks MIDI
 */
function getMidiIndex(noteName) {
    const noteMap = {
        'C': 0, 'C♯': 1, 'D': 2, 'D♯': 3, 'E': 4, 'E♯': 5,
        'F': 6, 'F♯': 7, 'G': 8, 'G♯': 9, 'A': 10, 'A♯': 11,
        'B': 12, 'B♯': 13
    };
    // Implementasi parsing sederhana
    const match = noteName.match(/^([A-G]♯?)(\d+)$/);
    if (!match) return -1;
    const [, note, octave] = match;
    const baseIndex = noteMap[note] || 0;
    return (parseInt(octave) * NOTES_PER_OCTAVE) + baseIndex;
}

// Export for browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        FREQ_MAP, 
        A4_FREQ, 
        NOTES_PER_OCTAVE, 
        MICROTONAL_RATIO,
        getFrequency,
        getNoteName,
        getMidiIndex
    };
}