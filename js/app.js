// ============================================================
// app.js - Entry Point (Landing, Splash, Inisialisasi, Tab Nav)
// TriSonic AI Studio
// ============================================================

// ---------- Dependencies ----------
// (Semua file sudah di-load via script tags di index.html)

// ---------- App State ----------
const AppState = {
    currentTab: 'keyboard',
    isSplashVisible: false,
    isSidebarOpen: false,
    isMobile: window.innerWidth <= 768,
    isAppReady: false,
};

// ---------- DOM References ----------
const DOM = {
    landing: document.getElementById('landing-page'),
    splash: document.getElementById('splash-screen'),
    app: document.getElementById('app'),
    tabNav: document.getElementById('tabNav'),
    sidebar: document.getElementById('sidebar'),
    contentArea: document.getElementById('contentArea'),
    menuToggle: document.getElementById('menuToggle'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalClose: document.getElementById('modalClose'),
    btnMulai: document.getElementById('btnMulai'),
};

// ---------- Instances ----------
let audioEngine = null;
let keyboardRenderer = null;
let aiComposer = null;
let partiturEditor = null;
let tutorialManager = null;
let dashboardManager = null;

// ============================================================
// LANDING PAGE HANDLER
// ============================================================

/**
 * Setup landing page - tampilkan pertama kali
 */
function setupLandingPage() {
    if (!DOM.landing || !DOM.btnMulai) return;
    
    // Pastikan landing page terlihat
    DOM.landing.classList.remove('hidden');
    DOM.landing.style.display = 'flex';
    
    // Sembunyikan splash dan app
    if (DOM.splash) {
        DOM.splash.style.display = 'none';
        DOM.splash.classList.add('hidden');
    }
    if (DOM.app) {
        DOM.app.style.display = 'none';
    }
    
    // Event listener tombol Mulai
    DOM.btnMulai.addEventListener('click', handleMulaiClick);
    
    console.log('Landing page siap');
}

/**
 * Handler untuk tombol Mulai
 */
function handleMulaiClick() {
    console.log('Tombol Mulai diklik!');
    
    // Animasi keluar landing page
    DOM.landing.classList.add('hidden');
    
    // Setelah animasi selesai, tampilkan splash
    setTimeout(() => {
        DOM.landing.style.display = 'none';
        showSplashAndInit();
    }, 600);
}

// ============================================================
// SPLASH & INITIALIZATION
// ============================================================

/**
 * Tampilkan splash screen dan inisialisasi aplikasi
 */
function showSplashAndInit() {
    // Tampilkan splash
    if (DOM.splash) {
        DOM.splash.style.display = 'flex';
        DOM.splash.classList.remove('hidden');
        AppState.isSplashVisible = true;
    }
    
    // Mulai animasi loader
    const loaderBar = document.querySelector('.loader-bar');
    if (loaderBar) {
        loaderBar.style.animation = 'none';
        void loaderBar.offsetWidth; // Trigger reflow
        loaderBar.style.animation = 'loadBar 2s ease-in-out forwards';
    }
    
    // Inisialisasi aplikasi setelah splash selesai
    setTimeout(() => {
        initApp();
        hideSplash();
    }, 2500);
}

/**
 * Hide splash screen dan tampilkan aplikasi utama
 */
function hideSplash() {
    if (DOM.splash) {
        DOM.splash.classList.add('hidden');
        AppState.isSplashVisible = false;
    }
    
    if (DOM.app) {
        DOM.app.style.display = 'flex';
        AppState.isAppReady = true;
    }
    
    console.log('Aplikasi siap digunakan!');
}

// ============================================================
// INISIALISASI APLIKASI UTAMA
// ============================================================

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

// ============================================================
// CONTROLS & UI SETUP
// ============================================================

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
    const tabBtns = document.querySelectorAll('.tab-btn, .sidebar-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            if (tabId) {
                switchTab(tabId);
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
            }
        });
    });
}

/**
 * Switch to a tab
 */
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn, .sidebar-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
    
    AppState.currentTab = tabId;
}

// ============================================================
// SIDEBAR
// ============================================================

function setupSidebar() {
    if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', toggleSidebar);
    }
    
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
    AppState.isSidebarOpen ? closeSidebar() : openSidebar();
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

// ============================================================
// MODAL
// ============================================================

function setupModal() {
    if (DOM.modalClose) {
        DOM.modalClose.addEventListener('click', closeModal);
    }
    
    if (DOM.modalOverlay) {
        DOM.modalOverlay.addEventListener('click', (e) => {
            if (e.target === DOM.modalOverlay) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
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

// ============================================================
// RESIZE HANDLER
// ============================================================

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

// ============================================================
// COMPOSER
// ============================================================

function setupComposerButtons() {
    const composeBtn = document.getElementById('composeBtn');
    const playBtn = document.getElementById('playCompositionBtn');
    const stopBtn = document.getElementById('stopCompositionBtn');
    
    if (composeBtn) composeBtn.addEventListener('click', composeMusic);
    if (playBtn) playBtn.addEventListener('click', playComposition);
    if (stopBtn) stopBtn.addEventListener('click', stopComposition);
}

function composeMusic() {
    if (!aiComposer) return;
    
    const genre = document.getElementById('composerGenre')?.value || 'classical';
    const length = parseInt(document.getElementById('composerLength')?.value) || 8;
    const tempo = parseInt(document.getElementById('composerTempo')?.value) || 120;
    
    const composeBtn = document.getElementById('composeBtn');
    if (composeBtn) {
        composeBtn.textContent = '⏳ Komposisi...';
        composeBtn.disabled = true;
    }
    
    setTimeout(() => {
        const composition = aiComposer.generateComposition(genre, length, tempo);
        displayComposition(composition);
        if (composeBtn) {
            composeBtn.textContent = '🎵 Komposisi';
            composeBtn.disabled = false;
        }
    }, 300);
}

function displayComposition(composition) {
    const display = document.getElementById('compositionNotes');
    const noteCount = document.getElementById('compNoteCount');
    const duration = document.getElementById('compDuration');
    
    if (display) {
        display.innerHTML = composition && composition.length > 0
            ? `<span style="color:var(--color-secondary);">${composition.map(item => item.note).join(' ')}</span>`
            : '<p class="placeholder">Tidak ada nada yang dihasilkan.</p>';
    }
    
    if (noteCount) noteCount.textContent = composition ? composition.length : 0;
    if (duration && composition) {
        const totalDuration = composition.reduce((sum, item) => sum + item.duration, 0);
        duration.textContent = totalDuration.toFixed(2);
    }
}

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

function stopComposition() {
    if (aiComposer) aiComposer.stopComposition();
    
    const playBtn = document.getElementById('playCompositionBtn');
    if (playBtn) {
        playBtn.textContent = '▶️ Putar';
        playBtn.disabled = false;
    }
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const tabs = ['keyboard', 'composer', 'partitur', 'dashboard', 'tutorial', 'about'];
        const index = parseInt(e.key) - 1;
        if (tabs[index]) switchTab(tabs[index]);
    }
    
    if (e.key === 'Escape') {
        closeModal();
        if (AppState.isSidebarOpen) closeSidebar();
    }
});

// ============================================================
// STARTUP - Tampilkan Landing Page Terlebih Dahulu
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Selalu tampilkan landing page terlebih dahulu
    setupLandingPage();
});

// ============================================================
// EXPORT FOR DEBUGGING
// ============================================================

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
    setupLandingPage,
    handleMulaiClick,
};