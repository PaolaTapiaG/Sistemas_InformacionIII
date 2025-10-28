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
            backgroundColor: "#ffffff",
            animation: "fadeIn 0.8s ease-in",
            fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            position: "relative",
            overflow: "hidden"
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
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(20px, -20px) scale(1.05); }
                    66% { transform: translate(-15px, 15px) scale(0.95); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}</style>
            
            {/* Elementos decorativos de fondo */}
            <div style={{
                position: "absolute",
                top: "-10%",
                right: "-5%",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4fc3a1 0%, #38b2ac 100%)",
                opacity: 0.05,
                animation: "blob 15s infinite linear",
                zIndex: 0
            }}></div>
            <div style={{
                position: "absolute",
                bottom: "-10%",
                left: "-5%",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
                opacity: 0.05,
                animation: "blob 18s infinite linear reverse",
                zIndex: 0
            }}></div>
            
            <div style={{ 
                display: "flex", 
                maxWidth: 1000, 
                width: "100%",
                margin: "0 20px",
                borderRadius: 20, 
                overflow: "hidden",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                animation: "slideUp 0.8s ease-out",
                backgroundColor: "#ffffff",
                position: "relative",
                zIndex: 1
            }}>
                {/* Panel izquierdo con ilustración médica */}
                <div style={{ 
                    flex: 1.2, 
                    background: "linear-gradient(135deg, #38b2ac 0%, #319795 50%, #2c7a7b 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px 30px",
                    color: "white",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "radial-gradient(circle at 20% 80%, rgba(72,187,120,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(66,153,225,0.2) 0%, transparent 50%)",
                        zIndex: 0
                    }}></div>
                    
                    <div style={{
                        position: "relative",
                        zIndex: 1,
                        textAlign: "center",
                        animation: "float 6s ease-in-out infinite"
                    }}>
                        <div style={{
                            width: 180,
                            height: 180,
                            background: "rgba(255, 255, 255, 0.15)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 30px",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
                        }}>
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 6H16C17.1046 6 18 6.89543 18 8V8C18 9.10457 17.1046 10 16 10H14V6Z" fill="white"/>
                                <path d="M6 10H8C9.10457 10 10 9.10457 10 8V8C10 6.89543 9.10457 6 8 6H6V10Z" fill="white"/>
                                <path d="M17 20H19C20.1046 20 21 19.1046 21 18V18C21 16.8954 20.1046 16 19 16H17V20Z" fill="white"/>
                                <path d="M5 20H7C8.10457 20 9 19.1046 9 18V18C9 16.8954 8.10457 16 7 16H5V20Z" fill="white"/>
                                <path d="M14 16H16C17.1046 16 18 16.8954 18 18V18C18 19.1046 17.1046 20 16 20H14V16Z" fill="white"/>
                                <path d="M6 16H8C9.10457 16 10 16.8954 10 18V18C10 19.1046 9.10457 20 8 20H6V16Z" fill="white"/>
                                <path d="M17 6H19C20.1046 6 21 6.89543 21 8V8C21 9.10457 20.1046 10 19 10H17V6Z" fill="white"/>
                                <path d="M5 6H7C8.10457 6 9 6.89543 9 8V8C9 9.10457 8.10457 10 7 10H5V6Z" fill="white"/>
                                <path d="M2 12H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M12 2L12 22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        
                        <h2 style={{ 
                            fontSize: 32, 
                            fontWeight: 700, 
                            marginBottom: 15,
                            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}>MediConnect</h2>
                        <p style={{ 
                            fontSize: 16, 
                            opacity: 0.9,
                            marginBottom: 30,
                            maxWidth: 300,
                            lineHeight: 1.5
                        }}>Sistema integral de gestión de citas médicas para pacientes y profesionales de la salud</p>
                       
                    </div>
                </div>
                
                {/* Panel derecho con formulario */}
                <div style={{ 
                    flex: 1, 
                    padding: 50, 
                    background: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <div style={{ maxWidth: 350, margin: "0 auto", width: "100%" }}>
                        <div style={{ textAlign: "center", marginBottom: 10 }}>
                            <h2 style={{ 
                                marginTop: 0, 
                                marginBottom: 8, 
                                fontSize: 28, 
                                fontWeight: 700, 
                                color: "#2D3748",
                                letterSpacing: "-0.5px"
                            }}>Bienvenido</h2>
                            <p style={{ 
                                marginTop: 0, 
                                marginBottom: 30, 
                                color: "#718096", 
                                fontSize: 15 
                            }}>Ingresa tus credenciales para acceder a tu cuenta</p>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <span style={{ 
                                        fontWeight: 600, 
                                        color: "#2D3748", 
                                        fontSize: 14 
                                    }}>Usuario</span>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type="text"
                                            name="nombreUsuario"
                                            value={form.nombreUsuario}
                                            onChange={handleChange}
                                            placeholder="usuario"
                                            disabled={loading}
                                            style={{ 
                                                width: "100%", 
                                                padding: "14px 16px 14px 42px", 
                                                borderRadius: 10,
                                                border: "2px solid #E2E8F0",
                                                fontSize: 14,
                                                transition: "all 0.3s ease",
                                                outline: "none",
                                                boxSizing: "border-box",
                                                backgroundColor: "#F7FAFC"
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = "#38B2AC";
                                                e.currentTarget.style.backgroundColor = "#FFFFFF";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = "#E2E8F0";
                                                e.currentTarget.style.backgroundColor = "#F7FAFC";
                                            }}
                                        />
                                        <div style={{
                                            position: "absolute",
                                            left: 14,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#A0AEC0"
                                        }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                    </div>
                                </label>
                                
                                <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <span style={{ 
                                        fontWeight: 600, 
                                        color: "#2D3748", 
                                        fontSize: 14 
                                    }}>Contraseña</span>
                                    <div style={{ position: "relative" }}>
                                        <input
                                            type="password"
                                            name="contrasena"
                                            value={form.contrasena}
                                            onChange={handleChange}
                                            placeholder="********"
                                            disabled={loading}
                                            style={{ 
                                                width: "100%", 
                                                padding: "14px 16px 14px 42px", 
                                                borderRadius: 10,
                                                border: "2px solid #E2E8F0",
                                                fontSize: 14,
                                                transition: "all 0.3s ease",
                                                outline: "none",
                                                boxSizing: "border-box",
                                                backgroundColor: "#F7FAFC"
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = "#38B2AC";
                                                e.currentTarget.style.backgroundColor = "#FFFFFF";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = "#E2E8F0";
                                                e.currentTarget.style.backgroundColor = "#F7FAFC";
                                            }}
                                        />
                                        <div style={{
                                            position: "absolute",
                                            left: 14,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#A0AEC0"
                                        }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M2 12C2 12 5 6 12 6C19 6 22 12 22 12C22 12 19 18 12 18C5 18 2 12 2 12Z" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                    </div>
                                </label>
                                
                                <div style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    alignItems: "center",
                                    fontSize: 14
                                }}>
                                    <label style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: 8,
                                        color: "#4A5568",
                                        cursor: "pointer",
                                        fontWeight: 500
                                    }}>
                                        <input type="checkbox" style={{ cursor: "pointer" }} />
                                        Recordarme
                                    </label>
                                    <a href="#" style={{ 
                                        color: "#38B2AC", 
                                        textDecoration: "none",
                                        fontWeight: 500,
                                        transition: "color 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#2C7A7B"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "#38B2AC"}
                                    >¿Olvidaste tu contraseña?</a>
                                </div>

                                {error && (
                                    <div style={{ 
                                        color: "#E53E3E", 
                                        background: "#FED7D7", 
                                        padding: 12, 
                                        borderRadius: 8,
                                        fontSize: 14,
                                        border: "1px solid #FEB2B2",
                                        animation: "pulse 0.5s ease-in-out",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    style={{ 
                                        padding: "14px 16px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: loading ? "#CBD5E0" : "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: 16,
                                        cursor: loading ? "not-allowed" : "pointer",
                                        transition: "all 0.3s ease",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                        marginTop: 10
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
                                    {loading ? (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                            <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid transparent", borderTop: "2px solid white", animation: "spin 1s linear infinite" }}></div>
                                            Ingresando...
                                        </div>
                                    ) : (
                                        "Iniciar Sesión"
                                    )}
                                </button>
                                
                                <div style={{ 
                                    textAlign: "center", 
                                    marginTop: 20,
                                    paddingTop: 20,
                                    borderTop: "1px solid #E2E8F0",
                                    fontSize: 14,
                                    color: "#718096"
                                }}>
                                    
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};