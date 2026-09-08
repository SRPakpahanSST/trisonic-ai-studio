// ============================================================
// app.js - Entry Point (Landing, Splash, Inisialisasi)
// TriSonic AI Studio
// ============================================================

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
    btnMulai: document.getElementById('btnMulai'),
    menuToggle: document.getElementById('menuToggle'),
    sidebar: document.getElementById('sidebar'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalClose: document.getElementById('modalClose'),
    modalBody: document.getElementById('modalBody'),
};

// ---------- Instances ----------
let audioEngine = null;
let keyboardRenderer = null;
let aiComposer = null;
let partiturEditor = null;
let tutorialManager = null;
let dashboardManager = null;

// ============================================================
// LANDING PAGE
// ============================================================

function setupLandingPage() {
    console.log('🔵 setupLandingPage() dipanggil');
    
    if (!DOM.landing) {
        console.error('❌ Landing page tidak ditemukan!');
        return;
    }
    
    if (!DOM.btnMulai) {
        console.error('❌ Tombol Mulai tidak ditemukan!');
        return;
    }
    
    // Pastikan landing page terlihat
    DOM.landing.style.display = 'flex';
    DOM.landing.classList.remove('hidden');
    
    // Sembunyikan splash dan app
    if (DOM.splash) {
        DOM.splash.style.display = 'none';
        DOM.splash.classList.add('hidden');
    }
    if (DOM.app) {
        DOM.app.style.display = 'none';
    }
    
    // Hapus event listener lama (untuk menghindari duplikasi)
    DOM.btnMulai.removeEventListener('click', handleMulaiClick);
    DOM.btnMulai.addEventListener('click', handleMulaiClick);
    
    console.log('✅ Landing page siap, tombol Mulai terdaftar');
}

function handleMulaiClick() {
    console.log('🟢 Tombol Mulai diklik!');
    
    // Animasi keluar landing page
    DOM.landing.classList.add('hidden');
    
    // Setelah animasi, tampilkan splash
    setTimeout(() => {
        DOM.landing.style.display = 'none';
        showSplashAndInit();
    }, 600);
}

// ============================================================
// SPLASH & INIT
// ============================================================

function showSplashAndInit() {
    console.log('🟡 Menampilkan splash screen...');
    
    // Tampilkan splash
    if (DOM.splash) {
        DOM.splash.style.display = 'flex';
        DOM.splash.classList.remove('hidden');
        AppState.isSplashVisible = true;
    }
    
    // Jalankan animasi loader
    const loaderBar = document.querySelector('.loader-bar');
    if (loaderBar) {
        loaderBar.style.animation = 'none';
        void loaderBar.offsetWidth;
        loaderBar.style.animation = 'loadBar 2s ease-in-out forwards';
    }
    
    // Inisialisasi setelah splash selesai
    setTimeout(() => {
        console.log('🟢 Memulai inisialisasi aplikasi...');
        initApp();
        hideSplash();
    }, 2500);
}

function hideSplash() {
    if (DOM.splash) {
        DOM.splash.classList.add('hidden');
        AppState.isSplashVisible = false;
    }
    
    if (DOM.app) {
        DOM.app.style.display = 'flex';
        AppState.isAppReady = true;
        console.log('✅ Aplikasi siap digunakan!');
    }
}

// ============================================================
// INIT APP
// ============================================================

function initApp() {
    console.log('🚀 initApp() dipanggil');
    
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
        
        // Tutorial Manager
        tutorialManager = new TutorialManager();
        const tutorialContainer = document.getElementById('tutorialContainer');
        if (tutorialContainer) {
            tutorialManager.renderTo(tutorialContainer);
        }
        console.log('✅ Tutorial Manager siap');
        
        // Dashboard Manager
        dashboardManager = new DashboardManager();
        dashboardManager.init();
        console.log('✅ Dashboard Manager siap');
        
        // Setup UI
        setupControls();
        setupTabs();
        setupSidebar();
        setupModal();
        setupResizeHandler();
        setupComposerButtons();
        
        console.log('🎉 TriSonic AI Studio initialized successfully!');
    } catch (error) {
        console.error('❌ Error saat inisialisasi:', error);
    }
}

// ============================================================
// UI SETUP FUNCTIONS
// ============================================================

function setupControls() {
    const volumeControl = document.getElementById('volumeControl');
    if (volumeControl && audioEngine) {
        volumeControl.addEventListener('input', (e) => {
            audioEngine.setVolume(parseFloat(e.target.value));
        });
        audioEngine.setVolume(parseFloat(volumeControl.value));
    }
    
    const reverbControl = document.getElementById('reverbControl');
    if (reverbControl && audioEngine) {
        reverbControl.addEventListener('input', (e) => {
            audioEngine.setReverb(parseFloat(e.target.value));
        });
        audioEngine.setReverb(parseFloat(reverbControl.value));
    }
    
    const waveformSelect = document.getElementById('waveformSelect');
    if (waveformSelect && audioEngine) {
        waveformSelect.addEventListener('change', (e) => {
            audioEngine.setWaveform(e.target.value);
        });
    }
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn, .sidebar-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            if (tabId) {
                switchTab(tabId);
                if (window.innerWidth <= 768) closeSidebar();
            }
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn, .sidebar-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
    AppState.currentTab = tabId;
}

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

function setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            AppState.isMobile = window.innerWidth <= 768;
            if (!AppState.isMobile && AppState.isSidebarOpen) closeSidebar();
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
// STARTUP
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM siap, memulai setup landing page...');
    setupLandingPage();
});

// ============================================================
// EXPORT
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