// ============================================================
// tutorial.js - Popup Tutorial Interaktif
// TriSonic AI Studio
// ============================================================

class TutorialManager {
    constructor() {
        this.tutorialContent = null;
        this.currentStep = 0;
        this.steps = [];
        this.isOpen = false;
    }
    
    /**
     * Load tutorial content
     */
    async loadTutorial() {
        try {
            // Coba load dari file external
            const response = await fetch('pages/tutorial_notasi_angka.html');
            if (response.ok) {
                const html = await response.text();
                this.tutorialContent = html;
                return html;
            }
        } catch (e) {
            console.warn('Failed to load tutorial file, using built-in content');
        }
        
        // Fallback: built-in tutorial
        this.tutorialContent = this.getBuiltInTutorial();
        return this.tutorialContent;
    }
    
    /**
     * Built-in tutorial content
     */
    getBuiltInTutorial() {
        return `
            <h2>📚 Tutorial Notasi Angka</h2>
            
            <div class="tutorial-note">
                <strong>🎯 Selamat datang di Tutorial TriSonic AI Studio!</strong>
                <p>Pelajari dasar-dasar notasi angka dan sistem 20 nada mikrotonal.</p>
            </div>
            
            <h3>1. Dasar Notasi Angka</h3>
            <p>
                Notasi angka adalah sistem penulisan musik yang menggunakan angka 1-7 untuk mewakili nada.
                Dalam TriSonic, kita memiliki 20 nada per oktaf, sehingga notasi diperluas.
            </p>
            <ul>
                <li><strong>1-7</strong> = Nada dasar dalam oktaf</li>
                <li><strong>1' 2' 3'...</strong> = Nada oktaf lebih tinggi</li>
                <li><strong>♯ (kres)</strong> = Naik setengah langkah</li>
                <li><strong>♭ (mol)</strong> = Turun setengah langkah</li>
                <li><strong>|</strong> = Garis birama</li>
                <li><strong>||</strong> = Garis birama ganda (akhir)</li>
            </ul>
            
            <h3>2. Skala 20 Nada</h3>
            <p>
                Sistem 20 nada membagi oktaf menjadi 20 interval yang sama (masing-masing 60 sen).
                Ini memungkinkan harmoni yang lebih kaya dan eksplorasi mikrotonal.
            </p>
            
            <h3>3. Simbol dan Tanda</h3>
            <ul>
                <li><strong>1</strong> - C (Do)</li>
                <li><strong>2</strong> - D (Re)</li>
                <li><strong>3</strong> - E (Mi)</li>
                <li><strong>4</strong> - F (Fa)</li>
                <li><strong>5</strong> - G (Sol)</li>
                <li><strong>6</strong> - A (La)</li>
                <li><strong>7</strong> - B (Si)</li>
                <li><strong>♯</strong> - Kres (naik 1 step)</li>
                <li><strong>♭</strong> - Mol (turun 1 step)</li>
            </ul>
            
            <h3>4. Contoh Partitur</h3>
            <div style="background:var(--bg-input);padding:1rem;border-radius:8px;font-family:monospace;font-size:1.2rem;">
                1 2 3 4 5 6 7 1' | 2' 3' 4' 5' 6' 7' 1'' ||
            </div>
            <p style="margin-top:0.5rem;">
                Ini adalah tangga nada mayor sederhana dari oktaf 3 ke oktaf 4.
            </p>
            
            <h3>5. Tips Komposisi</h3>
            <ul>
                <li>Mulai dengan skala sederhana (1-7)</li>
                <li>Eksperimen dengan ♯ dan ♭ untuk warna mikrotonal</li>
                <li>Gunakan AI Composer untuk inspirasi</li>
                <li>Simpan partitur untuk dikembangkan nanti</li>
            </ul>
        `;
    }
    
    /**
     * Render tutorial ke container
     */
    async renderTo(container) {
        if (!container) return;
        
        const content = await this.loadTutorial();
        container.innerHTML = content;
        this.isOpen = true;
    }
    
    /**
     * Show tutorial popup
     */
    showTutorial() {
        const overlay = document.getElementById('modalOverlay');
        const body = document.getElementById('modalBody');
        
        if (overlay && body) {
            this.loadTutorial().then(content => {
                body.innerHTML = content;
                overlay.style.display = 'flex';
                this.isOpen = true;
            });
        }
    }
    
    /**
     * Close tutorial popup
     */
    closeTutorial() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.style.display = 'none';
            this.isOpen = false;
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TutorialManager;
}