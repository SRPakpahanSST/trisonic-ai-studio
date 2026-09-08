// ============================================================
// keyboard.js - Render Keyboard 20 Nada (5 Oktaf: C2 - D6)
// TriSonic AI Studio
// ============================================================

class KeyboardRenderer {
    constructor() {
        this.container = document.getElementById('keyboard');
        this.audioEngine = null;
        this.keyElements = {};
        this.activeKeys = new Set();
        this.currentOctave = 4;
        this.startOctave = 2;
        this.endOctave = 6;
        this.notesPerOctave = 20;
        this.totalKeys = (this.endOctave - this.startOctave + 1) * this.notesPerOctave; // 5 * 20 = 100 tuts
        this.isMouseDown = false;
        this.noteDisplay = document.getElementById('currentNote');
        this.freqDisplay = document.getElementById('currentFreq');
        this.octaveDisplay = document.getElementById('currentOctave');
    }

    init(audioEngine) {
        this.audioEngine = audioEngine;
        this.render();
        this.bindEvents();
        this.updateDisplay(null, null, null);
        console.log('✅ Keyboard siap dengan 5 oktaf (C2 - D6)');
    }

    render() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        this.keyElements = {};
        this.activeKeys.clear();
        
        // Gunakan flex layout untuk keyboard
        const keyboardWrapper = document.createElement('div');
        keyboardWrapper.className = 'keyboard-flex';
        keyboardWrapper.style.cssText = `
            display: flex;
            gap: 2px;
            padding: 4px;
            min-width: max-content;
            position: relative;
        `;
        
        let whiteCount = 0;
        const totalKeys = this.totalKeys;
        
        for (let i = 0; i < totalKeys; i++) {
            const noteIndex = i % this.notesPerOctave;
            const octave = Math.floor(i / this.notesPerOctave) + this.startOctave;
            const noteName = window.getNoteName ? window.getNoteName(noteIndex) : 'E';
            const fullName = noteName + octave;
            const freq = window.getFrequency ? window.getFrequency(noteIndex, octave) : 440;
            
            // Tuts putih = index genap, tuts hitam = index ganjil
            const isWhite = noteIndex % 2 === 0;
            
            const key = document.createElement('div');
            key.className = `key ${isWhite ? 'key-white' : 'key-black'}`;
            key.dataset.note = fullName;
            key.dataset.freq = freq;
            key.dataset.index = noteIndex;
            key.dataset.octave = octave;
            key.dataset.isWhite = isWhite;
            
            // Styling
            if (isWhite) {
                key.style.cssText = `
                    flex: 0 0 32px;
                    height: 140px;
                    background: #1a2332;
                    border: 1px solid #2a3a4a;
                    border-radius: 0 0 6px 6px;
                    cursor: pointer;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 8px;
                    transition: all 0.08s ease;
                    user-select: none;
                    z-index: 1;
                `;
                whiteCount++;
            } else {
                key.style.cssText = `
                    flex: 0 0 20px;
                    height: 85px;
                    background: #0a0e17;
                    border: 1px solid #1a2a3a;
                    border-radius: 0 0 6px 6px;
                    cursor: pointer;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 4px;
                    margin-left: -10px;
                    margin-right: -10px;
                    z-index: 2;
                    transition: all 0.08s ease;
                    user-select: none;
                `;
            }
            
            // Label
            const label = document.createElement('span');
            label.className = 'key-label';
            label.textContent = noteName;
            label.style.cssText = `
                font-size: 0.55rem;
                color: ${isWhite ? '#8899aa' : '#556677'};
                pointer-events: none;
                text-align: center;
                font-weight: 600;
            `;
            key.appendChild(label);
            
            // Tooltip
            key.title = `${fullName} - ${freq.toFixed(2)} Hz`;
            
            // Event listeners
            key.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.activateKey(key);
                this.isMouseDown = true;
            });
            
            key.addEventListener('mouseup', (e) => {
                e.preventDefault();
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
            
            keyboardWrapper.appendChild(key);
            this.keyElements[fullName] = key;
        }
        
        this.container.appendChild(keyboardWrapper);
        this.addOctaveLabels();
    }

    addOctaveLabels() {
        const container = this.container;
        const labelsWrapper = document.createElement('div');
        labelsWrapper.style.cssText = `
            display: flex;
            justify-content: space-around;
            padding: 6px 4px 0;
            font-size: 0.7rem;
            color: var(--text-muted, #556677);
            width: 100%;
            border-top: 1px solid #1a2a3a;
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
        // Keyboard computer (QWERTY)
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
                this.updateDisplay(null, null, this.currentOctave);
            });
        }
    }

    activateKey(key) {
        if (!key) return;
        
        const noteName = key.dataset.note;
        const freq = parseFloat(key.dataset.freq);
        const octave = key.dataset.octave;
        const isWhite = key.dataset.isWhite === 'true';
        
        // Visual
        key.style.background = isWhite ? '#2196F3' : '#4CAF50';
        key.style.transform = 'scale(0.95)';
        key.style.boxShadow = '0 0 25px rgba(33,150,243,0.4)';
        key.style.borderColor = '#2196F3';
        
        // Audio
        if (this.audioEngine && freq > 0) {
            this.audioEngine.playNote(noteName, freq, 0.8);
        }
        
        this.activeKeys.add(noteName);
        this.updateDisplay(noteName, freq, octave);
    }

    deactivateKey(key) {
        if (!key) return;
        
        const noteName = key.dataset.note;
        const isWhite = key.dataset.isWhite === 'true';
        
        // Visual
        key.style.background = isWhite ? '#1a2332' : '#0a0e17';
        key.style.transform = '';
        key.style.boxShadow = '';
        key.style.borderColor = isWhite ? '#2a3a4a' : '#1a2a3a';
        
        // Audio
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
                key.style.background = isWhite ? '#1a2332' : '#0a0e17';
                key.style.transform = '';
                key.style.boxShadow = '';
                key.style.borderColor = isWhite ? '#2a3a4a' : '#1a2a3a';
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
        if (this.freqDisplay) this.freqDisplay.textContent = freq ? freq.toFixed(2) : '-';
        if (this.octaveDisplay) this.octaveDisplay.textContent = octave || '-';
    }

    setOctave(octave) {
        this.currentOctave = Math.max(this.startOctave, Math.min(this.endOctave, octave));
        const octaveSelect = document.getElementById('octaveSelect');
        if (octaveSelect) octaveSelect.value = this.currentOctave;
    }
}

if (typeof window !== 'undefined') {
    window.KeyboardRenderer = KeyboardRenderer;
}