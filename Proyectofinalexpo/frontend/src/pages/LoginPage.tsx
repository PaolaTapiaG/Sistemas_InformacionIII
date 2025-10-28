import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, type LoginPayload } from "../api/login";
import api from "../lib/api";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginPayload>({
        nombreUsuario: "",
        contrasena: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!form.nombreUsuario || !form.contrasena) {
            setError("Por favor, completa usuario y contraseña.");
            return;
        }
        try {
            setLoading(true);
                    const { token, nombreRol, idUsuario, idPaciente, idMedico } = await login(form);
                    // Guardar token y rol, y configurar Authorization para próximas peticiones
                    localStorage.setItem("token", token);
                    localStorage.setItem("nombreRol", nombreRol);
                    if (idUsuario) localStorage.setItem("idUsuario", idUsuario);
                    if (idPaciente) localStorage.setItem("idPaciente", idPaciente);
                    if (idMedico) localStorage.setItem("idMedico", idMedico);
                    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    // Redirigir según rol
                    if (nombreRol === "Medico") {
                        navigate("/medico");
                    } else if (nombreRol === "Paciente") {
                        navigate("/paciente");
                    } else {
                        // Fallback: a inicio
                        navigate("/");
                    }
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Error al iniciar sesión";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      animation: "fadeIn 0.6s ease-in"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div style={{ 
        maxWidth: 400, 
        width: "100%",
        margin: "0 16px",
        padding: 32, 
        background: "#ffffff",
        borderRadius: 16, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        animation: "slideUp 0.6s ease-out"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 28, fontWeight: 700, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Iniciar sesión</h2>
        <p style={{ marginTop: 0, marginBottom: 24, color: "#6b7280", fontSize: 14 }}>Ingresa tus credenciales para acceder</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>Usuario</span>
              <input
                type="text"
                name="nombreUsuario"
                value={form.nombreUsuario}
                onChange={handleChange}
                placeholder="admin"
                disabled={loading}
                style={{ 
                  width: "100%", 
                  padding: "10px 12px", 
                  borderRadius: 8,
                  border: "2px solid #e5e7eb",
                  fontSize: 14,
                  transition: "all 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>Contraseña</span>
              <input
                type="password"
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                placeholder="********"
                disabled={loading}
                style={{ 
                  width: "100%", 
                  padding: "10px 12px", 
                  borderRadius: 8,
                  border: "2px solid #e5e7eb",
                  fontSize: 14,
                  transition: "all 0.3s ease",
                  outline: "none"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
              />
            </label>

            {error && (
              <div style={{ 
                color: "#dc2626", 
                background: "rgba(220, 38, 38, 0.1)", 
                padding: 12, 
                borderRadius: 8,
                fontSize: 14,
                border: "1px solid rgba(220, 38, 38, 0.2)"
              }}>{error}</div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                padding: "12px 16px",
                borderRadius: 8,
                border: "none",
                background: loading ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};