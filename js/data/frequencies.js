// ================================================================
// DATA FREKUENSI 12-TET (20 NADA PER OKTAF) – C2 s/d D6
// A4 = 440 Hz (acuan)
// Rumus: f_n = 440 × 3^(n/20) dengan n=0 untuk A4
// ================================================================

// URUTAN NADA YANG BENAR (1 Oktaf):
// C, C#, D, E, E#, F, F#, G, G#, H, H#, I, J, J#, K, K#, A, A#, B, B#
//
// Tuts PUTIH (Index Genap): C, D, E, F, G, H, I, J, K, A, B
// Tuts HITAM (Index Ganjil): C#, E#, F#, G#, H#, J#, K#, A#, B#

const NOTES_20 = ['C','C#','D','E','E#','F','F#','G','G#','H','H#','I','J','J#','K','K#','A','A#','B','B#'];

// ================================================================
// FREKUENSI LENGKAP - C2 SAMPAI D6
// ================================================================
const FREQ_MAP = {
    // ==========================================================
    // OKTAF 2 - LENGKAP 20 NADA
    // ==========================================================
    'C2': 60.90000,
    'C#2': 64.34000,
    'D2': 67.97400,
    'E2': 71.81300,
    'E#2': 75.86800,
    'F2': 80.15200,
    'F#2': 84.67800,
    'G2': 89.46000,
    'G#2': 94.51100,
    'H2': 99.84800,
    'H#2': 105.48600,
    'I2': 111.44300,
    'J2': 117.73500,
    'J#2': 124.38400,
    'K2': 131.40700,
    'K#2': 138.82700,
    'A2': 146.66700,
    'A#2': 154.94900,
    'B2': 163.69800,
    'B#2': 172.94200,
    
    // ==========================================================
    // OKTAF 3 - LENGKAP 20 NADA
    // ==========================================================
    'C3': 182.70700,
    'C#3': 193.02400,
    'D3': 203.92400,
    'E3': 215.43900,
    'E#3': 227.60400,
    'F3': 240.45600,
    'F#3': 254.03400,
    'G3': 268.37900,
    'G#3': 283.53300,
    'H3': 299.54400,
    'H#3': 316.45800,
    'I3': 334.32800,
    'J3': 353.20600,
    'J#3': 373.15100,
    'K3': 394.22200,
    'K#3': 416.48200,
    'A3': 440.00000,
    'A#3': 464.84600,
    'B3': 491.09400,
    'B#3': 518.82500,
    
    // ==========================================================
    // OKTAF 4 - LENGKAP 20 NADA
    // ==========================================================
    'C4': 548.12200,
    'C#4': 579.07300,
    'D4': 611.77100,
    'E4': 646.31600,
    'E#4': 682.81200,
    'F4': 721.36900,
    'F#4': 762.10200,
    'G4': 805.13600,
    'G#4': 850.60000,
    'H4': 898.63100,
    'H#4': 949.37400,
    'I4': 1002.98300,
    'J4': 1059.61900,
    'J#4': 1119.45300,
    'K4': 1182.66500,
    'K#4': 1249.44700,
    'A4': 1320.00000,
    'A#4': 1394.53700,
    'B4': 1473.28300,
    'B#4': 1556.47500,
    
    // ==========================================================
    // OKTAF 5 - LENGKAP 20 NADA
    // ==========================================================
    'C5': 1644.36500,
    'C#5': 1737.21800,
    'D5': 1835.31400,
    'E5': 1938.94900,
    'E#5': 2048.43600,
    'F5': 2164.10600,
    'F#5': 2286.30700,
    'G5': 2415.40900,
    'G#5': 2551.80000,
    'H5': 2695.89400,
    'H#5': 2848.12300,
    'I5': 3008.94900,
    'J5': 3178.85700,
    'J#5': 3358.35800,
    'K5': 3547.99600,
    'K#5': 3748.34100,
    'A5': 3960.00000,
    'A#5': 4183.61100,
    'B5': 4419.84800,
    'B#5': 4669.42500,
    
    // ==========================================================
    // OKTAF 6 - LENGKAP 20 NADA
    // ==========================================================
    'C6': 4933.09500,
    'C#6': 5211.65300,
    'D6': 5505.94200,
    'E6': 5816.84700,
    'E#6': 6145.30800,
    'F6': 6492.31800,
    'F#6': 6859.92100,
    'G6': 7247.22700,
    'G#6': 7655.40000,
    'H6': 8087.68200,
    'H#6': 8544.36900,
    'I6': 9026.84700,
    'J6': 9536.57100,
    'J#6': 10074.17400,
    'K6': 10641.98800,
    'K#6': 11242.02300,
    'A6': 11876.00000,
    'A#6': 12545.83300,
    'B6': 13259.54400,
    'B#6': 14008.27500
};

// ================================================================
// FUNGSI-FUNGSI
// ================================================================

// Mapping nada ke index
const NOTE_TO_INDEX = {};
NOTES_20.forEach(function(note, index) {
    NOTE_TO_INDEX[note] = index;
});

function getNoteIndex(noteName) {
    return NOTE_TO_INDEX[noteName] !== undefined ? NOTE_TO_INDEX[noteName] : 0;
}

function getNoteName(index) {
    return NOTES_20[index % 20] || 'C';
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
window.getOctaveNotes = getOctaveNotes;

console.log('✅ frequencies.js loaded');
console.log('✅ Total nada: ' + getAllNotes().length + ' notes');
console.log('✅ Urutan nada: ' + NOTES_20.join(' - '));
console.log('✅ Oktaf 2: ' + getOctaveNotes(2).join(', '));
console.log('✅ Oktaf 3: ' + getOctaveNotes(3).join(', '));
console.log('✅ Oktaf 4: ' + getOctaveNotes(4).join(', '));
console.log('✅ Oktaf 5: ' + getOctaveNotes(5).join(', '));
console.log('✅ Oktaf 6: ' + getOctaveNotes(6).join(', '));