// ============================================================
// app.js - Entry Point
// TriSonic AI Studio
// ============================================================

console.log('🚀 app.js loaded');

var audioEngine = null;
var keyboardRenderer = null;
var aiComposer = null;
var partiturEditor = null;

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
        console.log('✅ Keyboard siap');
        
        // AI Composer
        aiComposer = new AIComposer();
        aiComposer.init(audioEngine);
        console.log('✅ AI Composer siap');
        
        // Partitur Editor
        partiturEditor = new PartiturEditor();
        partiturEditor.init();
        console.log('✅ Partitur Editor siap');
        
        setupControls();
        setupTabs();
        setupSidebar();
        setupModal();
        setupComposerEvents();
        
        console.log('🎉 TriSonic AI Studio initialized!');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

function setupControls() {
    var volume = document.getElementById('volumeControl');
    if (volume && audioEngine) {
        volume.addEventListener('input', function(e) {
            audioEngine.setVolume(parseFloat(e.target.value));
        });
        audioEngine.setVolume(parseFloat(volume.value));
    }
    
    var reverb = document.getElementById('reverbControl');
    if (reverb && audioEngine) {
        reverb.addEventListener('input', function(e) {
            audioEngine.setReverb(parseFloat(e.target.value));
        });
        audioEngine.setReverb(parseFloat(reverb.value));
    }
    
    var waveform = document.getElementById('waveformSelect');
    if (waveform && audioEngine) {
        waveform.addEventListener('change', function(e) {
            audioEngine.setWaveform(e.target.value);
        });
    }
}

function setupTabs() {
    document.querySelectorAll('.tab-btn, .sidebar-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tabId = this.dataset.tab;
            document.querySelectorAll('.tab-btn, .sidebar-btn').forEach(function(b) {
                b.classList.toggle('active', b.dataset.tab === tabId);
            });
            document.querySelectorAll('.tab-content').forEach(function(c) {
                c.classList.toggle('active', c.id === 'tab-' + tabId);
            });
            
            if (tabId === 'keyboard' && keyboardRenderer) {
                var container = document.getElementById('keyboard');
                if (container && container.children.length === 0) {
                    console.log('🔄 Re-render keyboard...');
                    keyboardRenderer.render();
                }
            }
            
            if (window.innerWidth <= 768) closeSidebar();
        });
    });
}

function setupSidebar() {
    var toggle = document.getElementById('menuToggle');
    var sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
}

function closeSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

function setupModal() {
    var close = document.getElementById('modalClose');
    var overlay = document.getElementById('modalOverlay');
    if (close && overlay) {
        close.addEventListener('click', function() {
            overlay.classList.remove('show');
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.classList.remove('show');
        });
    }
}

function setupComposerEvents() {
    var composeBtn = document.getElementById('composeBtn');
    var playBtn = document.getElementById('playCompositionBtn');
    var stopBtn = document.getElementById('stopCompositionBtn');
    
    if (composeBtn) {
        composeBtn.addEventListener('click', function() {
            if (!aiComposer) return;
            var genre = document.getElementById('composerGenre')?.value || 'classical';
            var length = parseInt(document.getElementById('composerLength')?.value) || 8;
            var tempo = parseInt(document.getElementById('composerTempo')?.value) || 120;
            var composition = aiComposer.generateComposition(genre, length, tempo);
            displayComposition(composition);
        });
    }
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            if (!aiComposer) return;
            var composition = aiComposer.currentComposition;
            if (!composition || composition.length === 0) {
                alert('Silakan buat komposisi terlebih dahulu!');
                return;
            }
            aiComposer.playComposition(composition);
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', function() {
            if (aiComposer) aiComposer.stopComposition();
        });
    }
}

function displayComposition(composition) {
    var display = document.getElementById('compositionNotes');
    var noteCount = document.getElementById('compNoteCount');
    var duration = document.getElementById('compDuration');
    
    if (display) {
        if (composition && composition.length > 0) {
            var notes = composition.map(function(item) { return item.note; }).join(' ');
            display.innerHTML = '<span style="color:#2196F3;">' + notes + '</span>';
        } else {
            display.innerHTML = '<p class="placeholder">Tidak ada nada yang dihasilkan.</p>';
        }
    }
    
    if (noteCount) noteCount.textContent = composition ? composition.length : 0;
    if (duration && composition) {
        var totalDuration = composition.reduce(function(sum, item) { return sum + item.duration; }, 0);
        duration.textContent = totalDuration.toFixed(2);
    }
}

// STARTUP
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOMContentLoaded - init dalam 300ms...');
    setTimeout(initApp, 300);
});

window.addEventListener('load', function() {
    if (!keyboardRenderer || !keyboardRenderer.isRendered) {
        console.log('🔄 Window load - init ulang...');
        if (typeof initApp === 'function') {
            initApp();
        }
    }
});

window.__TRI_SONIC = { audioEngine: audioEngine, keyboardRenderer: keyboardRenderer, initApp: initApp };
console.log('✅ app.js loaded');
