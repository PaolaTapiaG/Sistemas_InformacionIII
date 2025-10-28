import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getTurnos, type Turno } from "../../api/turnos";
import { getMedicos, type Medico } from "../../api/medicos";
import { CalendarCheck, Clock, User, Search, MapPin, Phone, Mail, Calendar, ChevronLeft, ChevronRight, Star, AlertCircle, CheckCircle, XCircle, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MisCitasPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreRol");
    navigate("/login");
  };

  // Simular datos del usuario


  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loadingMedicos, setLoadingMedicos] = useState(false);
  const [errorMedicos, setErrorMedicos] = useState<string | null>(null);

  const [vista, setVista] = useState<'calendario' | 'lista'>('calendario');
  const [mesActual, setMesActual] = useState(new Date());
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const idPaciente = typeof window !== "undefined" ? localStorage.getItem("idPaciente") : null;

  useEffect(() => {
    const run = async () => {
      if (!idPaciente) return;
      try {
        setError(null);
        setLoading(true);
        const data = await getTurnos();
        setTurnos(data);
      } catch (e: any) {
        setError(e?.message || "Error al cargar tus citas");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [idPaciente]);

  useEffect(() => {
    const run = async () => {
      try {
        setErrorMedicos(null);
        setLoadingMedicos(true);
        const data = await getMedicos();
        setMedicos(data);
      } catch (e: any) {
        setErrorMedicos(e?.message || "Error al cargar médicos");
      } finally {
        setLoadingMedicos(false);
      }
    };
    run();
  }, []);

  const turnosPaciente = useMemo(() => {
    if (!idPaciente) return [] as Turno[];
    let filtered = turnos.filter((t) => t.pacienteId === idPaciente);
    
    if (filtroEstado !== 'todos') {
      filtered = filtered.filter(t => t.estado === filtroEstado);
    }
    
    return filtered.sort((a, b) => {
      const da = new Date(`${a.fecha.substring(0,10)}T${a.horaInicio}`);
      const db = new Date(`${b.fecha.substring(0,10)}T${b.horaInicio}`);
      return da.getTime() - db.getTime();
    });
  }, [turnos, idPaciente, filtroEstado]);

  const medicoMap = useMemo(() => {
    const map = new Map<string, Medico>();
    for (const m of medicos) map.set(m.id, m);
    return map;
  }, [medicos]);

  // Funciones para el calendario
  const getDiasDelMes = (fecha: Date) => {
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const dias = [];

    // Agregar días del mes anterior para completar la primera semana
    for (let i = primerDia.getDay(); i > 0; i--) {
      const dia = new Date(year, month, -i + 1);
      dias.push({ fecha: dia, esDelMes: false });
    }

    // Agregar días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const dia = new Date(year, month, i);
      dias.push({ fecha: dia, esDelMes: true });
    }

    // Agregar días del mes siguiente para completar la última semana
    const diasRestantes = 42 - dias.length; // 6 semanas * 7 días
    for (let i = 1; i <= diasRestantes; i++) {
      const dia = new Date(year, month + 1, i);
      dias.push({ fecha: dia, esDelMes: false });
    }

    return dias;
  };

  const getCitasDelDia = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return turnosPaciente.filter(t => t.fecha.startsWith(fechaStr));
  };

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    setMesActual(prev => {
      const nuevoMes = new Date(prev);
      if (direccion === 'anterior') {
        nuevoMes.setMonth(nuevoMes.getMonth() - 1);
      } else {
        nuevoMes.setMonth(nuevoMes.getMonth() + 1);
      }
      return nuevoMes;
    });
  };

  const getEstadoIcono = (estado: string) => {
    switch (estado) {
      case 'Confirmado': return <CheckCircle size={16} />;
      case 'Pendiente': return <AlertCircle size={16} />;
      case 'Cancelado': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Confirmado': return { bg: '#D1FAE5', text: '#065F46', border: '#34D399' };
      case 'Pendiente': return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
      case 'Cancelado': return { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' };
      default: return { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' };
    }
  };

  const citasProximas = turnosPaciente
    .filter(t => new Date(`${t.fecha.substring(0,10)}T${t.horaInicio}`) >= new Date())
    .slice(0, 3);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
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

      {/* Navbar Mejorado */}
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
          }} onClick={() => navigate("/paciente")}>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                Gestión de Citas
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
                to: "/paciente", 
                label: "Inicio", 
                icon: <User size={18} />,
                current: false
              },
              { 
                to: "/paciente/mis-citas", 
                label: "Mis Citas", 
                icon: <CalendarCheck size={18} />,
                current: true
              },
              { 
                to: "/paciente/reservar", 
                label: "Reservar", 
                icon: <Search size={18} />,
                current: false
              },
                            { to: "/paciente/notificaciones", label: "Notificaciones", current: true },

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

          {/* Información del Usuario */}
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
                <User size={16} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#2D3748",
                  lineHeight: 1.2
                }}>
                  Conectado como Paciente
                </span>
                <span style={{
                  fontSize: "0.75rem",
                  color: "#718096",
                  lineHeight: 1.2
                }}>
                  {userData?.nombre || "Usuario"}
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
        
        {/* Header de la página */}
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
                Mis Citas Médicas
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: "1.1rem", 
                opacity: 0.9,
                lineHeight: "1.6",
                maxWidth: "600px"
              }}>
                Gestiona y revisa todas tus citas programadas. Mantén un control completo de tu agenda médica.
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
              <CalendarCheck size={40} color="white" />
            </div>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1.5rem", 
          marginBottom: "2rem",
          animation: "slideUp 0.6s ease-out 0.2s both"
        }}>
          {[
            { 
              label: "Total de Citas", 
              value: turnosPaciente.length.toString(), 
              color: "#38B2AC",
              icon: <CalendarCheck size={20} />
            },
            { 
              label: "Próximas", 
              value: turnosPaciente.filter(t => new Date(`${t.fecha.substring(0,10)}T${t.horaInicio}`) >= new Date()).length.toString(), 
              color: "#4299E1",
              icon: <Clock size={20} />
            },
            { 
              label: "Confirmadas", 
              value: turnosPaciente.filter(t => t.estado === 'Confirmado').length.toString(), 
              color: "#68D391",
              icon: <CheckCircle size={20} />
            },
            { 
              label: "Pendientes", 
              value: turnosPaciente.filter(t => t.estado === 'Pendiente').length.toString(), 
              color: "#F6AD55",
              icon: <AlertCircle size={20} />
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
                width: "48px",
                height: "48px",
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
                  {stat.value}
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#718096", fontWeight: "500" }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de Vista y Filtros */}
        <div style={{ 
          background: "#ffffff", 
          borderRadius: "16px", 
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          animation: "slideUp 0.6s ease-out 0.3s both",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setVista('calendario')}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "10px",
                border: vista === 'calendario' ? "2px solid #38B2AC" : "2px solid #E2E8F0",
                background: vista === 'calendario' ? "rgba(56, 178, 172, 0.1)" : "transparent",
                color: vista === 'calendario' ? "#38B2AC" : "#718096",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Calendar size={16} />
              Vista Calendario
            </button>
            <button
              onClick={() => setVista('lista')}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "10px",
                border: vista === 'lista' ? "2px solid #38B2AC" : "2px solid #E2E8F0",
                background: vista === 'lista' ? "rgba(56, 178, 172, 0.1)" : "transparent",
                color: vista === 'lista' ? "#38B2AC" : "#718096",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <CalendarCheck size={16} />
              Vista Lista
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#718096" }}>
              <Filter size={16} />
              <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>Filtrar por:</span>
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "2px solid #E2E8F0",
                background: "#FFFFFF",
                color: "#374151",
                fontWeight: "500",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#38B2AC"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
            >
              <option value="todos">Todos los estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Confirmado">Confirmadas</option>
              <option value="Cancelado">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Contenido Principal */}
        {!idPaciente ? (
          <div style={{ 
            background: "#ffffff", 
            borderRadius: "16px", 
            padding: "3rem",
            textAlign: "center",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            animation: "slideUp 0.6s ease-out"
          }}>
            <div style={{ color: "#EF4444", marginBottom: "1rem" }}>
              <AlertCircle size={48} />
            </div>
            <h3 style={{ color: "#DC2626", margin: "0 0 1rem 0", fontSize: "1.5rem" }}>
              Sesión no encontrada
            </h3>
            <p style={{ color: "#6B7280", margin: 0 }}>
              No se encontró tu sesión. Por favor, inicia sesión nuevamente.
            </p>
          </div>
        ) : loading ? (
          <div style={{ 
            background: "#ffffff", 
            borderRadius: "16px", 
            padding: "3rem",
            textAlign: "center",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            animation: "slideUp 0.6s ease-out"
          }}>
            <div style={{ 
              width: "50px", 
              height: "50px", 
              border: "4px solid #E2E8F0", 
              borderTop: "4px solid #38B2AC", 
              borderRadius: "50%", 
              animation: "spin 1s linear infinite",
              margin: "0 auto 1.5rem"
            }}></div>
            <p style={{ color: "#6B7280", margin: 0, fontSize: "1.1rem" }}>
              Cargando tus citas...
            </p>
          </div>
        ) : error ? (
          <div style={{ 
            background: "#FEF2F2", 
            borderRadius: "16px", 
            padding: "2rem",
            border: "1px solid #FECACA",
            animation: "slideUp 0.6s ease-out"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#DC2626" }}>
              <AlertCircle size={24} />
              <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Error</h3>
            </div>
            <p style={{ color: "#B91C1C", margin: "1rem 0 0 0" }}>
              {error}
            </p>
          </div>
        ) : turnosPaciente.length === 0 ? (
          <div style={{ 
            background: "#ffffff", 
            borderRadius: "16px", 
            padding: "4rem 2rem",
            textAlign: "center",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            animation: "slideUp 0.6s ease-out"
          }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              background: "rgba(56, 178, 172, 0.1)", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              color: "#38B2AC"
            }}>
              <CalendarCheck size={32} />
            </div>
            <h3 style={{ color: "#1F2937", margin: "0 0 1rem 0", fontSize: "1.5rem" }}>
              No tienes citas registradas
            </h3>
            <p style={{ color: "#6B7280", margin: "0 0 2rem 0" }}>
              Agenda tu primera cita médica para comenzar a gestionar tu salud.
            </p>
            <button
              onClick={() => navigate("/paciente/reservar")}
              style={{
                padding: "1rem 2rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px -1px rgba(56, 178, 172, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 15px -3px rgba(56, 178, 172, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(56, 178, 172, 0.3)";
              }}
            >
              Reservar mi primera cita
            </button>
          </div>
        ) : vista === 'calendario' ? (
          <div style={{ animation: "slideUp 0.6s ease-out 0.4s both" }}>
            {/* Vista Calendario */}
            <div style={{ 
              background: "#ffffff", 
              borderRadius: "16px", 
              padding: "2rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              marginBottom: "2rem"
            }}>
              {/* Controles del Calendario */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <button
                  onClick={() => cambiarMes('anterior')}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: "2px solid #E2E8F0",
                    background: "transparent",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#38B2AC";
                    e.currentTarget.style.color = "#38B2AC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.color = "#374151";
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <h3 style={{ 
                  margin: 0, 
                  color: "#1F2937", 
                  fontSize: "1.5rem", 
                  fontWeight: "600",
                  textAlign: "center"
                }}>
                  {mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </h3>
                
                <button
                  onClick={() => cambiarMes('siguiente')}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: "2px solid #E2E8F0",
                    background: "transparent",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#38B2AC";
                    e.currentTarget.style.color = "#38B2AC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.color = "#374151";
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Grid del Calendario */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(7, 1fr)", 
                gap: "1px",
                background: "#E2E8F0",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                overflow: "hidden"
              }}>
                {/* Días de la semana */}
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
                  <div key={dia} style={{ 
                    background: "#F7FAFC", 
                    padding: "1rem", 
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#4A5568",
                    fontSize: "0.9rem"
                  }}>
                    {dia}
                  </div>
                ))}
                
                {/* Días del mes */}
                {getDiasDelMes(mesActual).map(({ fecha, esDelMes }, index) => {
                  const citasDelDia = getCitasDelDia(fecha);
                  const esHoy = fecha.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={index}
                      style={{
                        background: "#FFFFFF",
                        padding: "0.75rem",
                        minHeight: "120px",
                        border: esHoy ? "2px solid #38B2AC" : "1px solid #E2E8F0",
                        position: "relative",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#F7FAFC";
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#FFFFFF";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <div style={{ 
                        fontWeight: "600", 
                        color: esDelMes ? (esHoy ? "#38B2AC" : "#2D3748") : "#CBD5E0",
                        marginBottom: "0.5rem",
                        fontSize: esHoy ? "1.1rem" : "1rem"
                      }}>
                        {fecha.getDate()}
                      </div>
                      
                      {/* Citas del día */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {citasDelDia.slice(0, 2).map((cita, citaIndex) => {
                          const estadoColor = getEstadoColor(cita.estado);
                          return (
                            <div
                              key={citaIndex}
                              style={{
                                background: estadoColor.bg,
                                color: estadoColor.text,
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: "500",
                                border: `1px solid ${estadoColor.border}`,
                                animation: "bounceIn 0.5s ease-out"
                              }}
                              title={`${cita.horaInicio} - ${medicoMap.get(cita.medicoId)?.usuario?.nombreUsuario || cita.medicoId}`}
                            >
                              {cita.horaInicio}
                            </div>
                          );
                        })}
                        {citasDelDia.length > 2 && (
                          <div style={{ 
                            color: "#718096", 
                            fontSize: "0.7rem", 
                            fontWeight: "500",
                            padding: "2px 6px"
                          }}>
                            +{citasDelDia.length - 2} más
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leyenda del Calendario */}
            <div style={{ 
              background: "#ffffff", 
              borderRadius: "16px", 
              padding: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <h4 style={{ margin: "0 0 1rem 0", color: "#374151", fontSize: "1rem", fontWeight: "600" }}>
                Leyenda de Estados
              </h4>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {[
                  { estado: 'Pendiente', color: getEstadoColor('Pendiente') },
                  { estado: 'Confirmado', color: getEstadoColor('Confirmado') },
                  { estado: 'Cancelado', color: getEstadoColor('Cancelado') }
                ].map((item, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: item.color.border
                    }}></div>
                    <span style={{ fontSize: "0.9rem", color: "#718096" }}>{item.estado}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Vista Lista */
          <div style={{ animation: "slideUp 0.6s ease-out 0.4s both" }}>
            {/* Próximas Citas */}
            {citasProximas.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ 
                  margin: "0 0 1rem 0", 
                  color: "#1F2937", 
                  fontSize: "1.25rem", 
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <Clock size={20} color="#38B2AC" />
                  Próximas Citas
                </h3>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
                  gap: "1.5rem" 
                }}>
                  {citasProximas.map((cita) => {
                    const medico = medicoMap.get(cita.medicoId);
                    const estadoColor = getEstadoColor(cita.estado);
                    const fechaCita = new Date(`${cita.fecha.substring(0,10)}T${cita.horaInicio}`);
                    
                    return (
                      <div key={cita.id} style={{ 
                        background: "#ffffff", 
                        borderRadius: "16px", 
                        padding: "1.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        border: `2px solid ${estadoColor.border}20`,
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
                          position: "absolute", 
                          top: 0, 
                          left: 0, 
                          right: 0, 
                          height: "4px", 
                          background: `linear-gradient(135deg, ${estadoColor.border} 0%, ${estadoColor.border}99 100%)` 
                        }}></div>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                          <div>
                            <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1F2937", marginBottom: "0.5rem" }}>
                              {cita.fecha.substring(0,10)}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4A5568" }}>
                              <Clock size={16} />
                              <span style={{ fontWeight: "500" }}>{cita.horaInicio} - {cita.horaFin}</span>
                            </div>
                          </div>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            background: estadoColor.bg,
                            color: estadoColor.text,
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: "600"
                          }}>
                            {getEstadoIcono(cita.estado)}
                            {cita.estado}
                          </div>
                        </div>

                        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                            <div style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              flexShrink: 0
                            }}>
                              <User size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: "600", color: "#1F2937" }}>
                                Dr. {medico?.usuario?.nombreUsuario || cita.medicoId}
                              </div>
                              <div style={{ fontSize: "0.85rem", color: "#718096" }}>
                                {medico?.especialidad?.nombre || "Especialista"}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "#718096" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <MapPin size={14} />
                              <span>Consultorio Central</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <Phone size={14} />
                              <span>+1 234 567 890</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Todas las Citas */}
            <div style={{ 
              background: "#ffffff", 
              borderRadius: "16px", 
              padding: "2rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ 
                margin: "0 0 1.5rem 0", 
                color: "#1F2937", 
                fontSize: "1.25rem", 
                fontWeight: "600" 
              }}>
                Todas mis Citas ({turnosPaciente.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {turnosPaciente.map((cita) => {
                  const medico = medicoMap.get(cita.medicoId);
                  const estadoColor = getEstadoColor(cita.estado);
                  const fechaCita = new Date(`${cita.fecha.substring(0,10)}T${cita.horaInicio}`);
                  const esPasada = fechaCita < new Date();
                  
                  return (
                    <div key={cita.id} style={{ 
                      display: "flex",
                      alignItems: "center",
                      gap: "1.5rem",
                      padding: "1.5rem",
                      background: esPasada ? "#F8FAFC" : "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#38B2AC";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
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
                          fontSize: "1.5rem", 
                          fontWeight: "700", 
                          color: esPasada ? "#CBD5E0" : "#38B2AC" 
                        }}>
                          {fechaCita.getDate()}
                        </div>
                        <div style={{ 
                          fontSize: "0.8rem", 
                          color: esPasada ? "#CBD5E0" : "#718096",
                          fontWeight: "500"
                        }}>
                          {fechaCita.toLocaleDateString('es-ES', { month: 'short' })}
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                          <div>
                            <div style={{ fontSize: "1.1rem", fontWeight: "600", color: esPasada ? "#CBD5E0" : "#1F2937" }}>
                              Dr. {medico?.usuario?.nombreUsuario || cita.medicoId}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: esPasada ? "#CBD5E0" : "#718096" }}>
                              {medico?.especialidad?.nombre || "Especialidad no especificada"}
                            </div>
                          </div>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            background: estadoColor.bg,
                            color: estadoColor.text,
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: "600"
                          }}>
                            {getEstadoIcono(cita.estado)}
                            {cita.estado}
                          </div>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.9rem", color: esPasada ? "#CBD5E0" : "#718096" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <Clock size={14} />
                            <span>{cita.horaInicio} - {cita.horaFin}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <MapPin size={14} />
                            <span>Consultorio {medico?.consultorio || "Principal"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Loading de médicos */}
        {loadingMedicos && (
          <div style={{ 
            background: "#ffffff", 
            borderRadius: "16px", 
            padding: "1.5rem",
            marginTop: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{ 
              width: "20px", 
              height: "20px", 
              border: "2px solid #E2E8F0", 
              borderTop: "2px solid #38B2AC", 
              borderRadius: "50%", 
              animation: "spin 1s linear infinite" 
            }}></div>
            <span style={{ color: "#6B7280" }}>Cargando información de médicos...</span>
          </div>
        )}

        {errorMedicos && (
          <div style={{ 
            background: "#FEF2F2", 
            borderRadius: "16px", 
            padding: "1rem",
            marginTop: "1rem",
            border: "1px solid #FECACA",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#DC2626"
          }}>
            <AlertCircle size={16} />
            <span>{errorMedicos}</span>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};