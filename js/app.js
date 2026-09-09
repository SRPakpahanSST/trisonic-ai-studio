// ============================================================
// app.js - Entry Point
// TriSonic AI Studio
// ============================================================

console.log('🚀 app.js loaded');

let audioEngine = null;
let keyboardRenderer = null;
let aiComposer = null;
let partiturEditor = null;

function initApp() {
    console.log('🔧 Inisialisasi aplikasi...');
    
    try {
        // Audio Engine
        audioEngine = window.audioEngine || new AudioEngine();
        audioEngine.init();
        console.log('✅ Audio Engine siap');
        
        // Keyboard
        keyboardRenderer = new KeyboardRenderer();
        keyboardRenderer.init(audioEngine);
        console.log('✅ Keyboard siap (5 oktaf: C2-D6)');
        
        // AI Composer
        aiComposer = new AIComposer();
        aiComposer.init(audioEngine);
        console.log('✅ AI Composer siap');
        
        // Partitur Editor
        partiturEditor = new PartiturEditor();
        partiturEditor.init();
        console.log('✅ Partitur Editor siap');
        
        // Setup controls
        setupControls();
        setupTabs();
        setupSidebar();
        setupModal();
        setupComposerEvents();
        
        console.log('🎉 TriSonic AI Studio initialized successfully!');
    } catch (error) {
        console.error('❌ Error saat inisialisasi:', error);
    }
}

function setupControls() {
    const volume = document.getElementById('volumeControl');
    if (volume && audioEngine) {
        volume.addEventListener('input', (e) => {
            audioEngine.setVolume(parseFloat(e.target.value));
        });
        audioEngine.setVolume(parseFloat(volume.value));
    }
    
    const reverb = document.getElementById('reverbControl');
    if (reverb && audioEngine) {
        reverb.addEventListener('input', (e) => {
            audioEngine.setReverb(parseFloat(e.target.value));
        });
        audioEngine.setReverb(parseFloat(reverb.value));
    }
    
    const waveform = document.getElementById('waveformSelect');
    if (waveform && audioEngine) {
        waveform.addEventListener('change', (e) => {
            audioEngine.setWaveform(e.target.value);
        });
    }
}

function setupTabs() {
    document.querySelectorAll('.tab-btn, .sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-btn, .sidebar-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.tab === tabId);
            });
            document.querySelectorAll('.tab-content').forEach(c => {
                c.classList.toggle('active', c.id === `tab-${tabId}`);
            });
            if (window.innerWidth <= 768) closeSidebar();
        });
    });
}

function setupSidebar() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

function setupModal() {
    const close = document.getElementById('modalClose');
    const overlay = document.getElementById('modalOverlay');
    if (close && overlay) {
        close.addEventListener('click', () => {
            overlay.classList.remove('show');
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('show');
        });
    }
}

function setupComposerEvents() {
    document.getElementById('composeBtn')?.addEventListener('click', () => {
        if (!aiComposer) return;
        
        const genre = document.getElementById('composerGenre')?.value || 'classical';
        const length = parseInt(document.getElementById('composerLength')?.value) || 8;
        const tempo = parseInt(document.getElementById('composerTempo')?.value) || 120;
        
        const composition = aiComposer.generateComposition(genre, length, tempo);
        displayComposition(composition);
    });
    
    document.getElementById('playCompositionBtn')?.addEventListener('click', () => {
        if (!aiComposer) return;
        const composition = aiComposer.currentComposition;
        if (!composition || composition.length === 0) {
            alert('Silakan buat komposisi terlebih dahulu!');
            return;
        }
        aiComposer.playComposition(composition);
    });
    
    document.getElementById('stopCompositionBtn')?.addEventListener('click', () => {
        if (aiComposer) aiComposer.stopComposition();
    });
}

function displayComposition(composition) {
    const display = document.getElementById('compositionNotes');
    const noteCount = document.getElementById('compNoteCount');
    const duration = document.getElementById('compDuration');
    
    if (display) {
        if (composition && composition.length > 0) {
            const notes = composition.map(item => item.note).join(' ');
            display.innerHTML = `<span style="color:#2196F3;">${notes}</span>`;
        } else {
            display.innerHTML = '<p class="placeholder">Tidak ada nada yang dihasilkan.</p>';
        }
    }
    
    if (noteCount) noteCount.textContent = composition ? composition.length : 0;
    if (duration && composition) {
        const totalDuration = composition.reduce((sum, item) => sum + item.duration, 0);
        duration.textContent = totalDuration.toFixed(2);
    }
}

// Panggil init setelah semua file load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initApp, 300);
});

// Export untuk debugging
if (typeof window !== 'undefined') {
    window.__TRI_SONIC = {
        audioEngine,
        keyboardRenderer,
        aiComposer,
        partiturEditor,
        initApp
    };
}