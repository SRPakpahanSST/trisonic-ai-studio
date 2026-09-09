// ================================================================
// keyboard.js - Render Keyboard 20 Nada (E3 - D6)
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
    this.allNotes = [];
}

KeyboardRenderer.prototype.init = function(audioEngine) {
    console.log('🎹 KeyboardRenderer.init()');
    this.audioEngine = audioEngine;
    this.container = document.getElementById('keyboard');
    this.noteDisplay = document.getElementById('currentNote');
    this.freqDisplay = document.getElementById('currentFreq');
    this.octaveDisplay = document.getElementById('currentOctave');
    
    if (typeof window.getAllNotes === 'function') {
        this.allNotes = window.getAllNotes();
    } else {
        console.error('❌ getAllNotes tidak tersedia!');
        return;
    }
    
    if (!this.container) {
        console.error('❌ Container keyboard tidak ditemukan!');
        return;
    }
    
    var octaveSelect = document.getElementById('octaveSelect');
    if (octaveSelect) {
        this.currentOctave = parseInt(octaveSelect.value);
    }
    
    console.log('✅ ' + this.allNotes.length + ' nada ditemukan');
    console.log('✅ Nada pertama: ' + this.allNotes[0] + ' (E3 - PUTIH)');
    console.log('✅ Nada kedua: ' + this.allNotes[1] + ' (E#3 - HITAM)');
    console.log('✅ Nada terakhir: ' + this.allNotes[this.allNotes.length - 1] + ' (D6 - PUTIH)');
    
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
    
    var allNotes = this.allNotes;
    if (!allNotes || allNotes.length === 0) {
        console.error('❌ Tidak ada nada!');
        this.container.innerHTML = '<p style="color:#e94560;padding:20px;text-align:center;">Error: Tidak ada data nada</p>';
        return;
    }
    
    console.log('✅ ' + allNotes.length + ' tuts akan dirender');
    
    var wrapper = document.createElement('div');
    wrapper.className = 'keyboard-flex';
    wrapper.style.cssText = 'display:flex;gap:2px;padding:4px;min-width:max-content;background:#1a1a2e;border-radius:10px;border:2px solid #2a3a5e;overflow-x:auto;margin:0 auto;';
    
    var self = this;
    
    allNotes.forEach(function(noteName) {
        var freq = window.getFrequencyFromNote ? window.getFrequencyFromNote(noteName) : 0;
        var match = noteName.match(/^([A-Z#]+)(\d+)$/);
        if (!match) return;
        
        var note = match[1];
        var octave = parseInt(match[2]);
        var index = window.getNoteIndex ? window.getNoteIndex(note) : 0;
        
        // Tuts PUTIH = index genap (0,2,4,6,8,10,12,14,16,18)
        // Tuts HITAM = index ganjil (1,3,5,7,9,11,13,15,17,19)
        var isWhite = (index % 2 === 0);
        
        var key = document.createElement('div');
        key.className = 'key ' + (isWhite ? 'key-white' : 'key-black');
        key.dataset.note = noteName;
        key.dataset.freq = freq;
        key.dataset.octave = octave;
        key.dataset.isWhite = isWhite;
        key.dataset.index = index;
        key.dataset.noteName = note;
        
        if (isWhite) {
            key.style.cssText = 'flex:0 0 30px;height:140px;background:#f0f0f0;border:1px solid #ccc;border-radius:0 0 6px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:8px;z-index:1;box-shadow:0 2px 4px rgba(0,0,0,0.1);transition:all 0.08s ease;user-select:none;touch-action:manipulation;';
        } else {
            key.style.cssText = 'flex:0 0 18px;height:85px;background:#222;border:1px solid #111;border-radius:0 0 6px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:4px;margin-left:-9px;margin-right:-9px;z-index:2;box-shadow:0 2px 6px rgba(0,0,0,0.4);transition:all 0.08s ease;user-select:none;touch-action:manipulation;';
        }
        
        // Label - tampilkan NAMA NADA LENGKAP
        var label = document.createElement('span');
        label.className = 'key-label';
        label.textContent = noteName;
        label.style.cssText = 'font-size:0.5rem;color:' + (isWhite ? '#333' : '#888') + ';pointer-events:none;text-align:center;font-weight:700;line-height:1.2;';
        key.appendChild(label);
        
        var freqFormatted = window.formatFrequency ? window.formatFrequency(freq) : freq.toFixed(5);
        key.title = noteName + ' - ' + freqFormatted + ' Hz';
        
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
    });
    
    this.container.appendChild(wrapper);
    this.addOctaveLabels();
    this.isRendered = true;
    console.log('✅ Keyboard selesai dirender!');
};

KeyboardRenderer.prototype.addOctaveLabels = function() {
    var container = this.container;
    if (!container) return;
    
    var labelsWrapper = document.createElement('div');
    labelsWrapper.style.cssText = 'display:flex;justify-content:space-around;padding:6px 4px 0;font-size:0.6rem;color:#556677;width:100%;border-top:1px solid #2a3a5e;margin-top:4px;';
    
    var allNotes = this.allNotes;
    var octaves = [3, 4, 5, 6];
    
    octaves.forEach(function(oct) {
        var notesInOctave = allNotes.filter(function(n) { return n.endsWith(oct); });
        if (notesInOctave.length > 0) {
            var first = notesInOctave[0];
            var last = notesInOctave[notesInOctave.length - 1];
            var label = document.createElement('span');
            label.textContent = 'Oktaf ' + oct + ' (' + first + ' - ' + last + ')';
            label.style.cssText = 'color:#556677;font-weight:600;font-size:0.55rem;';
            labelsWrapper.appendChild(label);
        }
    });
    
    container.appendChild(labelsWrapper);
};

KeyboardRenderer.prototype.bindEvents = function() {
    var self = this;
    
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
            console.log('🔄 Oktaf QWERTY diubah ke: ' + self.currentOctave);
            self.updateDisplay(null, null, self.currentOctave);
        });
    }
};

KeyboardRenderer.prototype.activateKey = function(key) {
    if (!key) return;
    
    var noteName = key.dataset.note;
    var freq = parseFloat(key.dataset.freq);
    var octave = key.dataset.octave;
    
    key.style.background = '#ffd700';
    key.style.borderColor = '#f5a623';
    key.style.boxShadow = '0 0 30px rgba(255,215,0,0.5)';
    key.style.transform = 'scale(0.95)';
    
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