// ================================================================
// DATA FREKUENSI 12-TET (20 NADA PER OKTAF) – C2 s/d D6
// A4 = 440 Hz (acuan)
// Rumus: f_n = 440 × 3^(n/20) dengan n=0 untuk A4
// RASIO = 3^(1/20) ≈ 1.056467
// ================================================================

// ================================================================
// SKALA MAYOR E - URUTAN YANG BENAR (1 OKTAF)
// ================================================================
// Index:  0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19
// Nada:   E   E#    F   F#    G   G#    H   H#    I    J   J#    K   K#    A   A#    B   B#    C   C#    D
// Warna:  P    H    P    H    P    H    P    H    P    P    H    P    H    P    H    P    H    P    H    P
// ================================================================

const NOTES_20 = ['E','E#','F','F#','G','G#','H','H#','I','J','J#','K','K#','A','A#','B','B#','C','C#','D'];

// ================================================================
// FREKUENSI LENGKAP - C2 SAMPAI D6
// ================================================================
const FREQ_MAP = {
    // ==========================================================
    // OKTAF 2 - MULAI DARI C2 (INDEX 17) SAMPAI D2 (INDEX 19)
    // ==========================================================
    'C2': 60.90000,   // Index 17 - PUTIH
    'C#2': 64.34000,  // Index 18 - HITAM
    'D2': 67.97400,   // Index 19 - PUTIH
    
    // ==========================================================
    // OKTAF 3 - LENGKAP 20 NADA (E3 SAMPAI D3)
    // ==========================================================
    'E3': 71.81300,   // Index 0 - PUTIH
    'E#3': 75.86800,  // Index 1 - HITAM
    'F3': 80.15200,   // Index 2 - PUTIH
    'F#3': 84.67800,  // Index 3 - HITAM
    'G3': 89.46000,   // Index 4 - PUTIH
    'G#3': 94.51100,  // Index 5 - HITAM
    'H3': 99.84800,   // Index 6 - PUTIH
    'H#3': 105.48600, // Index 7 - HITAM
    'I3': 111.44300,  // Index 8 - PUTIH
    'J3': 117.73500,  // Index 9 - PUTIH (tidak ada hitam antara I dan J)
    'J#3': 124.38400, // Index 10 - HITAM
    'K3': 131.40700,  // Index 11 - PUTIH
    'K#3': 138.82700, // Index 12 - HITAM
    'A3': 146.66700,  // Index 13 - PUTIH
    'A#3': 154.94900, // Index 14 - HITAM
    'B3': 163.69800,  // Index 15 - PUTIH
    'B#3': 172.94200, // Index 16 - HITAM
    'C3': 182.70700,  // Index 17 - PUTIH
    'C#3': 193.02400, // Index 18 - HITAM
    'D3': 203.92400,  // Index 19 - PUTIH
    
    // ==========================================================
    // OKTAF 4 - LENGKAP 20 NADA (E4 SAMPAI D4)
    // ==========================================================
    'E4': 215.43900,  // Index 0 - PUTIH
    'E#4': 227.60400, // Index 1 - HITAM
    'F4': 240.45600,  // Index 2 - PUTIH
    'F#4': 254.03400, // Index 3 - HITAM
    'G4': 268.37900,  // Index 4 - PUTIH
    'G#4': 283.53300, // Index 5 - HITAM
    'H4': 299.54400,  // Index 6 - PUTIH
    'H#4': 316.45800, // Index 7 - HITAM
    'I4': 334.32800,  // Index 8 - PUTIH
    'J4': 353.20600,  // Index 9 - PUTIH
    'J#4': 373.15100, // Index 10 - HITAM
    'K4': 394.22200,  // Index 11 - PUTIH
    'K#4': 416.48200, // Index 12 - HITAM
    'A4': 440.00000,  // Index 13 - PUTIH
    'A#4': 464.84600, // Index 14 - HITAM
    'B4': 491.09400,  // Index 15 - PUTIH
    'B#4': 518.82500, // Index 16 - HITAM
    'C4': 548.12200,  // Index 17 - PUTIH
    'C#4': 579.07300, // Index 18 - HITAM
    'D4': 611.77100,  // Index 19 - PUTIH
    
    // ==========================================================
    // OKTAF 5 - LENGKAP 20 NADA (E5 SAMPAI D5)
    // ==========================================================
    'E5': 646.31600,  // Index 0 - PUTIH
    'E#5': 682.81200, // Index 1 - HITAM
    'F5': 721.36900,  // Index 2 - PUTIH
    'F#5': 762.10200, // Index 3 - HITAM
    'G5': 805.13600,  // Index 4 - PUTIH
    'G#5': 850.60000, // Index 5 - HITAM
    'H5': 898.63100,  // Index 6 - PUTIH
    'H#5': 949.37400, // Index 7 - HITAM
    'I5': 1002.98300, // Index 8 - PUTIH
    'J5': 1059.61900, // Index 9 - PUTIH
    'J#5': 1119.45300,// Index 10 - HITAM
    'K5': 1182.66500, // Index 11 - PUTIH
    'K#5': 1249.44700,// Index 12 - HITAM
    'A5': 1320.00000, // Index 13 - PUTIH
    'A#5': 1394.53700,// Index 14 - HITAM
    'B5': 1473.28300, // Index 15 - PUTIH
    'B#5': 1556.47500,// Index 16 - HITAM
    'C5': 1644.36500, // Index 17 - PUTIH
    'C#5': 1737.21800,// Index 18 - HITAM
    'D5': 1835.31400, // Index 19 - PUTIH
    
    // ==========================================================
    // OKTAF 6 - LENGKAP 20 NADA (E6 SAMPAI D6)
    // ==========================================================
    'E6': 1938.94900, // Index 0 - PUTIH
    'E#6': 2048.43600,// Index 1 - HITAM
    'F6': 2164.10600, // Index 2 - PUTIH
    'F#6': 2286.30700,// Index 3 - HITAM
    'G6': 2415.40900, // Index 4 - PUTIH
    'G#6': 2551.80000,// Index 5 - HITAM
    'H6': 2695.89400, // Index 6 - PUTIH
    'H#6': 2848.12300,// Index 7 - HITAM
    'I6': 3008.94900, // Index 8 - PUTIH
    'J6': 3178.85700, // Index 9 - PUTIH
    'J#6': 3358.35800,// Index 10 - HITAM
    'K6': 3547.99600, // Index 11 - PUTIH
    'K#6': 3748.34100,// Index 12 - HITAM
    'A6': 3960.00000, // Index 13 - PUTIH
    'A#6': 4183.61100,// Index 14 - HITAM
    'B6': 4419.84800, // Index 15 - PUTIH
    'B#6': 4669.42500,// Index 16 - HITAM
    'C6': 4933.09500, // Index 17 - PUTIH
    'C#6': 5211.65300,// Index 18 - HITAM
    'D6': 5505.94200  // Index 19 - PUTIH
};

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

function isWhiteKey(index) {
    return index % 2 === 0;
}

function isBlackKey(index) {
    return index % 2 === 1;
}

// ================================================================
// CETAK INFORMASI UNTUK DEBUG
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

// ================================================================
// EXPORT KE WINDOW
// ================================================================

window.FREQ_MAP = FREQ_MAP;
window.NOTES_20 = NOTES_20;
window.NOTE_TO_INDEX = NOTE_TO_INDEX;
window.getNoteIndex = getNoteIndex;
window.getNoteName = getNoteName;
window.getFrequencyFromNote = getFrequencyFromNote;
window.getAllNotes = getAllNotes;
window.formatFrequency = formatFrequency;
window.isWhiteKey = isWhiteKey;
window.isBlackKey = isBlackKey;
window.getOctaveNotes = getOctaveNotes;

console.log('✅ frequencies.js loaded');
console.log('✅ Total nada: ' + getAllNotes().length + ' notes');
console.log('✅ Nada pertama: ' + getAllNotes()[0] + ' (C2 - PUTIH)');
console.log('✅ Nada kedua: ' + getAllNotes()[1] + ' (C#2 - HITAM)');
console.log('✅ Nada ketiga: ' + getAllNotes()[2] + ' (D2 - PUTIH)');
console.log('✅ Nada terakhir: ' + getAllNotes()[getAllNotes().length - 1] + ' (D6 - PUTIH)');
console.log('✅ Index C2 = ' + getNoteIndex('C') + ' pada oktaf 2');
console.log('✅ Index D6 = ' + getNoteIndex('D') + ' pada oktaf 6');