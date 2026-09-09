// ================================================================
// DATA FREKUENSI 12-TET (20 NADA PER OKTAF) – C2 s/d D6
// A4 = 440 Hz (acuan)
// Rumus: f_n = 440 × 3^(n/20) dengan n=0 untuk A4
// RASIO = 3^(1/20) ≈ 1.056467... (BUKAN 2^(1/20))
// ================================================================

// SKALA MAYOR: E, E#, F, F#, G, G#, H, H#, I, J, J#, K, K#, A, A#, B, B#, C, C#, D
// SKALA MINOR: A, A#, B, B#, C, C#, D, E, E#, F, F#, G, G#, H, H#, I, J, J#, K, K#
//
// Tuts PUTIH (Index Genap): E, F, G, H, I, J, K, A, B, C, D
// Tuts HITAM (Index Ganjil): E#, F#, G#, H#, J#, K#, A#, B#, C#

const NOTES_20 = ['E','E#','F','F#','G','G#','H','H#','I','J','J#','K','K#','A','A#','B','B#','C','C#','D'];

// RASIO YANG BENAR: 3^(1/20)
const RATIO = Math.pow(3, 1/20);

// ================================================================
// FREKUENSI LENGKAP - C2 SAMPAI D6 (PRESISI 5 ANGKA)
// ================================================================
const FREQ_MAP = {
    // ==========================================================
    // OKTAF 2 - 3 NADA PERTAMA
    // ==========================================================
    'C2': 60.90000,
    'C#2': 64.34000,
    'D2': 67.97400,
    
    // ==========================================================
    // OKTAF 3 - 20 NADA
    // ==========================================================
    'E3': 71.81300,
    'E#3': 75.86800,
    'F3': 80.15200,
    'F#3': 84.67800,
    'G3': 89.46000,
    'G#3': 94.51100,
    'H3': 99.84800,
    'H#3': 105.48600,
    'I3': 111.44300,
    'J3': 117.73500,
    'J#3': 124.38400,
    'K3': 131.40700,
    'K#3': 138.82700,
    'A3': 146.66700,
    'A#3': 154.94900,
    'B3': 163.69800,
    'B#3': 172.94200,
    'C3': 182.70700,
    'C#3': 193.02400,
    'D3': 203.92400,
    
    // ==========================================================
    // OKTAF 4 - 20 NADA
    // ==========================================================
    'E4': 215.43900,
    'E#4': 227.60400,
    'F4': 240.45600,
    'F#4': 254.03400,
    'G4': 268.37900,
    'G#4': 283.53300,
    'H4': 299.54400,
    'H#4': 316.45800,
    'I4': 334.32800,
    'J4': 353.20600,
    'J#4': 373.15100,
    'K4': 394.22200,
    'K#4': 416.48200,
    'A4': 440.00000,
    'A#4': 464.84600,
    'B4': 491.09400,
    'B#4': 518.82500,
    'C4': 548.12200,
    'C#4': 579.07300,
    'D4': 611.77100,
    
    // ==========================================================
    // OKTAF 5 - 20 NADA
    // ==========================================================
    'E5': 646.31600,
    'E#5': 682.81200,
    'F5': 721.36900,
    'F#5': 762.10200,
    'G5': 805.13600,
    'G#5': 850.60000,
    'H5': 898.63100,
    'H#5': 949.37400,
    'I5': 1002.98300,
    'J5': 1059.61900,
    'J#5': 1119.45300,
    'K5': 1182.66500,
    'K#5': 1249.44700,
    'A5': 1320.00000,
    'A#5': 1394.53700,
    'B5': 1473.28300,
    'B#5': 1556.47500,
    'C5': 1644.36500,
    'C#5': 1737.21800,
    'D5': 1835.31400,
    
    // ==========================================================
    // OKTAF 6 - 20 NADA
    // ==========================================================
    'E6': 1938.94900,
    'E#6': 2048.43600,
    'F6': 2164.10600,
    'F#6': 2286.30700,
    'G6': 2415.40900,
    'G#6': 2551.80000,
    'H6': 2695.89400,
    'H#6': 2848.12300,
    'I6': 3008.94900,
    'J6': 3178.85700,
    'J#6': 3358.35800,
    'K6': 3547.99600,
    'K#6': 3748.34100,
    'A6': 3960.00000,
    'A#6': 4183.61100,
    'B6': 4419.84800,
    'B#6': 4669.42500,
    'C6': 4933.09500,
    'C#6': 5211.65300,
    'D6': 5505.94200
};

// ================================================================
// FUNGSI-FUNGSI
// ================================================================

const NOTE_TO_INDEX = {};
NOTES_20.forEach(function(note, index) {
    NOTE_TO_INDEX[note] = index;
});

// Index A4 = 13 (A pada index 13 di NOTES_20)
const A4_INDEX = 13;

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
    for (var oct = 2; oct <= 6; oct++) {
        for (var i = 0; i < NOTES_20.length; i++) {
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
// HITUNG FREKUENSI DENGAN RUMUS 440 × 3^(n/20)
// ================================================================

function calculateFrequency(index, octave) {
    var midiNumber = (octave * 20) + index;
    var midiA4 = (4 * 20) + A4_INDEX;
    var n = midiNumber - midiA4;
    return 440 * Math.pow(3, n / 20);
}

// ================================================================
// CETAK INFORMASI
// ================================================================

function getOctaveNotes(octave) {
    var notes = [];
    for (var i = 0; i < NOTES_20.length; i++) {
        var fullName = NOTES_20[i] + octave;
        if (FREQ_MAP[fullName] !== undefined) {
            notes.push(fullName);
        }
    }
    return notes;
}

function isWhiteKey(index) {
    return index % 2 === 0;
}

function isBlackKey(index) {
    return index % 2 === 1;
}

// ================================================================
// EXPORT KE WINDOW
// ================================================================

window.FREQ_MAP = FREQ_MAP;
window.NOTES_20 = NOTES_20;
window.NOTE_TO_INDEX = NOTE_TO_INDEX;
window.A4_INDEX = A4_INDEX;
window.RATIO = RATIO;
window.getNoteIndex = getNoteIndex;
window.getNoteName = getNoteName;
window.getFrequencyFromNote = getFrequencyFromNote;
window.getAllNotes = getAllNotes;
window.formatFrequency = formatFrequency;
window.getOctaveNotes = getOctaveNotes;
window.isWhiteKey = isWhiteKey;
window.isBlackKey = isBlackKey;
window.calculateFrequency = calculateFrequency;

console.log('✅ frequencies.js loaded');
console.log('✅ RASIO = 3^(1/20) = ' + RATIO);
console.log('✅ Total nada: ' + getAllNotes().length + ' notes');
console.log('✅ Skala Mayor: ' + NOTES_20.join(' - '));
console.log('✅ PUTIH (genap): ' + NOTES_20.filter(function(n, i) { return i % 2 === 0; }).join(', '));
console.log('✅ HITAM (ganjil): ' + NOTES_20.filter(function(n, i) { return i % 2 === 1; }).join(', '));
console.log('✅ A4 = ' + getFrequencyFromNote('A4') + ' Hz');