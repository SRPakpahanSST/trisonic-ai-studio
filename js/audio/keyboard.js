// ============================================================
// keyboard.js - Render Keyboard, Interaksi Tuts
// TriSonic AI Studio
// ============================================================

class KeyboardRenderer {
    constructor() {
        this.container = document.getElementById('keyboard');
        this.audioEngine = null;
        this.currentNote = null;
        this.currentFreq = null;
        this.isMouseDown = false;
        this.noteElements = new Map();
        
        // Konfigurasi keyboard
        this.config = {
            startOctave: 3,
            endOctave: 6,
            keysPerOctave: 20,
            totalKeys: 80, // 4 oktaf
        };
        
        // Warna tuts
        this.colors = {
            white: '#1a2332',
            whiteActive: '#2a4a6a',
            black: '#0a0e17',
            blackActive: '#1a3a5a',
            highlight: '#2196F3',
        };
    }
    
    /**
     * Inisialisasi keyboard
     * @param {AudioEngine} audioEngine - Instance AudioEngine
     */
    init(audioEngine) {
        this.audioEngine = audioEngine;
        this.render();
        this.bindEvents();
        this.updateDisplay(null, null);
    }
    
    /**
     * Render keyboard
     */
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        this.noteElements.clear();
        
        // Tentukan layout white/black keys berdasarkan pattern 20-note
        // Untuk visual, kita gunakan semua tuts dengan ukuran seragam dengan penanda
        const totalKeys = this.config.totalKeys;
        
        for (let i = 0; i < totalKeys; i++) {
            const noteIndex = i % this.config.keysPerOctave;
            const octave = Math.floor(i / this.config.keysPerOctave) + this.config.startOctave;
            
            // Dapatkan nama nada
            const noteObj = getNoteByIndex ? getNoteByIndex(noteIndex) : { name: 'C' };
            const noteName = noteObj.name + octave;
            
            // Tentukan apakah ini "white" atau "black" key (visual)
            // Dalam 20-note, kita gunakan pattern: index 0,2,4,6,8,10,12,14,16,18 sebagai "white"
            const isWhite = noteIndex % 2 === 0;
            
            const key = document.createElement('div');
            key.className = `key ${isWhite ? 'key-white' : 'key-black'}`;
            key.dataset.note = noteName;
            key.dataset.index = i;
            key.dataset.octave = octave;
            key.dataset.noteIndex = noteIndex;
            
            // Label
            const label = document.createElement('span');
            label.className = 'key-label';
            label.textContent = noteObj.name || noteName;
            key.appendChild(label);
            
            // Frekuensi (tooltip)
            const freq = getFrequency ? getFrequency(noteIndex, octave) : 440;
            key.title = `${noteName} - ${freq.toFixed(2)} Hz`;
            
            // Style
            if (isWhite) {
                key.style.background = this.colors.white;
                key.style.border = '1px solid #2a3a4a';
            } else {
                key.style.background = this.colors.black;
                key.style.border = '1px solid #1a2a3a';
                key.style.marginTop = '-40px';
                key.style.height = '60px';
                key.style.zIndex = '2';
            }
            
            this.container.appendChild(key);
            this.noteElements.set(noteName, key);
        }
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Mouse events
        this.container.addEventListener('mousedown', (e) => {
            const key = e.target.closest('.key');
            if (key) {
                this.isMouseDown = true;
                this.activateKey(key);
            }
        });
        
        this.container.addEventListener('mouseup', () => {
            this.isMouseDown = false;
            this.deactivateAll();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isMouseDown = false;
            this.deactivateAll();
        });
        
        this.container.addEventListener('mouseover', (e) => {
            if (this.isMouseDown) {
                const key = e.target.closest('.key');
                if (key) {
                    this.deactivateAll();
                    this.activateKey(key);
                }
            }
        });
        
        // Touch events
        this.container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const key = target ? target.closest('.key') : null;
            if (key) {
                this.activateKey(key);
            }
        });
        
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const key = target ? target.closest('.key') : null;
            if (key) {
                this.deactivateAll();
                this.activateKey(key);
            }
        });
        
        this.container.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.deactivateAll();
        });
        
        // Keyboard (computer keyboard) support
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                'a': 0, 'w': 1, 's': 2, 'e': 3, 'd': 4, 'r': 5, 'f': 6, 't': 7,
                'g': 8, 'y': 9, 'h': 10, 'u': 11, 'j': 12, 'i': 13, 'k': 14, 'o': 15,
                'l': 16, 'p': 17, ';': 18, "'": 19
            };
            
            const keyIndex = keyMap[e.key.toLowerCase()];
            if (keyIndex !== undefined && !e.repeat) {
                const octave = 4;
                const noteIndex = keyIndex;
                const noteObj = getNoteByIndex ? getNoteByIndex(noteIndex) : { name: 'C' };
                const noteName = noteObj.name + octave;
                const keyElement = this.noteElements.get(noteName);
                if (keyElement) {
                    this.activateKey(keyElement);
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            const keyMap = {
                'a': 0, 'w': 1, 's': 2, 'e': 3, 'd': 4, 'r': 5, 'f': 6, 't': 7,
                'g': 8, 'y': 9, 'h': 10, 'u': 11, 'j': 12, 'i': 13, 'k': 14, 'o': 15,
                'l': 16, 'p': 17, ';': 18, "'": 19
            };
            
            const keyIndex = keyMap[e.key.toLowerCase()];
            if (keyIndex !== undefined) {
                const octave = 4;
                const noteObj = getNoteByIndex ? getNoteByIndex(keyIndex) : { name: 'C' };
                const noteName = noteObj.name + octave;
                const keyElement = this.noteElements.get(noteName);
                if (keyElement) {
                    this.deactivateKey(keyElement);
                }
            }
        });
    }
    
    /**
     * Aktivasi tuts
     * @param {HTMLElement} key - Elemen tuts
     */
    activateKey(key) {
        if (!key) return;
        
        const noteName = key.dataset.note;
        const freq = this.getFrequencyFromKey(key);
        
        // Update visual
        const isWhite = key.classList.contains('key-white');
        key.style.background = isWhite ? this.colors.whiteActive : this.colors.blackActive;
        key.style.transform = 'translateY(2px)';
        key.style.boxShadow = '0 0 20px rgba(33,150,243,0.3)';
        
        // Mainkan suara
        if (this.audioEngine && freq > 0) {
            this.audioEngine.playNote(noteName, freq);
        }
        
        // Update display
        this.updateDisplay(noteName, freq);
        this.currentNote = noteName;
        this.currentFreq = freq;
    }
    
    /**
     * Deaktivasi satu tuts
     * @param {HTMLElement} key - Elemen tuts
     */
    deactivateKey(key) {
        if (!key) return;
        
        const noteName = key.dataset.note;
        const isWhite = key.classList.contains('key-white');
        key.style.background = isWhite ? this.colors.white : this.colors.black;
        key.style.transform = 'translateY(0)';
        key.style.boxShadow = 'none';
        
        // Hentikan suara
        if (this.audioEngine) {
            this.audioEngine.stopNote(noteName);
        }
    }
    
    /**
     * Deaktivasi semua tuts
     */
    deactivateAll() {
        const keys = this.container.querySelectorAll('.key');
        keys.forEach(key => {
            const isWhite = key.classList.contains('key-white');
            key.style.background = isWhite ? this.colors.white : this.colors.black;
            key.style.transform = 'translateY(0)';
            key.style.boxShadow = 'none';
        });
        
        if (this.audioEngine) {
            this.audioEngine.stopAll();
        }
        
        this.updateDisplay(null, null);
        this.currentNote = null;
        this.currentFreq = null;
    }
    
    /**
     * Mendapatkan frekuensi dari elemen tuts
     */
    getFrequencyFromKey(key) {
        const noteIndex = parseInt(key.dataset.noteIndex);
        const octave = parseInt(key.dataset.octave);
        if (getFrequency) {
            return getFrequency(noteIndex, octave);
        }
        return 0;
    }
    
    /**
     * Update display nada
     */
    updateDisplay(noteName, freq) {
        const noteDisplay = document.getElementById('currentNote');
        const freqDisplay = document.getElementById('currentFreq');
        
        if (noteDisplay) {
            noteDisplay.textContent = noteName || '-';
        }
        if (freqDisplay) {
            freqDisplay.textContent = freq ? freq.toFixed(2) : '-';
        }
    }
    
    /**
     * Update pengaturan
     */
    updateSettings(settings) {
        // Implementasi untuk update setting dari kontrol
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeyboardRenderer;
}