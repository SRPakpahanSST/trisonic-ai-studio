// ============================================================
// tutorial.js - Tutorial Interaktif (20 Nada per Oktaf)
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
            const response = await fetch('pages/tutorial_notasi_angka.html');
            if (response.ok) {
                const html = await response.text();
                this.tutorialContent = html;
                return html;
            }
        } catch (e) {
            console.warn('Failed to load tutorial file, using built-in content');
        }
        
        this.tutorialContent = this.getBuiltInTutorial();
        return this.tutorialContent;
    }

    /**
     * Built-in tutorial content
     */
    getBuiltInTutorial() {
        return `
            <h2>📚 Tutorial Notasi Angka (20 Nada per Oktaf