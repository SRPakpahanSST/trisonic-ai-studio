// ================================================================
// keyboard.js - Render Keyboard 20 Nada (C2 - D6)
// Menggunakan FLEXBOX (bukan posisi absolut)
// ================================================================

class KeyboardRenderer {
    constructor() {
        this.container = null;
        this.audioEngine = null;
        this.keyElements = {};
        this.activeKeys = {};
        this.currentOctave = 4;
        this.isRendered = false;
        this.noteDisplay = null;
        this.freqDisplay = null;
        this.octaveDisplay = null;
        this.currentOctave = 4;
        this.allNotes = [];
    }

    init(audioEngine) {
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
        
        // Ambil semua nada dari C2 sampai D6
        if (typeof window.getAllNotes === 'function') {
            this.allNotes = window.getAllNotes();
        } else {
            console.error('❌ getAllNotes tidak tersedia!');
            this.container.innerHTML = '<p style="color:#e94560;padding:20px;text-align:center;">Error: Data nada tidak tersedia</p>';
            return;
        }
        
        console.log('✅ ' + this.allNotes.length + ' nada ditemukan');
        console.log('✅ Nada pertama: ' + this.allNotes[0] + ' (C2)');
        console.log('✅ Nada terakhir: ' + this.allNotes[this.allNotes.length - 1] + ' (D6)');
        
        this.render();
        this.bindEvents();
        this.updateDisplay(null, null, null);
        console.log('✅ Keyboard siap!');
    }

    render() {
        if (!this.container) return;
        
        console.log('🎹 render() dipanggil');
        this.container.innerHTML = '';
        this.keyElements = {};
        this.activeKeys = {};
        
        if (!this.allNotes || this.allNotes.length === 0) {
            this.container.innerHTML = '<p style="color:#8899aa;padding:20px;text-align:center;">Tidak ada data nada</p>';
            return;
        }
        
        // Buat wrapper dengan flex
        const wrapper = document.createElement('div');
        wrapper.className = 'keyboard-flex';
        wrapper.style.cssText = `
            display: flex;
            gap: 2px;
            padding: 8px;
            min-width: max-content;
            background: #1a1a2e;
            border-radius: 10px;
            border: 2px solid #2a3a5e;
            overflow-x: auto;
            margin: 0 auto;
            align-items: flex-start;
        `;
        
        const self = this;
        
        this.allNotes.forEach(function(noteName) {
            const freq = window.getFrequencyFromNote ? window.getFrequencyFromNote(noteName) : 0;
            const match = noteName.match(/^([A-Z#]+)(\d+)$/);
            if (!match) return;
            
            const note = match[1];
            const octave = match[2];
            const index = window.getNoteIndex ? window.getNoteIndex(note) : 0;
            
            // Tuts PUTIH = index genap, Tuts HITAM = index ganjil
            const isWhite = (index % 2 === 0);
            
            const key = document.createElement('div');
            key.className = 'key ' + (isWhite ? 'key-white' : 'key-black');
            key.dataset.note = noteName;
            key.dataset.freq = freq;
            key.dataset.octave = octave;
            key.dataset.isWhite = isWhite;
            key.dataset.index = index;
            
            // Styling dengan flex
            if (isWhite) {
                key.style.cssText = `
                    flex: 0 0 30px;
                    height: 140px;
                    background: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 0 0 6px 6px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 8px;
                    z-index: 1;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: all 0.08s ease;
                    user-select: none;
                    touch-action: manipulation;
                    position: relative;
                `;
            } else {
                key.style.cssText = `
                    flex: 0 0 18px;
                    height: 85px;
                    background: #222;
                    border: 1px solid #111;
                    border-radius: 0 0 6px 6px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 4px;
                    margin-left: -9px;
                    margin-right: -9px;
                    z-index: 2;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                    transition: all 0.08s ease;
                    user-select: none;
                    touch-action: manipulation;
                    position: relative;
                `;
            }
            
            // Label - tampilkan nama nada lengkap
            const label = document.createElement('span');
            label.className = 'key-label';
            label.textContent = noteName;
            label.style.cssText = `
                font-size: 0.5rem;
                color: ${isWhite ? '#333' : '#888'};
                pointer-events: none;
                text-align: center;
                font-weight: 700;
                line-height: 1.2;
            `;
            key.appendChild(label);
            
            // Tooltip
            const freqFormatted = window.formatFrequency ? window.formatFrequency(freq) : freq.toFixed(5);
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
        });
        
        this.container.appendChild(wrapper);
        this.addOctaveLabels();
        this.isRendered = true;
        console.log('✅ Keyboard selesai dirender!');
    }

    addOctaveLabels() {
        const container = this.container;
        if (!container) return;
        
        const wrapper = container.querySelector('.keyboard-flex');
        if (!wrapper) return;
        
        const labelsWrapper = document.createElement('div');
        labelsWrapper.style.cssText = `
            display: flex;
            justify-content: space-around;
            padding: 6px 4px 0;
            font-size: 0.6rem;
            color: #556677;
            width: 100%;
            border-top: 1px solid #2a3a5e;
            margin-top: 4px;
        `;
        
        // Dapatkan nada pertama dan terakhir per oktaf
        const octaves = [2, 3, 4, 5, 6];
        const self = this;
        
        octaves.forEach(function(oct) {
            const notesInOctave = self.allNotes.filter(function(n) {
                return n.endsWith(oct);
            });
            if (notesInOctave.length > 0) {
                const first = notesInOctave[0];
                const last = notesInOctave[notesInOctave.length - 1];
                const label = document.createElement('span');
                label.textContent = 'Oktaf ' + oct + ' (' + first + ' - ' + last + ')';
                label.style.cssText = 'color:#556677;font-weight:600;font-size:0.55rem;';
                labelsWrapper.appendChild(label);
            }
        });
        
        container.appendChild(labelsWrapper);
    }

    bindEvents() {
        const self = this;
        
        // Keyboard QWERTY
        document.addEventListener('keydown', function(e) {
            const keyMap = {
                'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5,
                'u': 6, 'i': 7, 'o': 8, 'p': 9, 'a': 10, 's': 11,
                'd': 12, 'f': 13, 'g': 14, 'h': 15, 'j': 16, 'k': 17,
                'l': 18, ';': 19
            };
            const keyIndex = keyMap[e.key.toLowerCase()];
            if (keyIndex !== undefined && !e.repeat) {
                const octave = self.currentOctave;
                const noteName = window.getNoteName ? window.getNoteName(keyIndex) : 'E';
                const fullName = noteName + octave;
                const keyElement = self.keyElements[fullName];
                if (keyElement) {
                    e.preventDefault();
                    self.activateKey(keyElement);
                }
            }
        });
        
        document.addEventListener('keyup', function(e) {
            const keyMap = {
                'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5,
                'u': 6, 'i': 7, 'o': 8, 'p': 9, 'a': 10, 's': 11,
                'd': 12, 'f': 13, 'g': 14, 'h': 15, 'j': 16, 'k': 17,
                'l': 18, ';': 19
            };
            const keyIndex = keyMap[e.key.toLowerCase()];
            if (keyIndex !== undefined) {
                const octave = self.currentOctave;
                const noteName = window.getNoteName ? window.getNoteName(keyIndex) : 'E';
                const fullName = noteName + octave;
                const keyElement = self.keyElements[fullName];
                if (keyElement) {
                    e.preventDefault();
                    self.deactivateKey(keyElement);
                }
            }
        });
        
        // Octave selector untuk QWERTY
        const octaveSelect = document.getElementById('octaveSelect');
        if (octaveSelect) {
            octaveSelect.addEventListener('change', function() {
                self.currentOctave = parseInt(this.value);
                console.log('🔄 Oktaf QWERTY diubah ke: ' + self.currentOctave);
            });
        }
    }

    activateKey(key) {
        if (!key) return;
        
        const noteName = key.dataset.note;
        const freq = parseFloat(key.dataset.freq);
        const octave = key.dataset.octave;
        const isWhite = key.dataset.isWhite === 'true';
        
        // Visual - warna emas saat aktif
        key.style.background = '#ffd700';
        key.style.borderColor = '#f5a623';
        key.style.boxShadow = '0 0 30px rgba(255,215,0,0.5)';
        key.style.transform = 'scale(0.95)';
        
        // AUDIO - mainkan nada
        if (this.audioEngine && freq > 0) {
            console.log('🔊 Memainkan: ' + noteName + ' (' + freq.toFixed(2) + ' Hz)');
            this.audioEngine.playNote(noteName, freq, 0.8);
        } else {
            console.warn('⚠️ Gagal memainkan: ' + noteName + ', freq=' + freq);
        }
        
        this.activeKeys[noteName] = true;
        
        const freqFormatted = window.formatFrequency ? window.formatFrequency(freq) : freq.toFixed(5);
        this.updateDisplay(noteName, freqFormatted, octave);
    }

    deactivateKey(key) {
        if (!key) return;
        
        const noteName = key.dataset.note;
        const isWhite = key.dataset.isWhite === 'true';
        
        // Kembalikan warna asli
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
    }

    updateDisplay(noteName, freq, octave) {
        if (this.noteDisplay) this.noteDisplay.textContent = noteName || '-';
        if (this.freqDisplay) this.freqDisplay.textContent = freq || '-';
        if (this.octaveDisplay) this.octaveDisplay.textContent = octave || '-';
    }

    reRender() {
        this.render();
    }
}

if (typeof window !== 'undefined') {
    window.KeyboardRenderer = KeyboardRenderer;
}

console.log('✅ keyboard.js loaded');