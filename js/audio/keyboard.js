// ================================================================
// keyboard.js - Render Keyboard 20 Nada (C2 - D6)
// ================================================================

class KeyboardRenderer {
    constructor() {
        this.container = null;
        this.audioEngine = null;
        this.keyElements = {};
        this.activeKeys = new Set();
        this.currentOctave = 4;
        this.startOctave = 2;
        this.endOctave = 6;
        this.isMouseDown = false;
        this.isRendered = false;
        
        this.noteDisplay = null;
        this.freqDisplay = null;
        this.octaveDisplay = null;
    }

    init(audioEngine) {
        console.log('🎹 KeyboardRenderer.init() dipanggil');
        
        this.audioEngine = audioEngine;
        this.container = document.getElementById('keyboard');
        this.noteDisplay = document.getElementById('currentNote');
        this.freqDisplay = document.getElementById('currentFreq');
        this.octaveDisplay = document.getElementById('currentOctave');
        
        // Cek apakah container ditemukan
        if (!this.container) {
            console.error('❌ Container keyboard tidak ditemukan!');
            return;
        }
        
        console.log('✅ Container keyboard ditemukan:', this.container);
        
        // Render keyboard
        this.render();
        this.bindEvents();
        this.updateDisplay(null, null, null);
        
        console.log('✅ Keyboard siap (C2 - D6, 20 nada/oktaf)');
    }

    render() {
        if (!this.container) {
            console.warn('⚠️ Container keyboard tidak ditemukan!');
            return;
        }
        
        console.log('🎹 render() dipanggil, merender ' + (window.getAllNotes ? window.getAllNotes().length : '?') + ' tuts');
        
        // Kosongkan container
        this.container.innerHTML = '';
        this.keyElements = {};
        this.activeKeys.clear();
        
        // Dapatkan semua nada dari C2 sampai D6
        let allNotes = [];
        if (typeof window.getAllNotes === 'function') {
            allNotes = window.getAllNotes();
        } else {
            // Fallback jika fungsi tidak tersedia
            console.warn('⚠️ getAllNotes tidak tersedia, menggunakan data manual');
            const NOTES_20 = ['E','E#','F','F#','G','G#','H','H#','I','J','J#','K','K#','A','A#','B','B#','C','C#','D'];
            for (let oct = 2; oct <= 6; oct++) {
                for (const note of NOTES_20) {
                    const fullName = note + oct;
                    if (window.FREQ_MAP && window.FREQ_MAP[fullName] !== undefined) {
                        allNotes.push(fullName);
                    }
                }
            }
        }
        
        if (allNotes.length === 0) {
            console.error('❌ Tidak ada nada yang ditemukan!');
            this.container.innerHTML = '<p style="color:#8899aa;padding:20px;text-align:center;">⚠️ Gagal memuat keyboard. Silakan refresh halaman.</p>';
            return;
        }
        
        console.log('✅ Jumlah tuts: ' + allNotes.length);
        
        // Buat wrapper keyboard
        const wrapper = document.createElement('div');
        wrapper.className = 'keyboard-flex';
        wrapper.style.cssText = `
            display: flex;
            gap: 2px;
            padding: 8px;
            min-width: max-content;
            position: relative;
            background: #1a1a2e;
            border-radius: 10px;
            border: 2px solid #2a3a5e;
            overflow-x: auto;
        `;
        
        // Buat setiap tuts
        allNotes.forEach((noteName) => {
            const freq = window.getFrequencyFromNote ? window.getFrequencyFromNote(noteName) : 0;
            const match = noteName.match(/^([A-Z#]+)(\d+)$/);
            if (!match) return;
            
            const [, note, octave] = match;
            const index = window.getNoteIndex ? window.getNoteIndex(note) : 0;
            const isWhite = index % 2 === 0;
            
            const key = document.createElement('div');
            key.className = `key ${isWhite ? 'key-white' : 'key-black'}`;
            key.dataset.note = noteName;
            key.dataset.freq = freq;
            key.dataset.index = index;
            key.dataset.octave = octave;
            key.dataset.isWhite = isWhite;
            
            // Styling
            if (isWhite) {
                key.style.cssText = `
                    flex: 0 0 32px;
                    height: 150px;
                    background: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 0 0 6px 6px;
                    cursor: pointer;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 10px;
                    transition: all 0.08s ease;
                    user-select: none;
                    z-index: 1;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                `;
            } else {
                key.style.cssText = `
                    flex: 0 0 22px;
                    height: 90px;
                    background: #222;
                    border: 1px solid #111;
                    border-radius: 0 0 6px 6px;
                    cursor: pointer;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 6px;
                    margin-left: -11px;
                    margin-right: -11px;
                    z-index: 2;
                    transition: all 0.08s ease;
                    user-select: none;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                `;
            }
            
            // Label
            const label = document.createElement('span');
            label.className = 'key-label';
            label.textContent = note;
            label.style.cssText = `
                font-size: 0.6rem;
                color: ${isWhite ? '#333' : '#888'};
                pointer-events: none;
                text-align: center;
                font-weight: 700;
            `;
            key.appendChild(label);
            
            // Tooltip dengan frekuensi
            const freqFormatted = window.formatFrequency ? window.formatFrequency(freq) : freq.toFixed(5);
            key.title = `${noteName} - ${freqFormatted} Hz`;
            
            // Event listeners
            key.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.activateKey(key);
                this.isMouseDown = true;
            });
            
            key.addEventListener('mouseup', () => {
                this.deactivateKey(key);
                this.isMouseDown = false;
            });
            
            key.addEventListener('mouseleave', () => {
                if (this.isMouseDown) {
                    this.deactivateKey(key);
                    this.isMouseDown = false;
                }
            });
            
            key.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.activateKey(key);
            }, { passive: false });
            
            key.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.deactivateKey(key);
            }, { passive: false });
            
            wrapper.appendChild(key);
            this.keyElements[noteName] = key;
        });
        
        this.container.appendChild(wrapper);
        this.addOctaveLabels();
        this.isRendered = true;
        
        console.log('✅ Keyboard selesai dirender!');
    }

    addOctaveLabels() {
        const container = this.container;
        if (!container) return;
        
        const labelsWrapper = document.createElement('div');
        labelsWrapper.style.cssText = `
            display: flex;
            justify-content: space-around;
            padding: 6px 4px 0;
            font-size: 0.7rem;
            color: #556677;
            width: 100%;
            border-top: 1px solid #2a3a5e;
            margin-top: 4px;
        `;
        
        for (let octave = this.startOctave; octave <= this.endOctave; octave++) {
            const label = document.createElement('span');
            label.textContent = `Oktaf ${octave}`;
            label.style.cssText = `
                color: #556677;
                font-weight: 600;
                letter-spacing: 0.5px;
            `;
            labelsWrapper.appendChild(label);
        }
        
        container.appendChild(labelsWrapper);
    }

    bindEvents() {
        // Keyboard QWERTY
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5,
                'u': 6, 'i': 7, 'o': 8, 'p': 9, 'a': 10, 's': 11,
                'd': 12, 'f': 13, 'g': 14, 'h': 15, 'j': 16, 'k': 17,
                'l': 18, ';': 19
            };
            
            const keyIndex = keyMap[e.key.toLowerCase()];
            if (keyIndex !== undefined && !e.repeat) {
                const octave = this.currentOctave;
                const noteName = window.getNoteName ? window.getNoteName(keyIndex) : 'E';
                const fullName = noteName + octave;
                const keyElement = this.keyElements[fullName];
                if (keyElement) {
                    e.preventDefault();
                    this.activateKey(keyElement);
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            const keyMap = {
                'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4, 'y': 5,
                'u': 6, 'i': 7, 'o': 8, 'p': 9, 'a': 10, 's': 11,
                'd': 12, 'f': 13, 'g': 14, 'h': 15, 'j': 16, 'k': 17,
                'l': 18, ';': 19
            };
            
            const keyIndex = keyMap[e.key.toLowerCase()];
            if (keyIndex !== undefined) {
                const octave = this.currentOctave;
                const noteName = window.getNoteName ? window.getNoteName(keyIndex) : 'E';
                const fullName = noteName + octave;
                const keyElement = this.keyElements[fullName];
                if (keyElement) {
                    e.preventDefault();
                    this.deactivateKey(keyElement);
                }
            }
        });
        
        // Octave selector
        const octaveSelect = document.getElementById('octaveSelect');
        if (octaveSelect) {
            octaveSelect.addEventListener('change', () => {
                this.currentOctave = parseInt(octaveSelect.value);
            });
        }
    }

    activateKey(key) {
        if (!key) return;
        
        const noteName = key.dataset.note;
        const freq = parseFloat(key.dataset.freq);
        const octave = key.dataset.octave;
        
        // Visual - warna emas saat aktif
        key.style.background = '#ffd700';
        key.style.borderColor = '#f5a623';
        key.style.boxShadow = '0 0 30px rgba(255,215,0,0.5)';
        key.style.transform = 'scale(0.95)';
        
        // Mainkan suara
        if (this.audioEngine && freq > 0) {
            this.audioEngine.playNote(noteName, freq, 0.8);
        }
        
        this.activeKeys.add(noteName);
        
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
        
        if (this.audioEngine) {
            this.audioEngine.stopNote(noteName);
        }
        
        this.activeKeys.delete(noteName);
        if (this.activeKeys.size === 0) {
            this.updateDisplay(null, null, null);
        }
    }

    deactivateAll() {
        Object.keys(this.keyElements).forEach(noteName => {
            const key = this.keyElements[noteName];
            if (key) {
                const isWhite = key.dataset.isWhite === 'true';
                key.style.background = isWhite ? '#f0f0f0' : '#222';
                key.style.borderColor = isWhite ? '#ccc' : '#111';
                key.style.transform = '';
                key.style.boxShadow = '';
            }
        });
        
        if (this.audioEngine) {
            this.audioEngine.stopAll();
        }
        
        this.activeKeys.clear();
        this.updateDisplay(null, null, null);
    }

    updateDisplay(noteName, freq, octave) {
        if (this.noteDisplay) this.noteDisplay.textContent = noteName || '-';
        if (this.freqDisplay) this.freqDisplay.textContent = freq || '-';
        if (this.octaveDisplay) this.octaveDisplay.textContent = octave || '-';
    }

    setOctave(octave) {
        this.currentOctave = Math.max(this.startOctave, Math.min(this.endOctave, octave));
        const octaveSelect = document.getElementById('octaveSelect');
        if (octaveSelect) octaveSelect.value = this.currentOctave;
    }
    
    // Method untuk re-render jika diperlukan
    reRender() {
        console.log('🔄 Re-render keyboard...');
        this.render();
    }
}

if (typeof window !== 'undefined') {
    window.KeyboardRenderer = KeyboardRenderer;
}