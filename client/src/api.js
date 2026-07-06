/**
 * Core API Configuration
 * Prefers the VITE_API_URL environment variable, falling back to the deployed Render backend
 * Dynamically switches to localhost:5000 if running locally in development.
 */
const getApiUrl = () => {
    if (typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port === '5173')) {
        return 'http://localhost:5000';
    }
    return import.meta.env.VITE_API_URL || "https://street-machine.onrender.com";
};

export const API_URL = getApiUrl();