/* Utility functions for VulnBoard */

const Utils = {
    // Get URL parameters
    // VULNERABILITY: No sanitization of output
    getParam: function(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    // Format timestamp
    formatDate: function(timestamp) {
        if (!timestamp) return 'Unknown';
        return new Date(timestamp).toLocaleString('ja-JP');
    },

    // Simple ID generator
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    }
};
