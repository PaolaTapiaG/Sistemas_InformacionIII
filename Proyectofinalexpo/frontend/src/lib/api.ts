import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7143/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  },
});

// Si existe un token previo, configúralo en el Authorization por defecto
try {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
} catch {
  // Ignorar errores de acceso a localStorage (p.ej. privacidad del navegador)
}

export default api;
