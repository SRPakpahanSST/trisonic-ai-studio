// ============================================================
// notes.js - Data 20 Nada per Oktaf
// TriSonic AI Studio
// ============================================================

/**
 * Daftar 20 Nada per Oktaf
 * Skala Mayor: E E# F F# G G# H H# I J J# K K# A A# B B# C C# D
 * A4 = 440 Hz (referensi)
 * Rasio: 2^(1/20) ≈ 1.0352649238413775
 */

// 20 Nada per Oktaf (Mayor)
const NOTES_20_MAYOR = [
    'E',  // 0
    'E#', // 1
    'F',  // 2
    'F#', // 3
    'G',  // 4
    'G#', // 5
    'H',  // 6
    'H#', // 7
    'I',  // 8
    'J',  // 9
    'J#', // 10
    'K',  // 11
    'K#', // 12
    'A',  // 13
    'A#', // 14
    'B',  // 15
    'B#', // 16
    'C',  // 17
    'C#', // 18
    'D'   // 19
];

// 20 Nada per Oktaf (Minor)
const NOTES_20_MINOR = [
    'A',  // 0
    'A#', // 1
    'B',  // 2
    'B#', // 3
    'C',  // 4
    'C#', // 5
    'D',  // 6
    'E',  // 7
    'E#', // 8
    'F',  // 9
    'F#', // 10
    'G',  // 11
    'G#', // 12
    'H',  // 13
    'H#', // 14
    'I',  // 15
    'J',  // 16
    'J#', // 17
    'K',  // 18
    'K#'  // 19
];

// Interval skala Mayor (12 nada)
const MAYOR_INTERVALS = [2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1];

// Interval skala Minor (12 nada)
const MINOR_INTERVALS = [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2];

// Mapping nama nada ke index
const NOTE_TO_INDEX = {};
NOTES_20_MAYOR.forEach((note, index) => {
    NOTE_TO_INDEX[note] = index;
});

/**
 * Mendapatkan nama nada berdasarkan index
 * @param {number} index - Index nada (0-19)
 * @param {string} scale - 'mayor' atau 'minor'
 * @returns {string} Nama nada
 */
function getNoteName(index, scale = 'mayor') {
    const notes = scale === 'minor' ? NOTES_20_MINOR : NOTES_20_MAYOR;
    return notes[index % 20] || 'E';
}

/**
 * Mendapatkan index dari nama nada
 * @param {string} noteName - Nama nada (contoh: 'A', 'F#')
 * @returns {number} Index (0-19)
 */
function getNoteIndex(noteName) {
    return NOTE_TO_INDEX[noteName] !== undefined ? NOTE_TO_INDEX[noteName] : 0;
}

/**
 * Membangun skala dari root
 * @param {string} root - Nada root (contoh: 'E', 'A')
 * @param {string} scaleType - 'mayor' atau 'minor'
 * @returns {Array} Array nama nada skala
 */
function buildScale(root, scaleType = 'mayor') {
    const rootIdx = getNoteIndex(root);
    const intervals = scaleType === 'minor' ? MINOR_INTERVALS : MAYOR_INTERVALS;
    const scale = [root];
    let current = rootIdx;
    for (const step of intervals) {
        current = (current + step) % 20;
        scale.push(getNoteName(current));
    }
    return scale;
}

/**
 * Membangun akord triad
 * @param {string} root - Nada root
 * @param {string} type - 'mayor', 'minor', 'diminished'
 * @returns {Array} Array 3 nama nada
 */
function buildChord(root, type = 'mayor') {
    const rootIdx = getNoteIndex(root);
    let third = 4;
    let fifth = 7;
    if (type === 'minor') third = 3;
    if (type === 'diminished') { third = 3; fifth = 6; }
    return [
        getNoteName(rootIdx),
        getNoteName((rootIdx + third) % 20),
        getNoteName((rootIdx + fifth) % 20)
    ];
}

// Export untuk browser
if (typeof window !== 'undefined') {
    window.NOTES_20_MAYOR = NOTES_20_MAYOR;
    window.NOTES_20_MINOR = NOTES_20_MINOR;
    window.MAYOR_INTERVALS = MAYOR_INTERVALS;
    window.MINOR_INTERVALS = MINOR_INTERVALS;
    window.NOTE_TO_INDEX = NOTE_TO_INDEX;
    window.getNoteName = getNoteName;
    window.getNoteIndex = getNoteIndex;
    window.buildScale = buildScale;
    window.buildChord = buildChord;
}