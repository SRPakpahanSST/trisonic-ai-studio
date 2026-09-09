// ================================================================
// keyboard.js - Render Keyboard 20 Nada (C2 - D6)
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
    // 20 Nada per Oktaf: E, E#, F, F#, G, G#, H, H#, I, J, J#, K, K#, A, A#, B, B#, C, C#, D
    // Tuts PUTIH: E, F, G, H, I, J, K, A, B, C, D (Index Genap)
    // Tuts HITAM: E#, F#, G#, H#, J#, K#, A#, B#, C# (Index Ganjil)
    
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
    // RENDER KEYBOARD DENGAN POSISI ABSOLUTE (Seperti PMD)
    // ================================================================
    var wrapper = document.createElement('div');
    wrapper.className = 'keyboard-flex';
    wrapper.style.cssText = 'position:relative;margin:0 auto;';
    
    var self = this;
    var whiteKeyWidth = 30;
    var blackKeyWidth = 18;
    var whiteKeyHeight = 155;
    var blackKeyHeight = 95;
    var topOffset = 10;
    
    // Track posisi tuts putih
    var whiteIndex = 0;
    var whiteKeys = [];
    
    // ================================================================
    // RENDER TUTS PUTIH (Index Genap)
    // ================================================================
    allNotes.forEach(function(noteName) {
        var match = noteName.match(/^([A-Z#]+)(\d+)$/);
        if (!match) return;
        var note = match[1];
        var octave = match[2];
        var index = window.getNoteIndex ? window.getNoteIndex(note) : 0;
        
        // Tuts PUTIH = index genap
        if (index % 2 === 0) {
            var freq = window.getFrequencyFromNote ? window.getFrequencyFromNote(noteName) : 0;
            
            var key = document.createElement('div');
            key.className = 'key key-white';
            key.dataset.note = noteName;
            key.dataset.freq = freq;
            key.dataset.octave = octave;
            key.dataset.isWhite = true;
            key.dataset.index = index;
            key.dataset.whiteIndex = whiteIndex;
            
            var xPos = whiteIndex * whiteKeyWidth;
            
            key.style.cssText = 'position:absolute;left:' + xPos + 'px;top:' + topOffset + 'px;width:' + whiteKeyWidth + 'px;height:' + whiteKeyHeight + 'px;background:#f0f0f0;border:1px solid #ccc;border-radius:0 0 6px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:8px;z-index:1;box-shadow:0 2px 4px rgba(0,0,0,0.1);transition:all 0.08s ease;user-select:none;touch-action:manipulation;';
            
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
            whiteKeys.push(noteName);
            whiteIndex++;
        }
    });
    
    // ================================================================
    // RENDER TUTS HITAM (Index Ganjil)
    // ================================================================
    allNotes.forEach(function(noteName) {
        var match = noteName.match(/^([A-Z#]+)(\d+)$/);
        if (!match) return;
        var note = match[1];
        var octave = match[2];
        var index = window.getNoteIndex ? window.getNoteIndex(note) : 0;
        
        // Tuts HITAM = index ganjil
        if (index % 2 === 1) {
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
            
            key.style.cssText = 'position:absolute;left:' + xPos + 'px;top:' + topOffset + 'px;width:' + blackKeyWidth + 'px;height:' + blackKeyHeight + 'px;background:#222;border:1px solid #111;border-radius:0 0 6px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:4px;z-index:2;box-shadow:0 2px 6px rgba(0,0,0,0.4);transition:all 0.08s ease;user-select:none;touch-action:manipulation;';
            
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
    wrapper.style.height = (whiteKeyHeight + 40) + 'px';
    
    this.container.appendChild(wrapper);
    this.addOctaveLabels(whiteKeys);
    this.isRendered = true;
    console.log('✅ Keyboard selesai dirender!');
};

KeyboardRenderer.prototype.addOctaveLabels = function(whiteKeys) {
    var container = this.container;
    if (!container) return;
    
    var wrapper = container.querySelector('.keyboard-flex');
    if (!wrapper) return;
    
    var labelsWrapper = document.createElement('div');
    labelsWrapper.style.cssText = 'display:flex;justify-content:space-around;padding:4px 0;font-size:0.6rem;color:#556677;border-top:1px solid #2a3a5e;margin-top:4px;width:100%;';
    
    // Oktaf 2: C2, D2 (2 tuts putih) -> index 0-1
    // Oktaf 3: E3, F3, G3, H3, I3, J3, K3, A3, B3, C3, D3 (11 tuts putih) -> index 2-12
    // Oktaf 4: E4, F4, G4, H4, I4, J4, K4, A4, B4, C4, D4 (11 tuts putih) -> index 13-23
    // Oktaf 5: E5, F5, G5, H5, I5, J5, K5, A5, B5, C5, D5 (11 tuts putih) -> index 24-34
    // Oktaf 6: E6, F6, G6, H6, I6, J6, K6, A6, B6, C6, D6 (11 tuts putih) -> index 35-45
    
    var octaveRanges = [
        { octave: 2, start: 0, end: 1 },
        { octave: 3, start: 2, end: 12 },
        { octave: 4, start: 13, end: 23 },
        { octave: 5, start: 24, end: 34 },
        { octave: 6, start: 35, end: 45 }
    ];
    
    octaveRanges.forEach(function(range) {
        var firstNote = whiteKeys[range.start] || '?';
        var lastNote = whiteKeys[range.end] || '?';
        var label = document.createElement('span');
        label.textContent = 'Oktaf ' + range.octave + ' (' + firstNote + ' - ' + lastNote + ')';
        label.style.cssText = 'color:#556677;font-weight:600;font-size:0.55rem;';
        labelsWrapper.appendChild(label);
    });
    
    container.appendChild(labelsWrapper);
};

KeyboardRenderer.prototype.bindEvents = function() {
    var self = this;
    
    // Keyboard QWERTY
    document.addEventListener('keydown', function(e) {
        var keyMap = {
            'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5,
            'u': 6, 'i': 7, 'o': 8, 'p': 9, 'a': 10, 's': 11,
            'd': 12, 'f': 13, 'g': 14, 'h': 15, 'j': 16, 'k': 17,
            'l': 18, ';': 19
        };
        var keyIndex = keyMap[e.key.toLowerCase()];
        if (keyIndex !== undefined && !e.repeat) {
            var octave = self.currentOctave;
            var noteName = window.getNoteName ? window.getNoteName(keyIndex) : 'E';
            var fullName = noteName + octave;
            var keyElement = self.keyElements[fullName];
            if (keyElement) {
                e.preventDefault();
                self.activateKey(keyElement);
            }
        }
    });
    
    document.addEventListener('keyup', function(e) {
        var keyMap = {
            'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5,
            'u': 6, 'i': 7, 'o': 8, 'p': 9, 'a': 10, 's': 11,
            'd': 12, 'f': 13, 'g': 14, 'h': 15, 'j': 16, 'k': 17,
            'l': 18, ';': 19
        };
        var keyIndex = keyMap[e.key.toLowerCase()];
        if (keyIndex !== undefined) {
            var octave = self.currentOctave;
            var noteName = window.getNoteName ? window.getNoteName(keyIndex) : 'E';
            var fullName = noteName + octave;
            var keyElement = self.keyElements[fullName];
            if (keyElement) {
                e.preventDefault();
                self.deactivateKey(keyElement);
            }
        }
    });
    
    var octaveSelect = document.getElementById('octaveSelect');
    if (octaveSelect) {
        octaveSelect.addEventListener('change', function() {
            self.currentOctave = parseInt(this.value);
        });
    }
};

KeyboardRenderer.prototype.activateKey = function(key) {
    if (!key) return;
    
    var noteName = key.dataset.note;
    var freq = parseFloat(key.dataset.freq);
    var octave = key.dataset.octave;
    var isWhite = key.dataset.isWhite === 'true';
    
    // Visual
    key.style.background = '#ffd700';
    key.style.borderColor = '#f5a623';
    key.style.boxShadow = '0 0 30px rgba(255,215,0,0.5)';
    key.style.transform = 'scale(0.95)';
    
    // AUDIO
    if (this.audioEngine && freq > 0) {
        this.audioEngine.playNote(noteName, freq, 0.8);
    }
    
    this.activeKeys[noteName] = true;
    
    var freqFormatted = window.formatFrequency ? window.formatFrequency(freq) : freq.toFixed(5);
    this.updateDisplay(noteName, freqFormatted, octave);
};

KeyboardRenderer.prototype.deactivateKey = function(key) {
    if (!key) return;
    
    var noteName = key.dataset.note;
    var isWhite = key.dataset.isWhite === 'true';
    
    if (isWhite) {
        key.style.background = '#f0f0f0';
        key.style.borderColor = '#ccc';
    } else {
        key.style.background = '#222';
        key.style.borderColor = '#111';
    }
    key.style.transform = '';
    key.style.boxShadow = '';
    
    delete this.activeKeys[noteName];
    if (Object.keys(this.activeKeys).length === 0) {
        this.updateDisplay(null, null, null);
    }
};

KeyboardRenderer.prototype.updateDisplay = function(noteName, freq, octave) {
    if (this.noteDisplay) this.noteDisplay.textContent = noteName || '-';
    if (this.freqDisplay) this.freqDisplay.textContent = freq || '-';
    if (this.octaveDisplay) this.octaveDisplay.textContent = octave || '-';
};

KeyboardRenderer.prototype.reRender = function() {
    this.render();
};

window.KeyboardRenderer = KeyboardRenderer;
console.log('✅ keyboard.js loaded');