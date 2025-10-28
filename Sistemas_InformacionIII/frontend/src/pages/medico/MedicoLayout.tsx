import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { CalendarDays, Stethoscope, Users, Clock, TrendingUp, FileText, Bell, Activity, ArrowRight, UserCheck, CalendarCheck } from "lucide-react";
import { useState, useEffect } from "react";

export const MedicoLayout = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    citasHoy: 0,
    citasSemana: 0,
    pacientesActivos: 0,
    ingresosMensual: 0
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreRol");
    navigate("/login");
  };

  
  // Citas del día (simuladas)
  const citasHoy = [
    { id: 1, hora: "09:00", paciente: "Ana García", tipo: "Consulta", estado: "Confirmada" },
    { id: 2, hora: "10:30", paciente: "Roberto Sánchez", tipo: "Seguimiento", estado: "Confirmada" },
    { id: 3, hora: "11:45", paciente: "María López", tipo: "Revisión", estado: "Pendiente" },
    { id: 4, hora: "14:00", paciente: "Carlos Mendoza", tipo: "Consulta", estado: "Confirmada" }
  ];

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
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
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
        animation: "float 15s ease-in-out infinite",
        zIndex: 0
      }}></div>

      {/* Navbar Médico Mejorado */}
      <nav style={{
        background: "rgba(255, 255, 255, 0.97)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        padding: "1rem 2rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(56, 178, 172, 0.15)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {/* Logo y Marca */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            cursor: "pointer"
          }} onClick={() => navigate("/medico")}>
            <div style={{
              width: "42px",
              height: "42px",
              background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 8px rgba(56, 178, 172, 0.3)",
              animation: "float 6s ease-in-out infinite"
            }}>
              <Stethoscope size={20} />
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: "1.4rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.2
              }}>
                MediConnect
              </h1>
              <p style={{
                margin: 0,
                fontSize: "0.75rem",
                color: "#718096",
                fontWeight: "500",
                letterSpacing: "0.5px"
              }}>
                Panel Médico
              </p>
            </div>
          </div>

          {/* Navegación Principal */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(56, 178, 172, 0.05)",
            borderRadius: "12px",
            padding: "0.5rem",
            border: "1px solid rgba(56, 178, 172, 0.1)"
          }}>
            {[
              { 
                to: "/medico", 
                label: "Dashboard", 
                icon: <Stethoscope size={18} />,
                current: true
              },
              { 
                to: "/medico/mis-citas", 
                label: "Mis Citas", 
                icon: <CalendarDays size={18} />,
                current: false
              },
              { 
                to: "/medico/pacientes", 
                label: "Pacientes", 
                icon: <Users size={18} />,
                current: false
              },
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
                  color: item.current ? "#FFFFFF" : "#38B2AC",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  background: item.current ? "linear-gradient(135deg, #38B2AC 0%, #319795 100%)" : "transparent",
                  boxShadow: item.current ? "0 4px 8px rgba(56, 178, 172, 0.3)" : "none",
                  border: item.current ? "none" : "1px solid transparent"
                }}
                onMouseEnter={(e) => {
                  if (!item.current) {
                    e.currentTarget.style.background = "rgba(56, 178, 172, 0.1)";
                    e.currentTarget.style.border = "1px solid rgba(56, 178, 172, 0.2)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.current) {
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

          {/* Información del Médico */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem 1rem",
              background: "rgba(56, 178, 172, 0.05)",
              borderRadius: "10px",
              border: "1px solid rgba(56, 178, 172, 0.1)"
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 2px 4px rgba(66, 153, 225, 0.3)"
              }}>
                <Stethoscope size={16} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#2D3748",
                  lineHeight: 1.2
                }}>
                  {userData?.nombre || "Dr. Médico"}
                </span>
                <span style={{
                  fontSize: "0.75rem",
                  color: "#718096",
                  lineHeight: 1.2
                }}>
                  {userData?.especialidad || "Especialista"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "2rem 1.5rem",
        position: "relative",
        zIndex: 1
      }}>
        
        {/* Header de Bienvenida */}
        <div style={{ 
          background: "linear-gradient(135deg, #38B2AC 0%, #319795 50%, #2C7A7B 100%)", 
          borderRadius: "20px", 
          padding: "2.5rem",
          marginBottom: "2rem",
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
          
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "2.25rem", 
                fontWeight: 700,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                Bienvenido, {userData?.nombre?.split(' ')[1] || 'Doctor'}
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: "1.1rem", 
                opacity: 0.9,
                lineHeight: "1.6",
                maxWidth: "600px"
              }}>
                {userData?.especialidad} • {userData?.experiencia} de experiencia • Consultorio {userData?.consultorio}
              </p>
            </div>
            <div style={{
              width: "100px",
              height: "100px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              animation: "pulse 3s ease-in-out infinite"
            }}>
              <Stethoscope size={40} color="white" />
            </div>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: "1.5rem", 
          marginBottom: "2rem",
          animation: "slideUp 0.6s ease-out 0.2s both"
        }}>
          {[
            { 
              label: "Citas Hoy", 
              value: estadisticas.citasHoy.toString(), 
              color: "#38B2AC",
              icon: <CalendarDays size={20} />,
              trend: "+12%"
            },
            { 
              label: "Citas Esta Semana", 
              value: estadisticas.citasSemana.toString(), 
              color: "#4299E1",
              icon: <CalendarCheck size={20} />,
              trend: "+8%"
            },
            { 
              label: "Pacientes Activos", 
              value: estadisticas.pacientesActivos.toString(), 
              color: "#68D391",
              icon: <UserCheck size={20} />,
              trend: "+5%"
            },
            { 
              label: "Ingresos Mensual", 
              value: `$${estadisticas.ingresosMensual.toLocaleString()}`,
              color: "#F6AD55",
              icon: <TrendingUp size={20} />,
              trend: "+15%"
            }
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
              transition: "all 0.3s ease",
              position: "relative",
              overflow: "hidden"
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
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.5rem", fontWeight: "700", color: "#2D3748" }}>
                  {stat.value}
                </h3>
                <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.9rem", color: "#718096", fontWeight: "500" }}>
                  {stat.label}
                </p>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  color: "#68D391",
                  fontWeight: "600"
                }}>
                  <TrendingUp size={12} />
                  {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "2fr 1fr", 
          gap: "2rem",
          animation: "slideUp 0.6s ease-out 0.3s both"
        }}>
          {/* Columna Principal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Acciones Rápidas */}
            <div style={{ 
              background: "#ffffff", 
              borderRadius: "16px", 
              padding: "2rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ 
                margin: "0 0 1.5rem 0", 
                fontSize: "1.25rem", 
                fontWeight: "600", 
                color: "#2D3748",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <Activity size={20} color="#38B2AC" />
                Acciones Rápidas
              </h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {[
                  { 
                    title: "Agenda del Día", 
                    description: "Revisar citas programadas para hoy",
                    icon: <CalendarDays size={24} />,
                    color: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
                    action: () => navigate("/medico/mis-citas")
                  },
                  { 
                    title: "Gestión de Pacientes", 
                    description: "Ver historiales médicos",
                    icon: <Users size={24} />,
                    color: "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)",
                    action: () => navigate("/medico/pacientes")
                  },
                  { 
                    title: "Reportes Médicos", 
                    description: "Generar informes y estadísticas",
                    icon: <FileText size={24} />,
                    color: "linear-gradient(135deg, #2C7A7B 0%, #234E52 100%)",
                    action: () => navigate("/medico/reportes")
                  }
                ].map((card, index) => (
                  <div 
                    key={index}
                    onClick={card.action}
                    style={{ 
                      background: card.color, 
                      borderRadius: "12px", 
                      padding: "1.5rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      color: "white",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 20px -5px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <div style={{ marginBottom: "1rem" }}>
                      {card.icon}
                    </div>
                    <h4 style={{ 
                      color: "#ffffff", 
                      margin: "0 0 0.5rem 0", 
                      fontSize: "1.1rem", 
                      fontWeight: "600",
                    }}>
                      {card.title}
                    </h4>
                    <p style={{ 
                      color: "rgba(255,255,255,0.9)", 
                      margin: 0, 
                      fontSize: "0.85rem",
                      lineHeight: "1.4"
                    }}>
                      {card.description}
                    </p>
                    <div style={{
                      position: "absolute",
                      bottom: "1rem",
                      right: "1rem",
                      opacity: 0.7
                    }}>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Citas del Día */}
            <div style={{ 
              background: "#ffffff", 
              borderRadius: "16px", 
              padding: "2rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: "1.25rem", 
                  fontWeight: "600", 
                  color: "#2D3748",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem"
                }}>
                  <Clock size={20} color="#38B2AC" />
                  Agenda de Hoy
                </h3>
                <span style={{ 
                  color: "#718096", 
                  fontSize: "0.9rem", 
                  fontWeight: "500",
                  background: "rgba(56, 178, 172, 0.1)",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px"
                }}>
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {citasHoy.map((cita, index) => (
                  <div key={cita.id} style={{ 
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.25rem",
                    background: "#F7FAFC",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#38B2AC";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F7FAFC";
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                  >
                    <div style={{ 
                      width: "60px", 
                      textAlign: "center",
                      flexShrink: 0
                    }}>
                      <div style={{ 
                        fontSize: "1.1rem", 
                        fontWeight: "700", 
                        color: "#38B2AC" 
                      }}>
                        {cita.hora}
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <div>
                          <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1F2937" }}>
                            {cita.paciente}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#718096" }}>
                            {cita.tipo}
                          </div>
                        </div>
                        <div style={{ 
                          padding: "0.25rem 0.75rem",
                          background: cita.estado === 'Confirmada' ? "#D1FAE5" : "#FEF3C7",
                          color: cita.estado === 'Confirmada' ? "#065F46" : "#92400E",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600"
                        }}>
                          {cita.estado}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate("/medico/mis-citas")}
                style={{
                  width: "100%",
                  marginTop: "1.5rem",
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "2px solid #E2E8F0",
                  background: "transparent",
                  color: "#38B2AC",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(56, 178, 172, 0.1)";
                  e.currentTarget.style.borderColor = "#38B2AC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#E2E8F0";
                }}
              >
                Ver Agenda Completa
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Próximos Eventos */}
            <div style={{ 
              background: "#ffffff", 
              borderRadius: "16px", 
              padding: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "1.1rem", 
                fontWeight: "600", 
                color: "#2D3748",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Bell size={16} color="#4299E1" />
                Recordatorios
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { texto: "Reunión médica mensual - Mañana 10:00", tipo: "reunion" },
                  { texto: "Renovar licencia médica - Próxima semana", tipo: "documento" },
                  { texto: "Capacitación nueva tecnología - 15 Nov", tipo: "capacitacion" }
                ].map((evento, index) => (
                  <div key={index} style={{ 
                    padding: "0.75rem",
                    background: "#F7FAFC",
                    borderRadius: "8px",
                    borderLeft: `3px solid ${
                      evento.tipo === 'reunion' ? '#4299E1' : 
                      evento.tipo === 'documento' ? '#68D391' : '#F6AD55'
                    }`,
                    fontSize: "0.85rem",
                    color: "#4A5568"
                  }}>
                    {evento.texto}
                  </div>
                ))}
              </div>
            </div>

            {/* Información del Consultorio */}
            <div style={{ 
              background: "linear-gradient(135deg, #2C7A7B 0%, #234E52 100%)", 
              borderRadius: "16px", 
              padding: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              color: "white"
            }}>
              <h3 style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "1.1rem", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Stethoscope size={16} color="white" />
                Mi Consultorio
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", opacity: 0.9 }}>
                  <div style={{ width: "20px", textAlign: "center" }}>📍</div>
                  <span>Consultorio {userData?.consultorio}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", opacity: 0.9 }}>
                  <div style={{ width: "20px", textAlign: "center" }}>📞</div>
                  <span>{userData?.telefono}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", opacity: 0.9 }}>
                  <div style={{ width: "20px", textAlign: "center" }}>🕒</div>
                  <span>Lun-Vie: 8:00 - 18:00</span>
                </div>
              </div>
            </div>

            {/* Acceso Rápido */}
            {/* Acceso Rápido */}
<div style={{ 
  background: "#ffffff", 
  borderRadius: "16px", 
  padding: "1.5rem",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
}}>
  <h3 style={{ 
    margin: "0 0 1rem 0", 
    fontSize: "1.1rem", 
    fontWeight: "600", 
    color: "#2D3748"
  }}>
    Acceso Rápido
  </h3>
  
  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
    {[
      { label: "Nueva Prescripción", action: () => navigate("/medico/prescripciones") },
      { label: "Horarios del Médico", action: () => navigate("/medico/horarios") },
      { label: "Configuración", action: () => navigate("/medico/configuracion") }
    ].map((item, index) => (
      <button
        key={index}
        onClick={item.action}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          background: "transparent",
          color: "#4A5568",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.3s ease",
          textAlign: "left"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(56, 178, 172, 0.05)";
          e.currentTarget.style.borderColor = "#38B2AC";
          e.currentTarget.style.color = "#38B2AC";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "#E2E8F0";
          e.currentTarget.style.color = "#4A5568";
        }}
      >
        {item.label}
      </button>
    ))}
  </div>
</div>

          </div>
        </div>
      </main>
    </div>
  );
};