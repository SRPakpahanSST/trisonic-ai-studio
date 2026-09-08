// ============================================================
// app.js - Entry Point (Splash, Inisialisasi, Tab Nav)
// TriSonic AI Studio
// ============================================================

// ---------- Dependencies ----------
// (Semua file sudah di-load via script tags di index.html)

// ---------- App State ----------
const AppState = {
    currentTab: 'keyboard',
    isSplashVisible: true,
    isSidebarOpen: false,
    isMobile: window.innerWidth <= 768,
};

// ---------- DOM References ----------
const DOM = {
    splash: document.getElementById('splash-screen'),
    app: document.getElementById('app'),
    tabNav: document.getElementById('tabNav'),
    sidebar: document.getElementById('sidebar'),
    contentArea: document.getElementById('contentArea'),
    menuToggle: document.getElementById('menuToggle'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalClose: document.getElementById('modalClose'),
};

// ---------- Instances ----------
let audioEngine = null;
let keyboardRenderer = null;
let aiComposer = null;
let partiturEditor = null;
let tutorialManager = null;
let dashboardManager = null;

// ---------- Initialization ----------
document.addEventListener('DOMContentLoaded', () => {
    // Tampilkan splash dulu
    showSplash();
    
    // Load semua modul setelah splash
    setTimeout(() => {
        initApp();
        hideSplash();
    }, 2500);
});

/**
 * Show splash screen
 */
function showSplash() {
    if (DOM.splash) {
        DOM.splash.classList.remove('hidden');
        AppState.isSplashVisible = true;
    }
}

/**
 * Hide splash screen
 */
function hideSplash() {
    if (DOM.splash) {
        DOM.splash.classList.add('hidden');
        AppState.isSplashVisible = false;
        if (DOM.app) {
            DOM.app.style.display = 'flex';
        }
    }
}

/**
 * Initialize application
 */
function initApp() {
    // Audio Engine
    audioEngine = window.audioEngine || new AudioEngine();
    audioEngine.init();
    
    // Keyboard
    keyboardRenderer = new KeyboardRenderer();
    keyboardRenderer.init(audioEngine);
    
    // AI Composer
    aiComposer = new AIComposer();
    aiComposer.init(audioEngine);
    
    // Partitur Editor
    partiturEditor = new PartiturEditor();
    partiturEditor.init();
    
    // Tutorial Manager
    tutorialManager = new TutorialManager();
    const tutorialContainer = document.getElementById('tutorialContainer');
    if (tutorialContainer) {
        tutorialManager.renderTo(tutorialContainer);
    }
    
    // Dashboard Manager
    dashboardManager = new DashboardManager();
    dashboardManager.init();
    
    // Setup controls
    setupControls();
    
    // Setup tab navigation
    setupTabs();
    
    // Setup sidebar toggle
    setupSidebar();
    
    // Setup modal
    setupModal();
    
    // Setup resize handler
    setupResizeHandler();
    
    // Setup composer buttons
    setupComposerButtons();
    
    console.log('TriSonic AI Studio initialized successfully!');
}

/**
 * Setup audio controls
 */
function setupControls() {
    // Volume
    const volumeControl = document.getElementById('volumeControl');
    if (volumeControl && audioEngine) {
        volumeControl.addEventListener('input', (e) => {
            audioEngine.setVolume(parseFloat(e.target.value));
        });
        audioEngine.setVolume(parseFloat(volumeControl.value));
    }
    
    // Reverb
    const reverbControl = document.getElementById('reverbControl');
    if (reverbControl && audioEngine) {
        reverbControl.addEventListener('input', (e) => {
            audioEngine.setReverb(parseFloat(e.target.value));
        });
        audioEngine.setReverb(parseFloat(reverbControl.value));
    }
    
    // Waveform
    const waveformSelect = document.getElementById('waveformSelect');
    if (waveformSelect && audioEngine) {
        waveformSelect.addEventListener('change', (e) => {
            audioEngine.setWaveform(e.target.value);
        });
    }
}

/**
 * Setup tab navigation
 */
function setupTabs() {
    // Tab buttons di header
    const tabBtns = document.querySelectorAll('.tab-btn, .sidebar-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            if (tabId) {
                switchTab(tabId);
                
                // Close sidebar di mobile
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
            }
        });
    });
}

/**
 * Switch to a tab
 * @param {string} tabId - ID tab
 */
function switchTab(tabId) {
    // Update active state di tab buttons
    document.querySelectorAll('.tab-btn, .sidebar-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
    
    AppState.currentTab = tabId;
    
    // Refresh layout jika perlu
    if (tabId === 'keyboard' && keyboardRenderer) {
        // Keyboard sudah dirender
    }
}

/**
 * Setup sidebar toggle untuk mobile
 */
function setupSidebar() {
    if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar saat klik di luar
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && AppState.isSidebarOpen) {
            const sidebar = DOM.sidebar;
            const toggle = DOM.menuToggle;
            if (sidebar && !sidebar.contains(e.target) && toggle && !toggle.contains(e.target)) {
                closeSidebar();
            }
        }
    });
}

function toggleSidebar() {
    if (AppState.isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    if (DOM.sidebar) {
        DOM.sidebar.classList.add('open');
        AppState.isSidebarOpen = true;
    }
}

function closeSidebar() {
    if (DOM.sidebar) {
        DOM.sidebar.classList.remove('open');
        AppState.isSidebarOpen = false;
    }
}

/**
 * Setup modal
 */
function setupModal() {
    if (DOM.modalClose) {
        DOM.modalClose.addEventListener('click', closeModal);
    }
    
    if (DOM.modalOverlay) {
        DOM.modalOverlay.addEventListener('click', (e) => {
            if (e.target === DOM.modalOverlay) {
                closeModal();
            }
        });
        
        // Close dengan ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
}

function openModal(content) {
    if (DOM.modalOverlay && DOM.modalBody) {
        DOM.modalBody.innerHTML = content || '';
        DOM.modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (DOM.modalOverlay) {
        DOM.modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Setup resize handler
 */
function setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            AppState.isMobile = window.innerWidth <= 768;
            if (!AppState.isMobile && AppState.isSidebarOpen) {
                closeSidebar();
            }
        }, 200);
    });
}

/**
 * Setup composer buttons
 */
function setupComposerButtons() {
    const composeBtn = document.getElementById('composeBtn');
    const playBtn = document.getElementById('playCompositionBtn');
    const stopBtn = document.getElementById('stopCompositionBtn');
    
    if (composeBtn) {
        composeBtn.addEventListener('click', () => {
            composeMusic();
        });
    }
    
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            playComposition();
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            stopComposition();
        });
    }
}

/**
 * Compose music using AI Composer
 */
function composeMusic() {
    if (!aiComposer) return;
    
    const genre = document.getElementById('composerGenre')?.value || 'classical';
    const length = parseInt(document.getElementById('composerLength')?.value) || 8;
    const tempo = parseInt(document.getElementById('composerTempo')?.value) || 120;
    
    // Show loading state
    const composeBtn = document.getElementById('composeBtn');
    if (composeBtn) {
        composeBtn.textContent = '⏳ Komposisi...';
        composeBtn.disabled = true;
    }
    
    // Generate dengan delay kecil agar UI tetap responsif
    setTimeout(() => {
        const composition = aiComposer.generateComposition(genre, length, tempo);
        displayComposition(composition);
        
        if (composeBtn) {
            composeBtn.textContent = '🎵 Komposisi';
            composeBtn.disabled = false;
        }
    }, 300);
}

/**
 * Display composition in UI
 */
function displayComposition(composition) {
    const display = document.getElementById('compositionNotes');
    const noteCount = document.getElementById('compNoteCount');
    const duration = document.getElementById('compDuration');
    
    if (display) {
        if (composition && composition.length > 0) {
            const notes = composition.map(item => item.note).join(' ');
            display.innerHTML = `<span style="color:var(--color-secondary);">${notes}</span>`;
        } else {
            display.innerHTML = '<p class="placeholder">Tidak ada nada yang dihasilkan.</p>';
        }
    }
    
    if (noteCount && composition) {
        noteCount.textContent = composition.length;
    }
    
    if (duration && composition) {
        const totalDuration = composition.reduce((sum, item) => sum + item.duration, 0);
        duration.textContent = totalDuration.toFixed(2);
    }
}

/**
 * Play composition
 */
function playComposition() {
    if (!aiComposer) return;
    
    const composition = aiComposer.currentComposition;
    if (!composition || composition.length === 0) {
        alert('Silakan buat komposisi terlebih dahulu!');
        return;
    }
    
    const playBtn = document.getElementById('playCompositionBtn');
    if (playBtn) {
        playBtn.textContent = '▶️ Memutar...';
        playBtn.disabled = true;
    }
    
    aiComposer.playComposition(composition, null, () => {
        if (playBtn) {
            playBtn.textContent = '▶️ Putar';
            playBtn.disabled = false;
        }
    });
}

/**
 * Stop composition
 */
function stopComposition() {
    if (aiComposer) {
        aiComposer.stopComposition();
    }
    
    const playBtn = document.getElementById('playCompositionBtn');
    if (playBtn) {
        playBtn.textContent = '▶️ Putar';
        playBtn.disabled = false;
    }
}

// ---------- Keyboard Shortcuts ----------
document.addEventListener('keydown', (e) => {
    // Ctrl+1-6 untuk switch tab
    if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const tabs = ['keyboard', 'composer', 'partitur', 'dashboard', 'tutorial', 'about'];
        const index = parseInt(e.key) - 1;
        if (tabs[index]) {
            switchTab(tabs[index]);
        }
    }
    
    // ESC untuk close modal
    if (e.key === 'Escape') {
        closeModal();
        if (AppState.isSidebarOpen) closeSidebar();
    }
});

// ---------- Export for debugging ----------
window.__TRI_SONIC = {
    AppState,
    DOM,
    audioEngine,
    keyboardRenderer,
    aiComposer,
    partiturEditor,
    tutorialManager,
    dashboardManager,
    switchTab,
    openModal,
    closeModal,
};