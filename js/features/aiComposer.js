// ================================================================
// aiComposer.js - AI Composer
// ================================================================

function AIComposer() {
    this.audioEngine = null;
    this.currentComposition = [];
    this.isPlaying = false;
    this.compositionTimeout = null;
}

AIComposer.prototype.init = function(audioEngine) {
    this.audioEngine = audioEngine;
};

AIComposer.prototype.generateComposition = function(genre, length, tempo, baseOctave) {
    genre = genre || 'classical';
    length = length || 8;
    tempo = tempo || 120;
    baseOctave = baseOctave || 4;
    
    var patterns = {
        classical: { intervals: [0,2,4,5,7,9,11,12], rhythm: [1,0.5,1,0.5,1,1,0.5,0.5], range: [-3,3], repeatChance: 0.3 },
        jazz: { intervals: [0,3,4,7,8,10,12,14], rhythm: [1.5,0.5,0.75,0.25,1,0.5,1.5], range: [-2,4], repeatChance: 0.2 },
        ambient: { intervals: [0,2,4,7,9,12,14,16], rhythm: [2,1,2,2,1,2,1], range: [-2,2], repeatChance: 0.5 },
        ethnic: { intervals: [0,1,3,5,7,8,10,12], rhythm: [1,0.5,0.5,1,0.5,0.5,1], range: [-3,3], repeatChance: 0.25 },
        experimental: { intervals: [0,1,3,4,6,7,9,10,12,13,15,16], rhythm: [0.5,0.75,0.25,1.5,0.5,0.25,0.75,1], range: [-4,4], repeatChance: 0.15 }
    };
    
    var pattern = patterns[genre] || patterns.classical;
    var noteDuration = 60 / tempo;
    var composition = [];
    var currentNote = 7;
    var prevNote = currentNote;
    
    for (var i = 0; i < length; i++) {
        var intervalIndex = Math.floor(Math.random() * pattern.intervals.length);
        var interval = pattern.intervals[intervalIndex];
        var direction = Math.random() > 0.5 ? 1 : -1;
        var newNote = currentNote + (direction * interval);
        
        if (newNote < 0) newNote = Math.abs(newNote) % 20;
        if (newNote >= 20) newNote = newNote % 20;
        
        if (Math.random() < pattern.repeatChance && i > 0) {
            newNote = prevNote;
        }
        
        var octaveShift = Math.floor(Math.random() * (pattern.range[1] - pattern.range[0] + 1)) + pattern.range[0];
        var octave = baseOctave + Math.floor(octaveShift / 20);
        var noteIndex = ((newNote % 20) + 20) % 20;
        var rhythmIndex = i % pattern.rhythm.length;
        var duration = pattern.rhythm[rhythmIndex] * noteDuration;
        
        var noteName = window.getNoteName ? window.getNoteName(noteIndex) : 'E';
        var fullName = noteName + octave;
        var freq = window.getFrequencyFromNote ? window.getFrequencyFromNote(fullName) : 440;
        
        composition.push({ note: fullName, frequency: freq, duration: duration });
        prevNote = currentNote;
        currentNote = newNote;
    }
    
    this.currentComposition = composition;
    return composition;
};

AIComposer.prototype.playComposition = function(composition, onComplete) {
    if (!this.audioEngine) return;
    if (!composition || composition.length === 0) return;
    
    this.stopComposition();
    this.audioEngine.resume();
    this.isPlaying = true;
    var index = 0;
    var self = this;
    
    function playNext() {
        if (!self.isPlaying || index >= composition.length) {
            self.isPlaying = false;
            if (onComplete) onComplete();
            return;
        }
        var item = composition[index];
        if (item.frequency > 0) {
            self.audioEngine.playNote(item.note, item.frequency, item.duration);
        }
        index++;
        self.compositionTimeout = setTimeout(playNext, (item.duration || 0.3) * 1000 + 50);
    }
    
    playNext();
};

AIComposer.prototype.stopComposition = function() {
    this.isPlaying = false;
    if (this.compositionTimeout) {
        clearTimeout(this.compositionTimeout);
        this.compositionTimeout = null;
    }
    if (this.audioEngine) {
        this.audioEngine.stopAll();
    }
};

window.AIComposer = AIComposer;
console.log('✅ aiComposer.js loaded');
