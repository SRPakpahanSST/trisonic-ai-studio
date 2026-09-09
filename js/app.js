// ============================================================
// app.js - Entry Point
// TriSonic AI Studio
// ============================================================

console.log('🚀 app.js loaded');

let audioEngine = null;
let keyboardRenderer = null;

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
        
        setupTabs();
        setupSidebar();
        setupControls();
        
        console.log('🎉 TriSonic AI Studio initialized!');
    } catch (error) {
        console.error('❌ Error:', error);
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
            
            // Jika tab keyboard, re-render jika kosong
            if (tabId === 'keyboard' && keyboardRenderer) {
                const container = document.getElementById('keyboard');
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

// STARTUP - Tunggu DOM dan file JS selesai
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOMContentLoaded - init dalam 300ms...');
    setTimeout(initApp, 300);
});

// FALLBACK - Jika masih belum, coba lagi
window.addEventListener('load', function() {
    if (!keyboardRenderer || !keyboardRenderer.isRendered) {
        console.log('🔄 Window load - init ulang...');
        if (typeof initApp === 'function') {
            initApp();
        }
    }
});

window.__TRI_SONIC = { audioEngine, keyboardRenderer, initApp };
console.log('✅ app.js loaded, menunggu DOM...');