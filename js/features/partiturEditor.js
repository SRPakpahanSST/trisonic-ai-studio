// ============================================================
// partiturEditor.js - Simpan/Buka/Cetak/Simbol
// TriSonic AI Studio
// ============================================================

class PartiturEditor {
    constructor() {
        this.notation = '';
        this.title = 'Komposisi Baru';
        this.composer = 'TriSonic AI';
        this.tempo = '120 BPM';
        this.history = [];
        this.historyIndex = -1;
        
        // DOM references
        this.notationDisplay = document.getElementById('notationNotes');
        this.previewDisplay = document.getElementById('previewContent');
        this.titleInput = document.getElementById('scoreTitle');
        this.composerInput = document.getElementById('scoreComposer');
        this.tempoInput = document.getElementById('scoreTempo');
    }
    
    /**
     * Inisialisasi editor
     */
    init() {
        // Bind note buttons
        document.querySelectorAll('.note-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const note = btn.dataset.note;
                if