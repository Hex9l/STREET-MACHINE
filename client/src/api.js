export const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : "https://street-machine.onrender.com";