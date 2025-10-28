import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { CalendarCheck, Home, PlusCircle, User, LogOut, Clock, FileText, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export const PacienteLayout = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener datos del paciente desde el backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("/api/paciente/perfil", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("nombreRol");
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error al obtener datos del paciente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
    } catch (error) {
      console.error("Error durante logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("nombreRol");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}</style>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "3rem",
          borderRadius: "20px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          animation: "pulse 2s ease-in-out infinite"
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "4px solid #E2E8F0",
            borderTop: "4px solid #38B2AC",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1.5rem"
          }}></div>
          <p style={{ 
            color: "#2D3748", 
            margin: 0, 
            fontSize: "1.1rem",
            fontWeight: "500"
          }}>
            Cargando tu información...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
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
        position: "fixed",
        top: "-10%",
        right: "-5%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #4fc3a1 0%, #38b2ac 100%)",
        opacity: 0.03,
        animation: "blob 15s infinite linear",
        zIndex: 0
      }}></div>
      <div style={{
        position: "fixed",
        bottom: "-10%",
        left: "-5%",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
        opacity: 0.03,
        animation: "blob 18s infinite linear reverse",
        zIndex: 0
      }}></div>
      
      {/* Navbar mejorado */}
      <nav style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        padding: "1rem 2rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(56, 178, 172, 0.1)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {/* Logo y marca */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            cursor: "pointer"
          }} onClick={() => navigate("/paciente")}>
            <div style={{
              width: "45px",
              height: "45px",
              background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
              boxShadow: "0 4px 6px -1px rgba(56, 178, 172, 0.3)",
              animation: "float 6s ease-in-out infinite"
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div>
              <h1 style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                MediConnect
              </h1>
              <p style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#718096",
                fontWeight: "500"
              }}>
                Centro Médico Integral
              </p>
            </div>
          </div>

          {/* Navegación */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem"
          }}>
            <div style={{
              display: "flex",
              gap: "2rem"
            }}>
              {[
                { to: "/paciente", label: "Inicio", icon: <Home size={20} /> },
                { to: "/paciente/mis-citas", label: "Mis Citas", icon: <CalendarCheck size={20} /> },
                { to: "/paciente/reservar", label: "Reservar", icon: <PlusCircle size={20} /> },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.to}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.to);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: window.location.pathname === item.to ? "#38B2AC" : "#4A5568",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                    background: window.location.pathname === item.to ? "rgba(56, 178, 172, 0.1)" : "transparent",
                    border: window.location.pathname === item.to ? "1px solid rgba(56, 178, 172, 0.2)" : "1px solid transparent"
                  }}
                  onMouseEnter={(e) => {
                    if (window.location.pathname !== item.to) {
                      e.currentTarget.style.background = "rgba(56, 178, 172, 0.05)";
                      e.currentTarget.style.border = "1px solid rgba(56, 178, 172, 0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.location.pathname !== item.to) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.border = "1px solid transparent";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </div>

            {/* Información del usuario y logout */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              paddingLeft: "1.5rem",
              borderLeft: "1px solid #E2E8F0"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  boxShadow: "0 4px 6px -1px rgba(66, 153, 225, 0.3)",
                  border: "2px solid rgba(255, 255, 255, 0.8)"
                }}>
                  <User size={20} />
                </div>
                <div>
                  <p style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#2D3748"
                  }}>
                    {userData?.nombre || "Paciente"}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    color: "#718096"
                  }}>
                    Bienvenido al sistema
                  </p>
                </div>
              </div>
              
              <button
                onClick={logout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "transparent",
                  border: "1px solid #E2E8F0",
                  color: "#718096",
                  cursor: "pointer",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  transition: "all 0.3s ease",
                  fontWeight: "500"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(254, 178, 178, 0.1)";
                  e.currentTarget.style.color = "#E53E3E";
                  e.currentTarget.style.borderColor = "#FEB2B2";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#718096";
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                title="Cerrar sesión"
              >
                <LogOut size={18} />
                <span style={{ fontSize: "0.85rem" }}>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "2.5rem 2rem",
        minHeight: "calc(100vh - 100px)",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header de bienvenida */}
        <div style={{ 
          background: "linear-gradient(135deg, #38B2AC 0%, #319795 50%, #2C7A7B 100%)", 
          borderRadius: "20px", 
          padding: "3rem",
          marginBottom: "2.5rem",
          color: "white",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          animation: "slideUp 0.6s ease-out",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            animation: "float 6s ease-in-out infinite"
          }}></div>
          <div style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            animation: "float 8s ease-in-out infinite reverse"
          }}></div>
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ 
              margin: "0 0 1rem 0", 
              fontSize: "2.5rem", 
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              Bienvenido{userData?.nombre ? `, ${userData.nombre}` : ''}
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: "1.1rem", 
              opacity: 0.9,
              maxWidth: "600px",
              lineHeight: "1.6"
            }}>
              Estamos aquí para cuidar de tu salud. Gestiona tus citas médicas, 
              revisa tu historial y mantén tu bienestar bajo control con nuestro 
              sistema integral de atención médica.
            </p>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: "1.5rem", 
          marginBottom: "2.5rem",
          animation: "slideUp 0.6s ease-out 0.2s both"
        }}>
          {[
            { icon: <CalendarCheck size={24} />, value: "Citas Programadas", count: "3", color: "#38B2AC" },
            { icon: <Clock size={24} />, value: "Próxima Cita", count: "Hoy", color: "#4299E1" },
            { icon: <FileText size={24} />, value: "Documentos", count: "5", color: "#68D391" },
            { icon: <Heart size={24} />, value: "Estado de Salud", count: "Estable", color: "#F687B3" }
          ].map((stat, index) => (
            <div key={index} style={{ 
              background: "#ffffff", 
              borderRadius: "16px", 
              padding: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              borderLeft: `4px solid ${stat.color}`,
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 20px -5px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
            }}
            >
              <div style={{
                width: "54px",
                height: "54px",
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}99 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white"
              }}>
                {stat.icon}
              </div>
              <div>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.5rem", fontWeight: "700", color: "#2D3748" }}>
                  {stat.count}
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#718096", fontWeight: "500" }}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones principales */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "2rem",
          animation: "slideUp 0.6s ease-out 0.4s both"
        }}>
          {[
            { 
              title: "Mis Citas", 
              description: "Revisa y gestiona todas tus citas programadas. Consulta horarios, especialistas y estados de tus próximas consultas médicas.",
              icon: <CalendarCheck size={32} />,
              color: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
              action: () => navigate("/paciente/mis-citas")
            },
            { 
              title: "Reservar Cita", 
              description: "Agenda una nueva cita médica con nuestros especialistas. Elige fecha, horario y tipo de consulta según tu necesidad.",
              icon: <PlusCircle size={32} />,
              color: "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)",
              action: () => navigate("/paciente/reservar")
            },
            { 
              title: "Mi Perfil", 
              description: "Actualiza tu información personal, datos de contacto, historial médico y preferencias de atención médica.",
              icon: <User size={32} />,
              color: "linear-gradient(135deg, #2C7A7B 0%, #234E52 100%)",
              action: () => navigate("/paciente/perfil")
            }
          ].map((card, index) => (
            <div 
              key={index}
              onClick={card.action}
              style={{ 
                background: card.color, 
                borderRadius: "20px", 
                padding: "2.5rem",
                cursor: "pointer",
                transition: "all 0.4s ease",
                boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.2)",
                color: "white",
                position: "relative",
                overflow: "hidden",
                minHeight: "220px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 25px 35px -10px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 15px -5px rgba(0, 0, 0, 0.2)";
              }}
            >
              <div style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                animation: "float 6s ease-in-out infinite"
              }}></div>
              <div style={{
                position: "absolute",
                bottom: "-20px",
                left: "-20px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                animation: "float 8s ease-in-out infinite reverse"
              }}></div>
              
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  {card.icon}
                </div>
                <h3 style={{ 
                  color: "#ffffff", 
                  margin: "0 0 1rem 0", 
                  fontSize: "1.5rem", 
                  fontWeight: "600",
                }}>
                  {card.title}
                </h3>
                <p style={{ 
                  color: "rgba(255,255,255,0.9)", 
                  margin: 0, 
                  fontSize: "0.95rem",
                  lineHeight: "1.5"
                }}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div style={{ 
          background: "#ffffff", 
          borderRadius: "20px", 
          padding: "2.5rem",
          marginTop: "2.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          animation: "slideUp 0.6s ease-out 0.6s both",
          border: "1px solid #E2E8F0"
        }}>
          <h3 style={{ 
            margin: "0 0 1.5rem 0", 
            fontSize: "1.5rem", 
            fontWeight: "600", 
            color: "#2D3748",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}>
            <Heart size={24} color="#38B2AC" />
            Tu Salud es Nuestra Prioridad
          </h3>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "2rem" 
          }}>
            <div>
              <h4 style={{ color: "#38B2AC", margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>
                📞 Contacto de Emergencia
              </h4>
              <p style={{ color: "#718096", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
                Para emergencias médicas, contacta inmediatamente a nuestro centro de atención 24/7.
              </p>
            </div>
            
            <div>
              <h4 style={{ color: "#4299E1", margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>
                💊 Recordatorios de Medicación
              </h4>
              <p style={{ color: "#718096", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
                Configura recordatorios para tus medicamentos y tratamientos en curso.
              </p>
            </div>
            
            <div>
              <h4 style={{ color: "#68D391", margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>
                🏥 Resultados de Laboratorio
              </h4>
              <p style={{ color: "#718096", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
                Consulta tus resultados de análisis y estudios médicos de forma segura.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};