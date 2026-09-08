// ============================================================
// utils.js - Helper Functions
// TriSonic AI Studio
// ============================================================

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
function debounce(func, delay = 300) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if value is a valid number
 * @param {*} value - Value to check
 * @returns {boolean} True if valid number
 */
function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Get browser language
 * @returns {string} Language code
 */
function getBrowserLanguage() {
    return navigator.language || navigator.languages?.[0] || 'en-US';
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth <= 768;
}

/**
 * Format duration in seconds to mm:ss
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get CSS variable value
 * @param {string} variable - CSS variable name (with or without --)
 * @returns {string} Variable value
 */
function getCssVar(variable) {
    const name = variable.startsWith('--') ? variable : `--${variable}`;
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Save data to localStorage with expiry
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 * @param {number} expiryMs - Expiry in milliseconds
 */
function setStorageWithExpiry(key, data, expiryMs = 86400000) {
    const item = {
        value: data,
        expiry: Date.now() + expiryMs,
    };
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
}

/**
 * Get data from localStorage with expiry check
 * @param {string} key - Storage key
 * @returns {*} Data or null if expired
 */
function getStorageWithExpiry(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const item = JSON.parse(raw);
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    } catch (e) {
        return null;
    }
}

// Export functions if module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        debounce,
        throttle,
        generateId,
        deepClone,
        isValidNumber,
        clamp,
        getBrowserLanguage,
        isMobileDevice,
        formatDuration,
        getCssVar,
        setStorageWithExpiry,
        getStorageWithExpiry,
    };
}