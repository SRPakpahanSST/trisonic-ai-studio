// ================================================================
// DATA FREKUENSI 12-TET (20 NADA PER OKTAF) – E2 s/d A7
// A4 = 440 Hz (acuan)
// Rumus: f_n = 440 × 3^(n/20) dengan n=0 untuk A4
// RASIO = 3^(1/20) ≈ 1.056467
// ================================================================

// ================================================================
// URUTAN NADA 20 PER OKTAF (SKALA MAYOR E)
// ================================================================
// Index:  0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19
// Nada:   E   E#    F   F#    G   G#    H   H#    I    J   J#    K   K#    A   A#    B   B#    C   C#    D
// Warna:  P    H    P    H    P    H    P    H    P    P    H    P    H    P    H    P    H    P    H    P
// ================================================================

const NOTES_20 = ['E','E#','F','F#','G','G#','H','H#','I','J','J#','K','K#','A','A#','B','B#','C','C#','D'];

// Tuts PUTIH (nada tanpa #)
const WHITE_KEYS = ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'A', 'B', 'C', 'D'];
const BLACK_KEYS = ['E#', 'F#', 'G#', 'H#', 'J#', 'K#', 'A#', 'B#', 'C#'];

function isWhiteKey(noteName) {
    var note = noteName.replace(/[0-9]/g, '');
    return WHITE_KEYS.indexOf(note) !== -1;
}

function isBlackKey(noteName) {
    var note = noteName.replace(/[0-9]/g, '');
    return BLACK_KEYS.indexOf(note) !== -1;
}

// ================================================================
// FUNGSI HITUNG FREKUENSI
// ================================================================
function calculateFrequency(index, octave) {
    var A4_INDEX = 13;
    var A4_OCTAVE = 4;
    var midiNumber = (octave * 20) + index;
    var midiA4 = (A4_OCTAVE * 20) + A4_INDEX;
    var n = midiNumber - midiA4;
    return 440 * Math.pow(3, n / 20);
}

// ================================================================
// FREKUENSI LENGKAP - E2 SAMPAI A7
// ================================================================
const FREQ_MAP = {};

// Generate semua frekuensi dari E2 sampai A7
function generateFreqMap() {
    // Oktaf 2: E2 sampai D2 (20 nada)
    for (var i = 0; i < NOTES_20.length; i++) {
        var noteName = NOTES_20[i] + '2';
        var freq = calculateFrequency(i, 2);
        FREQ_MAP[noteName] = parseFloat(freq.toFixed(5));
    }
    
    // Oktaf 3: E3 sampai D3 (20 nada)
    for (var i = 0; i < NOTES_20.length; i++) {
        var noteName = NOTES_20[i] + '3';
        var freq = calculateFrequency(i, 3);
        FREQ_MAP[noteName] = parseFloat(freq.toFixed(5));
    }
    
    // Oktaf 4: E4 sampai D4 (20 nada) - A4 = 440 Hz
    for (var i = 0; i < NOTES_20.length; i++) {
        var noteName = NOTES_20[i] + '4';
        var freq = calculateFrequency(i, 4);
        FREQ_MAP[noteName] = parseFloat(freq.toFixed(5));
    }
    FREQ_MAP['A4'] = 440.00000; // Pastikan A4 = 440
    
    // Oktaf 5: E5 sampai D5 (20 nada)
    for (var i = 0; i < NOTES_20.length; i++) {
        var noteName = NOTES_20[i] + '5';
        var freq = calculateFrequency(i, 5);
        FREQ_MAP[noteName] = parseFloat(freq.toFixed(5));
    }
    
    // Oktaf 6: E6 sampai D6 (20 nada)
    for (var i = 0; i < NOTES_20.length; i++) {
        var noteName = NOTES_20[i] + '6';
        var freq = calculateFrequency(i, 6);
        FREQ_MAP[noteName] = parseFloat(freq.toFixed(5));
    }
    
    // Oktaf 7: E7 sampai A7 (14 nada, berhenti di A7)
    for (var i = 0; i <= 13; i++) {
        var noteName = NOTES_20[i] + '7';
        var freq = calculateFrequency(i, 7);
        FREQ_MAP[noteName] = parseFloat(freq.toFixed(5));
    }
}

generateFreqMap();

// ================================================================
// FUNGSI-FUNGSI
// ================================================================

const NOTE_TO_INDEX = {};
NOTES_20.forEach(function(note, index) {
    NOTE_TO_INDEX[note] = index;
});

function getNoteIndex(noteName) {
    return NOTE_TO_INDEX[noteName] !== undefined ? NOTE_TO_INDEX[noteName] : 0;
}

function getNoteName(index) {
    return NOTES_20[index % 20] || 'E';
}

function getFrequencyFromNote(noteName) {
    return FREQ_MAP[noteName] || 0;
}

function getAllNotes() {
    var allNotes = [];
    var octaves = [2, 3, 4, 5, 6, 7];
    for (var o = 0; o < octaves.length; o++) {
        var oct = octaves[o];
        var maxIndex = (oct === 7) ? 14 : 20;
        for (var i = 0; i < maxIndex; i++) {
            var fullName = NOTES_20[i] + oct;
            if (FREQ_MAP[fullName] !== undefined) {
                allNotes.push(fullName);
            }
        }
    }
    return allNotes;
}

function formatFrequency(freq) {
    return freq.toFixed(5);
}

// ================================================================
// EXPORT KE WINDOW
// ================================================================

window.FREQ_MAP = FREQ_MAP;
window.NOTES_20 = NOTES_20;
window.NOTE_TO_INDEX = NOTE_TO_INDEX;
window.WHITE_KEYS = WHITE_KEYS;
window.BLACK_KEYS = BLACK_KEYS;
window.isWhiteKey = isWhiteKey;
window.isBlackKey = isBlackKey;
window.getNoteIndex = getNoteIndex;
window.getNoteName = getNoteName;
window.getFrequencyFromNote = getFrequencyFromNote;
window.getAllNotes = getAllNotes;
window.formatFrequency = formatFrequency;
window.calculateFrequency = calculateFrequency;

console.log('✅ frequencies.js loaded');
console.log('✅ Total nada: ' + getAllNotes().length + ' notes');
console.log('✅ Nada pertama: ' + getAllNotes()[0] + ' (E2)');
console.log('✅ Nada terakhir: ' + getAllNotes()[getAllNotes().length - 1] + ' (A7)');
console.log('✅ A4 = ' + FREQ_MAP['A4'] + ' Hz (ACUAN)');
console.log('✅ A3 = ' + FREQ_MAP['A3'] + ' Hz');
console.log('✅ A2 = ' + FREQ_MAP['A2'] + ' Hz');
console.log('✅ A7 = ' + FREQ_MAP['A7'] + ' Hz');