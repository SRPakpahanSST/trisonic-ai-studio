// ============================================================
// notes.js - NOTES_20, Interval Mayor/Minor
// TriSonic AI Studio
// ============================================================

/**
 * Daftar 20 nada dengan nama dan properti interval
 */

// 20 Nada per oktaf
const NOTES_20 = [
    { index: 0, name: 'C',  interval: '1',  cents: 0 },
    { index: 1, name: 'C♯', interval: '2♯', cents: 60 },
    { index: 2, name: 'D',  interval: '2',  cents: 120 },
    { index: 3, name: 'D♯', interval: '3♯', cents: 180 },
    { index: 4, name: 'E',  interval: '3',  cents: 240 },
    { index: 5, name: 'E♯', interval: '4♯', cents: 300 },
    { index: 6, name: 'F',  interval: '4',  cents: 360 },
    { index: 7, name: 'F♯', interval: '5♯', cents: 420 },
    { index: 8, name: 'G',  interval: '5',  cents: 480 },
    { index: 9, name: 'G♯', interval: '6♯', cents: 540 },
    { index: 10, name: 'A',  interval: '6',  cents: 600 },
    { index: 11, name: 'A♯', interval: '7♯', cents: 660 },
    { index: 12, name: 'B',  interval: '7',  cents: 720 },
    { index: 13, name: 'B♯', interval: '8♯', cents: 780 },
    { index: 14, name: 'C',  interval: '8',  cents: 840 },
    { index: 15, name: 'C♯', interval: '9♯', cents: 900 },
    { index: 16, name: 'D',  interval: '9',  cents: 960 },
    { index: 17, name: 'D♯', interval: '10♯', cents: 1020 },
    { index: 18, name: 'E',  interval: '10', cents: 1080 },
    { index: 19, name: 'E♯', interval: '11♯', cents: 1140 },
];

// Interval dalam jumlah step (mikrotonal)
const INTERVALS = {
    'unison': 0,
    'minor2': 2,
    'major2': 4,
    'minor3': 6,
    'major3': 8,
    'perfect4': 10,
    'aug4': 12,
    'perfect5': 14,
    'minor6': 16,
    'major6': 18,
    'minor7': 20,
    'major7': 22,
    'octave': 20,
};

/**
 * Mendapatkan nada berdasarkan index
 * @param {number} index - Indeks nada (0-19)
 * @returns {Object} Objek nada { index, name, interval, cents }
 */
function getNoteByIndex(index) {
    return NOTES_20[index % NOTES_20.length] || NOTES_20[0];
}

/**
 * Mendapatkan interval antara dua nada (dalam step)
 * @param {number} fromIndex - Indeks nada awal
 * @param {number} toIndex - Indeks nada akhir
 * @returns {number} Interval dalam step (dapat negatif)
 */
function getIntervalSteps(fromIndex, toIndex) {
    return toIndex - fromIndex;
}

/**
 * Mendapatkan nama interval antara dua nada
 * @param {number} fromIndex - Indeks nada awal
 * @param {number} toIndex - Indeks nada akhir
 * @returns {string} Nama interval
 */
function getIntervalName(fromIndex, toIndex) {
    const steps = getIntervalSteps(fromIndex, toIndex);
    const absSteps = Math.abs(steps);
    
    const intervalMap = {
        0: 'Unison',
        2: 'Minor Second',
        4: 'Major Second',
        6: 'Minor Third',
        8: 'Major Third',
        10: 'Perfect Fourth',
        12: 'Augmented Fourth',
        14: 'Perfect Fifth',
        16: 'Minor Sixth',
        18: 'Major Sixth',
        20: 'Minor Seventh',
        22: 'Major Seventh',
        24: 'Octave',
    };
    
    const name = intervalMap[absSteps] || `${absSteps} Step`;
    return steps < 0 ? `Descending ${name}` : name;
}

/**
 * Transpose nada dengan interval tertentu
 * @param {number} index - Indeks nada
 * @param {number} steps - Jumlah step transposisi
 * @returns {number} Indeks baru
 */
function transposeNote(index, steps) {
    return (index + steps) % NOTES_20.length;
}

// Export untuk browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NOTES_20,
        INTERVALS,
        getNoteByIndex,
        getIntervalSteps,
        getIntervalName,
        transposeNote
    };
}