// ================================================================
// partiturEditor.js - Partitur Editor
// ================================================================

function PartiturEditor() {
    this.notation = '1 2 3 4 5 6 7 1\'';
    this.title = 'Komposisi Baru';
    this.composer = 'TriSonic AI';
    this.tempo = '120 BPM';
    this.notationDisplay = null;
    this.previewDisplay = null;
}

PartiturEditor.prototype.init = function() {
    var self = this;
    
    this.notationDisplay = document.getElementById('notationNotes');
    this.previewDisplay = document.getElementById('previewContent');
    this.titleInput = document.getElementById('scoreTitle');
    this.composerInput = document.getElementById('scoreComposer');
    this.tempoInput = document.getElementById('scoreTempo');
    
    document.querySelectorAll('.note-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var note = this.dataset.note;
            if (note) self.insertNote(note);
        });
    });
    
    document.getElementById('clearNotationBtn')?.addEventListener('click', function() {
        self.clearNotation();
    });
    
    document.getElementById('newScoreBtn')?.addEventListener('click', function() {
        self.newScore();
    });
    
    document.getElementById('saveScoreBtn')?.addEventListener('click', function() {
        self.saveScore();
    });
    
    document.getElementById('loadScoreBtn')?.addEventListener('click', function() {
        document.getElementById('scoreFileInput')?.click();
    });
    
    document.getElementById('scoreFileInput')?.addEventListener('change', function(e) {
        self.loadScore(e);
    });
    
    document.getElementById('exportScoreBtn')?.addEventListener('click', function() {
        self.exportScore();
    });
    
    document.getElementById('printScoreBtn')?.addEventListener('click', function() {
        self.printScore();
    });
    
    if (this.titleInput) {
        this.titleInput.addEventListener('change', function() {
            self.title = this.value;
            self.updatePreview();
        });
    }
    if (this.composerInput) {
        this.composerInput.addEventListener('change', function() {
            self.composer = this.value;
            self.updatePreview();
        });
    }
    if (this.tempoInput) {
        this.tempoInput.addEventListener('change', function() {
            self.tempo = this.value;
            self.updatePreview();
        });
    }
    
    this.updateDisplay();
    this.updatePreview();
};

PartiturEditor.prototype.insertNote = function(note) {
    this.notation += note + ' ';
    this.updateDisplay();
    this.updatePreview();
};

PartiturEditor.prototype.clearNotation = function() {
    if (this.notation && !confirm('Hapus semua notasi?')) return;
    this.notation = '';
    this.updateDisplay();
    this.updatePreview();
};

PartiturEditor.prototype.updateDisplay = function() {
    if (this.notationDisplay) {
        this.notationDisplay.textContent = this.notation.trim() || 'Kosong';
    }
};

PartiturEditor.prototype.updatePreview = function() {
    if (this.previewDisplay) {
        var title = this.title || 'Judul';
        var composer = this.composer || 'Komposer';
        var tempo = this.tempo || '120 BPM';
        var notes = this.notation.trim() || '(kosong)';
        this.previewDisplay.innerHTML = '<div style="font-size:0.9rem;color:#8899aa;margin-bottom:0.25rem;"><strong>' + title + '</strong> · ' + composer + ' · ' + tempo + '</div><div style="font-size:1.4rem;letter-spacing:0.1em;color:#e8edf5;">' + notes + '</div>';
    }
};

PartiturEditor.prototype.newScore = function() {
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
};

PartiturEditor.prototype.saveScore = function() {
    var data = {
        version: '2.0',
        title: this.title,
        composer: this.composer,
        tempo: this.tempo,
        notation: this.notation,
        timestamp: new Date().toISOString()
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (this.title || 'partitur') + '.trisonic.json';
    a.click();
    URL.revokeObjectURL(url);
};

PartiturEditor.prototype.loadScore = function(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    var self = this;
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            self.notation = data.notation || '';
            self.title = data.title || 'Komposisi Baru';
            self.composer = data.composer || 'TriSonic AI';
            self.tempo = data.tempo || '120 BPM';
            if (self.titleInput) self.titleInput.value = self.title;
            if (self.composerInput) self.composerInput.value = self.composer;
            if (self.tempoInput) self.tempoInput.value = self.tempo;
            self.updateDisplay();
            self.updatePreview();
        } catch (err) {
            alert('Gagal memuat file: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
};

PartiturEditor.prototype.exportScore = function() {
    var text = 'Judul: ' + this.title + '\nKomposer: ' + this.composer + '\nTempo: ' + this.tempo + '\nNotasi: ' + this.notation.trim();
    var blob = new Blob([text], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (this.title || 'partitur') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
};

PartiturEditor.prototype.printScore = function() {
    var printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) { alert('Mohon izinkan popup untuk mencetak.'); return; }
    printWindow.document.write('<!DOCTYPE html><html><head><title>' + this.title + '</title><style>body{font-family:Georgia,serif;padding:40px;max-width:700px;margin:0 auto;}h1{text-align:center;font-size:24px;}.composer{text-align:center;color:#666;margin-bottom:20px;}.tempo{text-align:center;color:#888;margin-bottom:30px;}.notation{font-size:28px;letter-spacing:0.15em;text-align:center;padding:20px;background:#f5f5f5;border-radius:8px;font-family:monospace;}.footer{text-align:center;margin-top:40px;color:#aaa;font-size:12px;}@media print{body{padding:20px;}.no-print{display:none;}}</style></head><body><h1>' + this.title + '</h1><div class="composer">' + this.composer + '</div><div class="tempo">' + this.tempo + '</div><div class="notation">' + (this.notation.trim() || '(kosong)') + '</div><div class="footer">TriSonic AI Studio · Partitur Notasi Angka</div><div class="no-print" style="text-align:center;margin-top:20px;"><button onclick="window.print()" style="padding:8px 24px;font-size:16px;cursor:pointer;">🖨️ Cetak</button></div></body></html>');
    printWindow.document.close();
};

window.PartiturEditor = PartiturEditor;
console.log('✅ partiturEditor.js loaded');