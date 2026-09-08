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
    }

    /**
     * Inisialisasi keyboard
     * @param {AudioEngine} audioEngine - Instance AudioEngine
     */
    init(audioEngine) {
        this.audioEngine = audioEngine;
        this.render();
        this.bindEvents();
        this.updateDisplay(null, null, null);
    }

    /**
     * Render keyboard 5 oktaf (C2 - D6)
     */
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        this.keyElements = {};
        this.activeKeys.clear();
        
        const totalKeys = (this.endOctave - this.startOctave + 1) * this.notesPerOctave;
        const keyWidth = 30;
        const keyHeight = 120;
        const blackKeyWidth = 18;
        const blackKeyHeight = 70;
        
        // Gunakan flex layout
        const keyboardWrapper = document.createElement('div');
        keyboardWrapper.className = 'keyboard-flex';
        keyboardWrapper.style.cssText = `
            display: flex;
            gap: 2px;
            padding: 4px;
            min-width: max-content;
        `;
        
        let whiteCount = 0;
        
        for (let i = 0; i < totalKeys; i++) {
            const noteIndex = i % this.notesPerOctave;
            const octave = Math.floor(i / this.notesPerOctave) + this.startOctave;
            const noteName = window.getNoteName ? window.getNoteName(noteIndex) : 'E';
            const fullName = noteName + octave;
            const freq = window.getFrequency ? window.getFrequency(noteIndex, octave) : 440;
            
            // Determine if it's a "white" key (even index)
            const isWhite = noteIndex % 2 === 0;
            
            const key = document.createElement('div');
            key.className = `key ${isWhite ? 'key-white' : 'key-black'}`;
            key.dataset.note = fullName;
            key.dataset.freq = freq;
            key.dataset.index = noteIndex;
            key.dataset.octave = octave;
            
            if (isWhite) {
                key.style.cssText = `
                    flex: 0 0 ${keyWidth}px;
                    height: ${keyHeight}px;
                    background: #1a2332;
                    border: 1px solid #2a3a4a;
                    border-radius: 0 0 4px 4px;
                    cursor: pointer;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 6px;
                    transition: all 0.08s ease;
                    user-select: none;
                `;
                whiteCount++;
            } else {
                key.style.cssText = `
                    flex: 0 0 ${blackKeyWidth}px;
                    height: ${blackKeyHeight}px;
                    background: #0a0e17;
                    border: 1px solid #1a2a3a;
                    border-radius: 0 0 4px 4px;
                    cursor: pointer;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    padding-bottom: 3px;
                    margin-left: -${blackKeyWidth/2}px;
                    margin-right: -${blackKeyWidth/2}px;
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
            `;
            key.appendChild(label);
            
            // Tooltip
            key.title = `${fullName} - ${freq.toFixed(2)} Hz`;
            
            keyboardWrapper.appendChild(key);
            this.keyElements[fullName] = key;
        }
        
        this.container.appendChild(keyboardWrapper);
        
        // Add octave labels
        this.addOctaveLabels(keyboardWrapper);
    }

    /**
     * Tambahkan label oktaf
     */
    addOctaveLabels(container) {
        const labels = document.createElement('div');
        labels.style.cssText = `
            display: flex;
            justify-content: space-around;
            padding: 4px 10px 0;
            font-size: 0.7rem;
            color: var(--text-muted);
            width: 100%;
        `;
        
        for (let octave = this.startOctave; octave <= this.endOctave; octave++) {
            const label = document.createElement('span');
            label.textContent = `Oktaf ${octave}`;
            labels.appendChild(label);
        }
        
        this.container.appendChild(labels);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Mouse events
        this.container.addEventListener('mousedown', (e) => {
            const key = e.target.closest('.key');
            if (key) {
                e.preventDefault();
                this.activateKey(key);
            }
        });
        
        this.container.addEventListener('mouseup', (e) => {
            const key = e.target.closest('.key');
            if (key) {
                this.deactivateKey(key);
            }
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.deactivateAll();
        });
        
        // Touch events
        this.container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const key = target ? target.closest('.key') : null;
            if (key) this.activateKey(key);
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
        
        // Keyboard (Q-W-E-R-T-Y-U-I-O-P-A-S-D-F-G-H-J-K-L)
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
    }

    /**
     * Aktivasi key
     * @param {HTMLElement} key - Elemen key
     */
    activateKey(key) {
        if (!key) return;
        
        const noteName = key.dataset.note;
        const freq = parseFloat(key.dataset.freq);
        
        // Visual
        key.classList.add('active');
        key.style.transform = 'scale(0.95)';
        key.style.boxShadow = '0 0 20px rgba(33,150,243,0.3)';
        
        // Audio
        if (this.audioEngine && freq > 0) {
            this.audioEngine.playNote(noteName, freq, 0.8);
        }
        
        this.activeKeys.add(noteName);
        this.updateDisplay(noteName, freq, key.dataset.octave);
    }

    /**
     * Deaktivasi key
     * @param {HTMLElement} key - Elemen key
     */
    deactivateKey(key) {
        if (!key) return;
        
        const noteName = key.dataset.note;
        
        // Visual
        key.classList.remove('active');
        key.style.transform = '';
        key.style.boxShadow = '';
        
        // Audio (dihentikan otomatis oleh durasi)
        if (this.audioEngine) {
            this.audioEngine.stopNote(noteName);
        }
        
        this.activeKeys.delete(noteName);
        if (this.activeKeys.size === 0) {
            this.updateDisplay(null, null, null);
        }
    }

    /**
     * Deaktivasi semua key
     */
    deactivateAll() {
        Object.keys(this.keyElements).forEach(noteName => {
            const key = this.keyElements[noteName];
            if (key) {
                key.classList.remove('active');
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

    /**
     * Update display
     */
    updateDisplay(noteName, freq, octave) {
        const noteDisplay = document.getElementById('currentNote