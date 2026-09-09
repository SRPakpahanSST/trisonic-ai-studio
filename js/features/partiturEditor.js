// ================================================================
// partiturEditor.js - Partitur Editor
// ================================================================

class PartiturEditor {
    constructor() {
        this.notation = '';
        this.title = 'Komposisi Baru';
        this.composer = 'TriSonic AI';
        this.tempo = '120 BPM';
        this.history = [];
        this.historyIndex = -1;
        
        this.notationDisplay = document.getElementById('notationNotes');
        this.previewDisplay = document.getElementById('previewContent');
        this.titleInput = document.getElementById('scoreTitle');
        this.composerInput = document.getElementById('scoreComposer');
        this.tempoInput = document.getElementById('scoreTempo');
    }

    init() {
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
        
        this.loadFromLocalStorage();
        this.updateDisplay();
        this.updatePreview();
    }

    insertNote(note) {
        this.notation += note + ' ';
        this.updateDisplay();
        this.updatePreview();
        this.saveToLocalStorage();
        this.pushHistory();
    }

    clearNotation() {
        if (this.notation && !confirm('Hapus semua notasi?')) return;
        this.notation = '';
        this.updateDisplay();
        this.updatePreview();
        this.saveToLocalStorage();
        this.pushHistory();
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
        this.saveToLocalStorage();
        this.history = [];
        this.historyIndex = -1;
    }

    saveToLocalStorage() {
        try {
            const data = {
                notation: this.notation,
                title: this.title,
                composer: this.composer,
                tempo: this.tempo,
                timestamp: Date.now()
            };
            localStorage.setItem('trisonic_partitur', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    }

    loadFromLocalStorage() {
        try {
            const raw = localStorage.getItem('trisonic_partitur');
            if (raw) {
                const data = JSON.parse(raw);
                this.notation = data.notation || '';
                this.title = data.title || 'Komposisi Baru';
                this.composer = data.composer || 'TriSonic AI';
                this.tempo = data.tempo || '120 BPM';
                if (this.titleInput) this.titleInput.value = this.title;
                if (this.composerInput) this.composerInput.value = this.composer;
                if (this.tempoInput) this.tempoInput.value = this.tempo;
            }
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
        }
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
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.title || 'partitur'}.trisonic.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    loadScore(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.notation = data.notation || '';
                this.title = data.title || 'Komposisi Baru';
                this.composer = data.composer || 'TriSonic AI';
                this.tempo = data.tempo || '120 BPM';
                if (this.titleInput) this.titleInput.value = this.title;
                if (this.composerInput) this.composerInput.value = this.composer;
                if (this.tempoInput) this.tempoInput.value = this.tempo;
                this.updateDisplay();
                this.updatePreview();
                this.saveToLocalStorage();
            } catch (err) {
                alert('Gagal memuat file: ' + err.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    exportScore() {
        const text = `Judul: ${this.title}\nKomposer: ${this.composer}\nTempo: ${this.tempo}\nNotasi: ${this.notation.trim()}\nSistem: 20 Nada per Oktaf (A4=440Hz)`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.title || 'partitur'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    printScore() {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            alert('Mohon izinkan popup untuk mencetak.');
            return;
        }
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${this.title}</title>
                <style>
                    body { font-family: Georgia, serif; padding: 40px; max-width: 700px; margin: 0 auto; }
                    h1 { text-align: center; font-size: 24px; margin-bottom: 4px; }
                    .composer { text-align: center; color: #666; margin-bottom: 20px; }
                    .tempo { text-align: center; color: #888; margin-bottom: 30px; }
                    .notation { font-size: 28px; letter-spacing: 0.15em; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; font-family: monospace; }
                    .info { text-align: center; margin-top: 20px; color: #aaa; font-size: 12px; }
                    .footer { text-align: center; margin-top: 40px; color: #aaa; font-size: 12px; }
                    @media print { body { padding: 20px; } .no-print { display: none; } }
                </style>
            </head>
            <body>
                <h1>${this.title}</h1>
                <div class="composer">${this.composer}</div>
                <div class="tempo">${this.tempo}</div>
                <div class="notation">${this.notation.trim() || '(kosong)'}</div>
                <div class="info">Sistem 20 Nada per Oktaf · A4 = 440 Hz</div>
                <div class="footer">TriSonic AI Studio · Partitur Notasi Angka</div>
                <div class="no-print" style="text-align:center;margin-top:20px;">
                    <button onclick="window.print()" style="padding:8px 24px;font-size:16px;cursor:pointer;">🖨️ Cetak</button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    pushHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(this.notation);
        this.historyIndex = this.history.length - 1;
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }
}

if (typeof window !== 'undefined') {
    window.PartiturEditor = PartiturEditor;
}