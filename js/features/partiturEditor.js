// ================================================================
// partiturEditor.js - Partitur Editor
// ================================================================

class PartiturEditor {
    constructor() {
        this.notation = '1 2 3 4 5 6 7 1\'';
        this.title = 'Komposisi Baru';
        this.composer = 'TriSonic AI';
        this.tempo = '120 BPM';
        
        this.notationDisplay = null;
        this.previewDisplay = null;
        this.titleInput = null;
        this.composerInput = null;
        this.tempoInput = null;
    }

    init() {
        this.notationDisplay = document.getElementById('notationNotes');
        this.previewDisplay = document.getElementById('previewContent');
        this.titleInput = document.getElementById('scoreTitle');
        this.composerInput = document.getElementById('scoreComposer');
        this.tempoInput = document.getElementById('scoreTempo');
        
        // Note buttons
        document.querySelectorAll('.note-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const note = btn.dataset.note;
                if (note) this.insertNote(note);
            });
        });
        
        document.getElementById('clearNotationBtn')?.addEventListener('click', () => {
            this.clearNotation();
        });
        
        document.getElementById('newScoreBtn')?.addEventListener('click', () => {
            this.newScore();
        });
        
        document.getElementById('saveScoreBtn')?.addEventListener('click', () => {
            this.saveScore();
        });
        
        document.getElementById('loadScoreBtn')?.addEventListener('click', () => {
            document.getElementById('scoreFileInput')?.click();
        });
        document.getElementById('scoreFileInput')?.addEventListener('change', (e) => {
            this.loadScore(e);
        });
        
        document.getElementById('exportScoreBtn')?.addEventListener('click', () => {
            this.exportScore();
        });
        
        document.getElementById('printScoreBtn')?.addEventListener('click', () => {
            this.printScore();
        });
        
        if (this.titleInput) {
            this.titleInput.addEventListener('change', () => {
                this.title = this.titleInput.value;
                this.updatePreview();
            });
        }
        if (this.composerInput) {
            this.composerInput.addEventListener('change', () => {
                this.composer = this.composerInput.value;
                this.updatePreview();
            });
        }
        if (this.tempoInput) {
            this.tempoInput.addEventListener('change', () => {
                this.tempo = this.tempoInput.value;
                this.updatePreview();
            });
        }
        
        this.updateDisplay();
        this.updatePreview();
    }

    insertNote(note) {
        this.notation += note + ' ';
        this.updateDisplay();
        this.updatePreview();
    }

    clearNotation() {
        if (this.notation && !confirm('Hapus semua notasi?')) return;
        this.notation = '';
        this.updateDisplay();
        this.updatePreview();
    }

    updateDisplay() {
        if (this.notationDisplay) {
            this.notationDisplay.textContent = this.notation.trim() || 'Kosong';
        }
    }

    updatePreview() {
        if (this.previewDisplay) {
            const title = this.title || 'Judul';
            const composer = this.composer || 'Komposer';
            const tempo = this.tempo || '120 BPM';
            const notes = this.notation.trim() || '(kosong)';
            
            this.previewDisplay.innerHTML = `
                <div style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:0.25rem;">
                    <strong>${title}</strong> · ${composer} · ${tempo}
                </div>
                <div style="font-size:1.4rem;letter-spacing:0.1em;color:var(--text-primary);">
                    ${notes}
                </div>
            `;
        }
    }

    newScore() {
        if (this.notation && !confirm('Hapus partitur saat ini?')) return;
        this.notation = '';
        this.title = 'Komposisi Baru';
        this.composer = 'TriSonic AI';
        this.tempo = '120 BPM';
        if (this.titleInput) this.titleInput.value = this.title;
        if (this.composerInput) this.composerInput.value = this.composer;
        if (this.tempoInput) this.tempoInput.value = this.tempo;
        this.updateDisplay();
        this.updatePreview();
    }

    saveScore() {
        const data = {
            version: '2.0',
            title: this.title,
            composer: this.composer,
            tempo: this.tempo,
            notation: this.notation,
            scale: '20-note microtonal',
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2