/**
 * Core API Configuration
 * Prefers the VITE_API_URL environment variable, falling back to the deployed Render backend
 */
export const API_URL = import.meta.env.VITE_API_URL || "https://street-machine.onrender.com";