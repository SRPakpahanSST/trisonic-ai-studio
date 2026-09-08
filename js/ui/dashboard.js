// ============================================================
// dashboard.js - Demo Agen AI (Desain, Proses, Pasar)
// TriSonic AI Studio
// ============================================================

class DashboardManager {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.metrics = {
            design: { progress: 92, status: 'online' },
            process: { temperature: 72, vibration: 0.4, status: 'warning' },
            market: { 
                prices: {
                    'Indonesia': 2450000,
                    'Malaysia': 850,
                    'Singapura': 320,
                    'Thailand': 8900,
                },
                recommendation: 245,
            },
            training: {
                modules: [
                    { name: 'Teori 20 Nada', progress: 80 },
                    { name: 'Kalibrasi Keyboard', progress: 45 },
                    { name: 'Harmoni Mikrotonal', progress: 30 },
                ]
            }
        };
    }
    
    /**
     * Inisialisasi dashboard
     */
    init() {
        this.updateAllMetrics();
        this.startAutoUpdate();
        this.bindEvents();
    }
    
    /**
     * Bind events
     */
    bindEvents() {
        // Training button
        const trainingBtn = document.getElementById('startTrainingBtn');
        if (trainingBtn) {
            trainingBtn.addEventListener('click', () => {
                this.startTraining();
            });
        }
    }
    
    /**
     * Start auto-update (simulasi)
     */
    startAutoUpdate() {
        if (this.intervalId) return;
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.simulateMetricsUpdate();
            this.updateAllMetrics();
        }, 3000);
    }
    
    /**
     * Stop auto-update
     */
    stopAutoUpdate() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }
    
    /**
     * Simulate metrics update
     */
    simulateMetricsUpdate() {
        // Desain - random progress
        this.metrics.design.progress = Math.min(100, this.metrics.design.progress + (Math.random() - 0.5) * 3);
        this.metrics.design.progress = Math.max(70, this.metrics.design.progress);
        this.metrics.design.status = this.metrics.design.progress > 85 ? 'online' : 'warning';
        
        // Proses - random temperature
        this.metrics.process.temperature = 65 + Math.random() * 15;
        this.metrics.process.vibration = 0.3 + Math.random() * 0.3;
        this.metrics.process.status = this.metrics.process.temperature > 78 ? 'warning' : 'online';
        
        // Market - random price fluctuation
        for (const key in this.metrics.market.prices) {
            const change = (Math.random() - 0.5) * 0.03;
            this.metrics.market.prices[key] = Math.round(this.metrics.market.prices[key] * (1 + change));
        }
        
        // Training - slow progress
        this.metrics.training.modules.forEach(module => {
            if (module.progress < 100 && Math.random() > 0.7) {
                module.progress = Math.min(100, module.progress + Math.random() * 2);
            }
        });
        
        // Update recommendation
        const basePrice = this.metrics.market.prices['Indonesia'] || 2450000;
        this.metrics.market.recommendation = Math.round(basePrice / 10000);
    }
    
    /**
     * Update all metrics display
     */
    updateAllMetrics() {
        this.updateDesignDisplay();
        this.updateProcessDisplay();
        this.updateMarketDisplay();
        this.updateTrainingDisplay();
    }
    
    /**
     * Update design display
     */
    updateDesignDisplay() {
        const specs = document.querySelector('.design-specs');
        if (specs) {
            const progress = Math.round(this.metrics.design.progress);
            specs.innerHTML = `
                <span>Material: FR-4</span>
                <span>Layer: 4</span>
                <span>Optimasi: ${progress}%</span>
            `;
        }
        
        const status = document.querySelector('.dashboard-card:nth-child(1) .card-status');
        if (status) {
            status.textContent = this.metrics.design.status === 'online' ? 'Online' : 'Optimasi';
            status.className = `card-status ${this.metrics.design.status}`;
        }
    }
    
    /**
     * Update process display
     */
    updateProcessDisplay() {
        const metrics = document.querySelector('.process-metrics');
        if (metrics) {
            const temp = this.metrics.process.temperature.toFixed(1);
            const vib = this.metrics.process.vibration.toFixed(2);
            const status = this.metrics.process.status === 'online' ? '✅ Sistem Stabil' : '⚠️ Prediksi: 15 menit';
            metrics.innerHTML = `
                <span>${status}</span>
                <span>Suhu: ${temp}°C</span>
                <span>Getaran: ${vib}mm</span>
            `;
        }
        
        const status = document.querySelector('.dashboard-card:nth-child(2) .card-status');
        if (status) {
            status.textContent = this.metrics.process.status === 'online' ? 'Stabil' : 'Monitoring';
            status.className = `card-status ${this.metrics.process.status}`;
        }
    }
    
    /**
     * Update market display
     */
    updateMarketDisplay() {
        const marketData = document.querySelector('.market-data');
        if (marketData) {
            const prices = this.metrics.market.prices;
            marketData.innerHTML = `
                <div class="market-item">
                    <span class="market-label">Indonesia</span>
                    <span class="market-price">Rp ${prices['Indonesia'].toLocaleString()}</span>
                </div>
                <div class="market-item">
                    <span class="market-label">Malaysia</span>
                    <span class="market-price">RM ${prices['Malaysia']}</span>
                </div>
                <div class="market-item">
                    <span class="market-label">Singapura</span>
                    <span class="market-price">S$ ${prices['Singapura']}</span>
                </div>
                <div class="market-item">
                    <span class="market-label">Thailand</span>
                    <span class="market-price">฿ ${prices['Thailand'].toLocaleString()}</span>
                </div>
            `;
        }
        
        const rec = document.querySelector('.market-recommendation .rec-value');
        if (rec) {
            rec.textContent = `$${this.metrics.market.recommendation} USD`;
        }
    }
    
    /**
     * Update training display
     */
    updateTrainingDisplay() {
        const modules = document.querySelector('.trainer-modules');
        if (modules) {
            modules.innerHTML = this.metrics.training.modules.map(m => `
                <div class="module-item">
                    <span>📖 ${m.name}</span>
                    <span class="module-progress">${Math.round(m.progress)}%</span>
                </div>
            `).join('');
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}