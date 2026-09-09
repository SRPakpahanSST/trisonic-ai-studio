// ================================================================
// keyboard.js - Render Keyboard 20 Nada (C2 - D6)
// Mengikuti posisi tuts yang benar seperti pada PMD Musik 12 TET
// ================================================================

function KeyboardRenderer() {
    this.container = null;
    this.audioEngine = null;
    this.keyElements = {};
    this.activeKeys = {};
    this.currentOctave = 4;
    this.isRendered = false;
    this.noteDisplay = null;
    this.freqDisplay = null;
    this.octaveDisplay = null;
}

KeyboardRenderer.prototype.init = function(audioEngine) {
    console.log('🎹 KeyboardRenderer.init()');
    this.audioEngine = audioEngine;
    this.container = document.getElementById('keyboard');
    this.noteDisplay = document.getElementById('currentNote');
    this.freqDisplay = document.getElementById('currentFreq');
    this.octaveDisplay = document.getElementById('currentOctave');
    
    if (!this.container) {
        console.error('❌ Container keyboard tidak ditemukan!');
        return;
    }
    
    console.log('✅ Container ditemukan');
    this.render();
    this.bindEvents();
    this.updateDisplay(null, null, null);
    console.log('✅ Keyboard siap!');
};

KeyboardRenderer.prototype.render = function() {
    if (!this.container) {
        console.error('❌ render() - container tidak ditemukan');
        return;
    }
    
    console.log('🎹 render() dipanggil');
    this.container.innerHTML = '';
    this.keyElements = {};
    this.activeKeys = {};
    
    // ================================================================
    // URUTAN NADA YANG BENAR (C2 - D6)
    // ================================================================
    // Oktaf 2: C2, C#2, D2 (3 nada)
    // Oktaf 3: E3, E#3, F3, F#3, G3, G#3, H3, H#3, I3, J3, J#3, K3, K#3, A3, A#3, B3, B#3, C3, C#3, D3 (20 nada)
    // Oktaf 4: E4, E#4, F4, F#4, G4, G#4, H4, H#4, I4, J4, J#4, K4, K#4, A4, A#4, B4, B#4, C4, C#4, D4 (20 nada)
    // Oktaf 5: E5, E#5, F5, F#5, G5, G#5, H5, H#5, I5, J5, J#5, K5, K#5, A5, A#5, B5, B#5, C5, C#5, D5 (20 nada)
    // Oktaf 6: E6, E#6, F6, F#6, G6, G#6, H6, H#6, I6, J6, J#6, K6, K#6, A6, A#6, B6, B#6, C6, C#6, D6 (20 nada)
    // TOTAL: 3 + 20 + 20 + 20 + 20 = 83 tuts
    
    var allNotes = [];
    if (typeof window.getAllNotes === 'function') {
        allNotes = window.getAllNotes();
    } else {
        console.error('❌ getAllNotes tidak tersedia!');
        this.container.innerHTML = '<p style="color:#e94560;padding:20px;text-align:center;">Error: Data nada tidak tersedia</p>';
        return;
    }
    
    if (!allNotes || allNotes.length === 0) {
        console.error('❌ Tidak ada nada!');
        this.container.innerHTML = '<p style="color:#e94560;padding:20px;text-align:center;">Error: Tidak ada data nada</p>';
        return;
    }
    
    console.log('✅ ' + allNotes.length + ' tuts akan dirender');
    console.log('✅ Nada pertama: ' + allNotes[0] + ' (C2)');
    console.log('✅ Nada terakhir: ' + allNotes[allNotes.length - 1] + ' (D6)');
    
    // ================================================================
    // RENDER KEYBOARD DENGAN POSISI YANG BENAR
    // ================================================================
    var wrapper = document.createElement('div');
    wrapper.className = 'keyboard-flex';
    wrapper.style.cssText = 'display:flex;gap:2px;padding:8px;min-width:max-content;background:#1a1a2e;border-radius:10px;border:2px solid #2a3a5e;overflow-x:auto;margin:0 auto;';
    
    var self = this;
    var whiteKeyWidth = 30;
    var blackKeyWidth = 18;
    var whiteKeyHeight = 155;
    var blackKeyHeight = 95;
    
    // Untuk tracking posisi tuts putih
    var whiteIndex = 0;
    
    // Pertama, render semua tuts PUTIH
    allNotes.forEach(function(noteName) {
        var match = noteName.match(/^([A-Z#]+)(\d+)$/);
        if (!match) return;
        var note = match[1];
        var octave = match[2];
        var index = window.getNoteIndex ? window.getNoteIndex(note) : 0;
        
        // Tuts PUTIH = index genap (0,2,4,6,8,10,12,14,16,18)
        var isWhite = (index % 2 === 0);
        
        if (isWhite) {
            var freq = window.getFrequencyFromNote ? window.getFrequencyFromNote(noteName) : 0;
            
            var key = document.createElement('div');
            key.className = 'key key-white';
            key.dataset.note = noteName;
            key.dataset.freq = freq;
            key.dataset.octave = octave;
            key.dataset.isWhite = true;
            key.dataset.index = index;
            key.dataset.whiteIndex = whiteIndex;
            
            // Posisi horizontal untuk tuts putih
            var xPos = whiteIndex * whiteKeyWidth;
            
            key.style.cssText = 'position:absolute;left:' + xPos + 'px;top:10px;width:' + whiteKeyWidth + 'px;height:' + whiteKeyHeight + 'px;background:#f0f0f0;border:1px solid #ccc;border-radius:0 0 6px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:8px;z-index:1;box-shadow:0 2px 4px rgba(0,0,0,0.1);transition:all 0.08s ease;user-select:none;touch-action:manipulation;';
            
            // Label
            var label = document.createElement('span');
            label.className = 'key-label';
            label.textContent = noteName;
            label.style.cssText = 'font-size:0.5rem;color:#333;pointer-events:none;text-align:center;font-weight:700;';
            key.appendChild(label);
            
            var freqFormatted = window.formatFrequency ? window.formatFrequency(freq) : freq.toFixed(5);
            key.title = noteName + ' - ' + freqFormatted + ' Hz';
            
            // Events
            key.addEventListener('mousedown', function(e) {
                e.preventDefault();
                self.activateKey(this);
            });
            key.addEventListener('mouseup', function() {
                self.deactivateKey(this);
            });
            key.addEventListener('mouseleave', function() {
                self.deactivateKey(this);
            });
            key.addEventListener('touchstart', function(e) {
                e.preventDefault();
                self.activateKey(this);
            }, { passive: false });
            key.addEventListener('touchend', function(e) {
                e.preventDefault();
                self.deactivateKey(this);
            }, { passive: false });
            
            wrapper.appendChild(key);
            self.keyElements[noteName] = key;
            whiteIndex++;
        }
    });
    
    // Kedua, render semua tuts HITAM di atas tuts putih
    allNotes.forEach(function(noteName) {
        var match = noteName.match(/^([A-Z#]+)(\d+)$/);
        if (!match) return;
        var note = match[1];
        var octave = match[2];
        var index = window.getNoteIndex ? window.getNoteIndex(note) : 0;
        
        // Tuts HITAM = index ganjil (1,3,5,7,9,11,13,15,17,19)
        var isBlack = (index % 2 === 1);
        
        if (isBlack) {
            var freq = window.getFrequencyFromNote ? window.getFrequencyFromNote(noteName) : 0;
            
            // Cari posisi tuts putih di sebelah kiri
            var prevNoteIndex = index - 1;
            var prevNoteName = window.getNoteName ? window.getNoteName(prevNoteIndex) : 'E';
            var prevFullName = prevNoteName + octave;
            var prevKey = self.keyElements[prevFullName];
            
            if (!prevKey) return;
            
            var prevWhiteIndex = parseInt(prevKey.dataset.whiteIndex);
            var xPos = (prevWhiteIndex * whiteKeyWidth) + whiteKeyWidth - (blackKeyWidth / 2);
            
            var key = document.createElement('div');
            key.className = 'key key-black';
            key.dataset.note = noteName;
            key.dataset.freq = freq;
            key.dataset.octave = octave;
            key.dataset.isWhite = false;
            key.dataset.index = index;
            
            key.style.cssText = 'position:absolute;left:' + xPos + 'px;top:10px;width:' + blackKeyWidth + 'px;height:' + blackKeyHeight + 'px;background:#222;border:1px solid #111;border-radius:0 0 6px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:4px;z-index:2;box-shadow:0 2px 6px rgba(0,0,0,0.4);transition:all 0.08s ease;user-select:none;touch-action:manipulation;';
            
            // Label
            var label = document.createElement('span');
            label.className = 'key-label';
            label.textContent = noteName;
            label.style.cssText = 'font-size:0.45rem;color:#888;pointer-events:none;text-align:center;font-weight:700;';
            key.appendChild(label);
            
            var freqFormatted = window.formatFrequency ? window.formatFrequency(freq) : freq.toFixed(5);
            key.title = noteName + ' - ' + freqFormatted + ' Hz';
            
            // Events
            key.addEventListener('mousedown', function(e) {
                e.preventDefault();
                self.activateKey(this);
            });
            key.addEventListener('mouseup', function() {
                self.deactivateKey(this);
            });
            key.addEventListener('mouseleave', function() {
                self.deactivateKey(this);
            });
            key.addEventListener('touchstart', function(e) {
                e.preventDefault();
                self.activateKey(this);
            }, { passive: false });
            key.addEventListener('touchend', function(e) {
                e.preventDefault();
                self.deactivateKey(this);
            }, { passive: false });
            
            wrapper.appendChild(key);
            self.keyElements[noteName] = key;
        }
    });
    
    // Set lebar container
    var totalWidth = whiteIndex * whiteKeyWidth + 20;
    wrapper.style.width = totalWidth + 'px';
    wrapper.style.height = (whiteKeyHeight + 30) + 'px';
    wrapper.style.position = 'relative';
    
    this.container.appendChild(wrapper);
    this.addOctaveLabels();
    this.isRendered = true;
    console.log('✅ Keyboard selesai dirender!');
};

KeyboardRenderer.prototype.addOctaveLabels = function() {
    var container = this.container;
    if (!container) return;
    
    var wrapper = container.querySelector('.keyboard-flex');
    if (!wrapper) return;
    
    var labelsWrapper = document.createElement('div');
    labelsWrapper.style.cssText = 'display:flex;justify-content:space-around;padding:4px 0;font-size:0.6rem;color:#556677;border-top:1px solid #2a3a5e;margin-top:4px;width:100%;';
    
    // Oktaf 2: 3 tuts putih (C2, D2) -> posisi 0-2
    // Oktaf 3: 11 tuts putih (E3, F3, G3, H3, I3, J3, K3, A3, B3, C3, D3) -> posisi 3-13
    // Oktaf 4: 11 tuts putih -> posisi 14-24
    // Oktaf 5: 11 tuts putih -> posisi 25-35
    // Oktaf 6: 11 tuts putih -> posisi 36-46
    
    var octavePositions = [
        { octave: 2, start: 0, end: 2 },
        { octave: 3, start: 3, end: 13 },
        { octave: 4, start: 14, end: 24 },
        { octave: 5, start: 25, end: 35 },
        { octave: 6, start: 36, end: 46 }
    ];
    
    var whiteKeyWidth = 30;
    var allKeys = Object.keys(this.keyElements);
    var whiteKeys = allKeys.filter(function(k) {
        return window.getNoteIndex ? window.getNoteIndex(k.replace(/[0-9]/g, '')) % 2 === 0 : false;
    });
    
    octavePositions.forEach(function(info) {
        var firstNote = whiteKeys[info.start] || '?';
        var lastNote = whiteKeys[info.end] || '?';
        var label = document.createElement('span');
        label.textContent = 'Oktaf ' + info.octave + ' (' + firstNote + ' - ' + lastNote + ')';
        label.style.cssText = 'color:#556677;font-weight:600;font-size:0.55rem;';
        labelsWrapper.appendChild(label);
    });
    
    container.appendChild(labelsWrapper);
};

// ... sisanya sama seperti sebelumnya (bindEvents, activateKey, deactivateKey, updateDisplay, reRender)