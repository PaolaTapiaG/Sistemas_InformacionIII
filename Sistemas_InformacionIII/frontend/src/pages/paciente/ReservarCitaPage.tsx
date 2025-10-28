import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getEspecialidades, type Especialidad } from "../../api/especialidades";
import { getMedicos, type Medico } from "../../api/medicos";
import { getHorariosDisponibles, type HorarioDisponible } from "../../api/horarios";
import { postTurno, getTurnos, type Turno } from "../../api/turnos";
import { CalendarClock, Search, User, Clock, MapPin, Star, Shield, Heart, ArrowRight, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ReservarCitaPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreRol");
    navigate("/login");
  };

  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [especialidadesLoading, setEspecialidadesLoading] = useState(false);
  const [especialidadesError, setEspecialidadesError] = useState<string | null>(null);

  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicosLoading, setMedicosLoading] = useState(false);
  const [medicosError, setMedicosError] = useState<string | null>(null);

  const [horarios, setHorarios] = useState<HorarioDisponible[]>([]);
  const [horariosLoading, setHorariosLoading] = useState(false);
  const [horariosError, setHorariosError] = useState<string | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnosLoading, setTurnosLoading] = useState(false);
  const [turnosError, setTurnosError] = useState<string | null>(null);

  const [especialidadId, setEspecialidadId] = useState<string>("");
  const [medicoId, setMedicoId] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [reservando, setReservando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [pasoActual, setPasoActual] = useState(1);

  // Cargar especialidades al inicio
  useEffect(() => {
    const run = async () => {
      try {
        setEspecialidadesLoading(true);
        const data = await getEspecialidades();
        setEspecialidades(data);
      } catch (e: any) {
        setEspecialidadesError(e?.message || "Error al cargar especialidades");
      } finally {
        setEspecialidadesLoading(false);
      }
    };
    run();
  }, []);

  // Cuando el usuario elija una especialidad, cargar médicos
  useEffect(() => {
    if (!especialidadId) return;
    const run = async () => {
      try {
        setMedicosError(null);
        setMedicosLoading(true);
        const data = await getMedicos();
        setMedicos(data);
        setPasoActual(2);
      } catch (e: any) {
        setMedicosError(e?.message || "Error al cargar médicos");
      } finally {
        setMedicosLoading(false);
      }
    };
    run();
  }, [especialidadId]);

  useEffect(() => {
    if (!medicoId) return;
    const run = async () => {
      try {
        setHorariosError(null);
        setHorariosLoading(true);
        const data = await getHorariosDisponibles();
        setHorarios(data);
        setPasoActual(3);
      } catch (e: any) {
        setHorariosError(e?.message || "Error al cargar horarios");
      } finally {
        setHorariosLoading(false);
      }
    };
    run();
  }, [medicoId]);

  useEffect(() => {
    if (!medicoId || !fecha) return;
    const run = async () => {
      try {
        setTurnosError(null);
        setTurnosLoading(true);
        const data = await getTurnos();
        setTurnos(data);
      } catch (e: any) {
        setTurnosError(e?.message || "Error al cargar turnos");
      } finally {
        setTurnosLoading(false);
      }
    };
    run();
  }, [medicoId, fecha]);
  const normalize = (s: string) => s.normalize?.("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || s.toLowerCase();
  const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  const diasCompletos = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const medicosFiltrados = useMemo(() => {
    if (!especialidadId) return [] as Medico[];
    return medicos.filter((m) => m.especialidadId === especialidadId);
  }, [medicos, especialidadId]);

  const horariosFiltrados = useMemo(() => {
    if (!medicoId) return [] as HorarioDisponible[];
    return horarios.filter((h) => h.medicoId === medicoId);
  }, [horarios, medicoId]);

  const dayNameFromFecha = useMemo(() => {
    if (!fecha) return null as string | null;
    const d = new Date(`${fecha}T00:00:00`);
    return dias[d.getDay()];
  }, [fecha, dias]);

  const horariosPorDia = useMemo(() => {
    if (!dayNameFromFecha) return [] as HorarioDisponible[];
    return horariosFiltrados.filter((h) => normalize(h.diaSemana) === dayNameFromFecha);
  }, [horariosFiltrados, dayNameFromFecha]);

  const horariosDisponiblesFinal = useMemo(() => {
    if (!fecha || !medicoId) return [] as HorarioDisponible[];
    const fechaIso = `${fecha}T00:00:00`;
    const ocupados = new Set(
      turnos
        .filter((t) => t.medicoId === medicoId && t.fecha === fechaIso)
        .map((t) => `${t.horaInicio}-${t.horaFin}`)
    );
    return horariosPorDia.filter((h) => !ocupados.has(`${h.horaInicio}-${h.horaFin}`));
  }, [fecha, medicoId, horariosPorDia, turnos]);

  const reservar = async (h: HorarioDisponible) => {
    setMensaje(null);
    if (!fecha) {
      alert("Selecciona una fecha primero.");
      return;
    }
    
    const d = new Date(`${fecha}T00:00:00`);
    const dayName = dias[d.getDay()];
    const horarioDay = normalize(h.diaSemana);
    if (dayName !== horarioDay) {
      alert(`La fecha seleccionada (${fecha}) no coincide con el día del horario (${h.diaSemana}).`);
      return;
    }

    const idPaciente = localStorage.getItem("idPaciente");
    if (!idPaciente) {
      alert("No se encontró el idPaciente en la sesión. Inicia sesión nuevamente.");
      return;
    }

    try {
      setReservando(true);
      await postTurno({
        idPaciente,
        idMedico: medicoId,
        fecha: `${fecha}T00:00:00`,
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        estado: "Pendiente",
      });
      setMensaje("✅ Turno reservado con éxito. Recibirás una confirmación por correo.");
      setTimeout(() => {
        setEspecialidadId("");
        setMedicoId("");
        setFecha("");
        setPasoActual(1);
        setMensaje(null);
      }, 3000);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Error al reservar el turno";
      setMensaje(`❌ ${msg}`);
    } finally {
      setReservando(false);
    }
  };

  const medicoSeleccionado = medicos.find(m => m.id === medicoId);
  const especialidadSeleccionada = especialidades.find(e => e.id === especialidadId);

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
        @keyframes progress {
          0% { width: 0%; }
          100% { width: var(--progress-width); }
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
      
      <Navbar
        brand={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
              flexShrink: 0
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "white" }}>
                <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" />
                <path d="M12 6v12M6 12h12" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{
                fontWeight: 700,
                fontSize: 18,
                background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                MediConnect
              </span>
              <span style={{
                fontSize: 12,
                color: "#718096",
                fontWeight: 500
              }}>
                Reserva de Citas
              </span>
            </div>
          </div>
        }
        userLabel="Paciente"
        onLogout={logout}
        items={[
          { to: "/paciente", label: "Inicio", icon: <User size={18} /> },
          { to: "/paciente/mis-citas", label: "Mis Citas", icon: <CalendarClock size={18} /> },
          { to: "/paciente/reservar", label: "Reservar", icon: <Search size={18} /> },
        ]}
        navStyle={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.06)",
          borderBottom: "1px solid rgba(15,23,42,0.04)"
        }}
      />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem", position: "relative", zIndex: 1 }}>
        
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
          
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "2rem" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "2.25rem", 
                fontWeight: 700,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                Reserva tu Cita Médica
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: "1.1rem", 
                opacity: 0.9,
                lineHeight: "1.6",
                maxWidth: "500px"
              }}>
                Agenda tu consulta médica de forma rápida y segura. Elige entre nuestros especialistas y encuentra el horario que mejor se adapte a tus necesidades.
              </p>
            </div>
            <div style={{
              width: "120px",
              height: "120px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              animation: "pulse 3s ease-in-out infinite"
            }}>
              <CalendarClock size={48} color="white" />
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={{ 
          background: "#ffffff", 
          borderRadius: "16px", 
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          animation: "slideUp 0.6s ease-out 0.2s both"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            {[1, 2, 3].map((paso) => (
              <div key={paso} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: paso <= pasoActual ? "linear-gradient(135deg, #38B2AC 0%, #319795 100%)" : "#E2E8F0",
                  color: paso <= pasoActual ? "white" : "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  boxShadow: paso <= pasoActual ? "0 4px 6px -1px rgba(56, 178, 172, 0.3)" : "none"
                }}>
                  {paso}
                </div>
                {paso < 3 && (
                  <div style={{
                    flex: 1,
                    height: "3px",
                    background: paso < pasoActual ? "linear-gradient(135deg, #38B2AC 0%, #319795 100%)" : "#E2E8F0",
                    margin: "0 1rem",
                    transition: "all 0.3s ease"
                  }}></div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6B7280", fontWeight: "500" }}>
            <span style={{ color: pasoActual >= 1 ? "#38B2AC" : "#9CA3AF" }}>Especialidad</span>
            <span style={{ color: pasoActual >= 2 ? "#38B2AC" : "#9CA3AF" }}>Médico</span>
            <span style={{ color: pasoActual >= 3 ? "#38B2AC" : "#9CA3AF" }}>Fecha y Hora</span>
          </div>
        </div>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          
          {/* Paso 1: Especialidad */}
          <div style={{ 
            background: "#ffffff", 
            borderRadius: "20px", 
            padding: "2rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            animation: "slideUp 0.6s ease-out 0.3s both",
            border: pasoActual >= 1 ? "2px solid rgba(56, 178, 172, 0.2)" : "2px solid transparent"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white"
              }}>
                <Users size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: "#1F2937", fontSize: "1.25rem", fontWeight: 600 }}>1. Selecciona una especialidad</h3>
                <p style={{ margin: "0.25rem 0 0 0", color: "#6B7280", fontSize: "0.9rem" }}>Elige el área médica que necesitas consultar</p>
              </div>
            </div>

            {especialidadesLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", background: "#F7FAFC", borderRadius: "12px" }}>
                <div style={{ width: "20px", height: "20px", border: "2px solid #E2E8F0", borderTop: "2px solid #38B2AC", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                <span style={{ color: "#6B7280" }}>Cargando especialidades...</span>
              </div>
            ) : especialidadesError ? (
              <div style={{ color: "#DC2626", background: "#FEE2E2", padding: "1rem", borderRadius: "8px", border: "1px solid #FECACA" }}>
                {especialidadesError}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {especialidades.map((esp) => (
                  <div 
                    key={esp.id}
                    onClick={() => setEspecialidadId(esp.id)}
                    style={{ 
                      border: esp.id === especialidadId ? "2px solid #38B2AC" : "2px solid #E2E8F0", 
                      borderRadius: "16px", 
                      padding: "1.5rem",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      background: esp.id === especialidadId ? "rgba(56, 178, 172, 0.05)" : "#ffffff",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseEnter={(e) => {
                      if (esp.id !== especialidadId) {
                        e.currentTarget.style.borderColor = "#38B2AC";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 12px 20px -5px rgba(0, 0, 0, 0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (esp.id !== especialidadId) {
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #38B2AC 0%, #319795 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white"
                      }}>
                        <Heart size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#1F2937", fontSize: "1.1rem" }}>
                          {esp.nombre}
                        </div>
                        <div style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                          {esp.descripcion || "Especialidad médica"}
                        </div>
                      </div>
                    </div>
                    {esp.id === especialidadId && (
                      <div style={{ 
                        position: "absolute", 
                        top: "12px", 
                        right: "12px", 
                        background: "#38B2AC", 
                        color: "white", 
                        padding: "4px 8px", 
                        borderRadius: "20px", 
                        fontSize: "0.75rem", 
                        fontWeight: "600" 
                      }}>
                        Seleccionado
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paso 2: Médicos */}
          {especialidadId && (
            <div style={{ 
              background: "#ffffff", 
              borderRadius: "20px", 
              padding: "2rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              animation: "slideUp 0.6s ease-out 0.4s both",
              border: pasoActual >= 2 ? "2px solid rgba(56, 178, 172, 0.2)" : "2px solid transparent"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#1F2937", fontSize: "1.25rem", fontWeight: 600 }}>2. Elige tu médico</h3>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#6B7280", fontSize: "0.9rem" }}>
                    {especialidadSeleccionada ? `Especialistas en ${especialidadSeleccionada.nombre}` : "Selecciona un profesional"}
                  </p>
                </div>
              </div>

              {!especialidadId ? (
                <div style={{ color: "#6B7280", padding: "1.5rem", textAlign: "center", background: "#F7FAFC", borderRadius: "12px" }}>
                  Selecciona una especialidad para ver los médicos disponibles
                </div>
              ) : medicosLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", background: "#F7FAFC", borderRadius: "12px" }}>
                  <div style={{ width: "20px", height: "20px", border: "2px solid #E2E8F0", borderTop: "2px solid #4299E1", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                  <span style={{ color: "#6B7280" }}>Cargando médicos...</span>
                </div>
              ) : medicosError ? (
                <div style={{ color: "#DC2626", background: "#FEE2E2", padding: "1rem", borderRadius: "8px", border: "1px solid #FECACA" }}>
                  {medicosError}
                </div>
              ) : medicosFiltrados.length === 0 ? (
                <div style={{ color: "#6B7280", padding: "1.5rem", textAlign: "center", background: "#F7FAFC", borderRadius: "12px" }}>
                  No hay médicos disponibles para esta especialidad en este momento
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                  {medicosFiltrados.map((m) => (
                    <div 
                      key={m.id} 
                      style={{ 
                        border: m.id === medicoId ? "2px solid #4299E1" : "2px solid #E2E8F0", 
                        borderRadius: "16px", 
                        padding: "1.5rem",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        background: m.id === medicoId ? "rgba(66, 153, 225, 0.05)" : "#ffffff",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      onClick={() => setMedicoId(m.id)}
                      onMouseEnter={(e) => {
                        if (m.id !== medicoId) {
                          e.currentTarget.style.borderColor = "#4299E1";
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 20px -5px rgba(0, 0, 0, 0.15)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (m.id !== medicoId) {
                          e.currentTarget.style.borderColor = "#E2E8F0";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                        <div style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #4299E1 0%, #3182CE 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          flexShrink: 0
                        }}>
                          <User size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: "#1F2937", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                            Dr. {m.usuario?.nombreUsuario || "Médico"}
                          </div>
                          <div style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                            {m.especialidad?.nombre || "Especialista"}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#4299E1" }}>
                              <Star size={14} fill="#4299E1" color="#4299E1" />
                              <span>4.8</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#6B7280" }}>
                              <MapPin size={14} />
                              <span>Consultorio Central</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {m.id === medicoId && (
                        <div style={{ 
                          position: "absolute", 
                          top: "12px", 
                          right: "12px", 
                          background: "#4299E1", 
                          color: "white", 
                          padding: "4px 8px", 
                          borderRadius: "20px", 
                          fontSize: "0.75rem", 
                          fontWeight: "600" 
                        }}>
                          Seleccionado
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Paso 3: Horarios */}
          {medicoId && (
            <div style={{ 
              background: "#ffffff", 
              borderRadius: "20px", 
              padding: "2rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              animation: "slideUp 0.6s ease-out 0.5s both",
              border: pasoActual >= 3 ? "2px solid rgba(56, 178, 172, 0.2)" : "2px solid transparent"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #2C7A7B 0%, #234E52 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#1F2937", fontSize: "1.25rem", fontWeight: 600 }}>3. Fecha y horario</h3>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#6B7280", fontSize: "0.9rem" }}>
                    {medicoSeleccionado ? `Dr. ${medicoSeleccionado.usuario?.nombreUsuario}` : "Selecciona fecha y hora"}
                  </p>
                </div>
              </div>

              {!medicoId ? (
                <div style={{ color: "#6B7280", padding: "1.5rem", textAlign: "center", background: "#F7FAFC", borderRadius: "12px" }}>
                  Selecciona un médico para ver los horarios disponibles
                </div>
              ) : horariosLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", background: "#F7FAFC", borderRadius: "12px" }}>
                  <div style={{ width: "20px", height: "20px", border: "2px solid #E2E8F0", borderTop: "2px solid #2C7A7B", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                  <span style={{ color: "#6B7280" }}>Cargando horarios...</span>
                </div>
              ) : horariosError ? (
                <div style={{ color: "#DC2626", background: "#FEE2E2", padding: "1rem", borderRadius: "8px", border: "1px solid #FECACA" }}>
                  {horariosError}
                </div>
              ) : turnosLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", background: "#F7FAFC", borderRadius: "12px" }}>
                  <div style={{ width: "20px", height: "20px", border: "2px solid #E2E8F0", borderTop: "2px solid #2C7A7B", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                  <span style={{ color: "#6B7280" }}>Verificando disponibilidad...</span>
                </div>
              ) : turnosError ? (
                <div style={{ color: "#DC2626", background: "#FEE2E2", padding: "1rem", borderRadius: "8px", border: "1px solid #FECACA" }}>
                  {turnosError}
                </div>
              ) : horariosFiltrados.length === 0 ? (
                <div style={{ color: "#6B7280", padding: "1.5rem", textAlign: "center", background: "#F7FAFC", borderRadius: "12px" }}>
                  No hay horarios disponibles para este médico en este momento
                </div>
              ) : (
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "inline-flex", flexDirection: "column", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.95rem" }}>Selecciona una fecha</span>
                      <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        style={{ 
                          padding: "12px 16px", 
                          borderRadius: "12px", 
                          border: "2px solid #E2E8F0", 
                          minWidth: "240px", 
                          fontSize: "14px", 
                          outline: "none", 
                          transition: "all 0.3s ease",
                          background: "#F7FAFC"
                        }}
                        disabled={reservando}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#38B2AC";
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#E2E8F0";
                          e.currentTarget.style.background = "#F7FAFC";
                        }}
                      />
                    </label>
                  </div>

                  {!fecha ? (
                    <div style={{ color: "#6B7280", padding: "1.5rem", textAlign: "center", background: "#F7FAFC", borderRadius: "12px" }}>
                      Selecciona una fecha para ver los horarios disponibles
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ margin: "0 0 1rem 0", color: "#374151", fontSize: "1.1rem", fontWeight: 600 }}>
                        Horarios disponibles para el {fecha} ({diasCompletos[new Date(`${fecha}T00:00:00`).getDay()]})
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                        {horariosDisponiblesFinal.map((h) => (
                          <div 
                            key={h.id} 
                            style={{ 
                              border: "2px solid #E2E8F0", 
                              borderRadius: "16px", 
                              padding: "1.5rem",
                              background: "linear-gradient(135deg, rgba(56, 178, 172, 0.03) 0%, rgba(44, 122, 123, 0.03) 100%)",
                              transition: "all 0.3s ease",
                              position: "relative",
                              overflow: "hidden"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#38B2AC";
                              e.currentTarget.style.transform = "translateY(-4px)";
                              e.currentTarget.style.boxShadow = "0 12px 20px -5px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#E2E8F0";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                              <div style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #2C7A7B 0%, #234E52 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white"
                              }}>
                                <Clock size={20} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: "#1F2937", fontSize: "1.1rem" }}>
                                  {h.horaInicio} - {h.horaFin}
                                </div>
                                <div style={{ color: "#6B7280", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                                  {h.diaSemana}
                                </div>
                              </div>
                            </div>
                            <div style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "1rem" }}>
                              Duración: <strong>{h.duracionTurno} minutos</strong>
                            </div>
                            <button
                              onClick={() => reservar(h)}
                              disabled={reservando}
                              style={{ 
                                width: "100%",
                                padding: "12px 16px", 
                                borderRadius: "10px", 
                                border: "none", 
                                background: reservando ? "#9CA3AF" : "linear-gradient(135deg, #2C7A7B 0%, #234E52 100%)", 
                                color: "white",
                                fontWeight: "600",
                                cursor: reservando ? "not-allowed" : "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem"
                              }}
                              onMouseEnter={(e) => {
                                if (!reservando) {
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                  e.currentTarget.style.boxShadow = "0 8px 15px -3px rgba(0, 0, 0, 0.2)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                              }}
                            >
                              {reservando ? (
                                <>
                                  <div style={{ width: "16px", height: "16px", border: "2px solid transparent", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                                  Reservando...
                                </>
                              ) : (
                                <>
                                  <CalendarClock size={16} />
                                  Reservar esta cita
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                        {horariosDisponiblesFinal.length === 0 && (
                          <div style={{ 
                            gridColumn: "1 / -1", 
                            color: "#6B7280", 
                            padding: "2rem", 
                            textAlign: "center", 
                            background: "#F7FAFC", 
                            borderRadius: "12px" 
                          }}>
                            <Clock size={48} color="#9CA3AF" style={{ marginBottom: "1rem" }} />
                            <div style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>No hay horarios disponibles</div>
                            <div>No hay citas disponibles para la fecha seleccionada. Por favor, intenta con otra fecha.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {mensaje && (
                    <div style={{ 
                      color: mensaje.includes("❌") ? "#DC2626" : "#065F46", 
                      background: mensaje.includes("❌") ? "#FEE2E2" : "#D1FAE5", 
                      border: `1px solid ${mensaje.includes("❌") ? "#FECACA" : "#34D399"}`, 
                      padding: "1rem 1.5rem", 
                      borderRadius: "12px", 
                      marginTop: "1rem",
                      animation: "slideUp 0.3s ease-out"
                    }}>
                      {mensaje}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Información adicional */}
          <div style={{ 
            background: "#ffffff", 
            borderRadius: "20px", 
            padding: "2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            animation: "slideUp 0.6s ease-out 0.6s both",
            border: "1px solid #E2E8F0"
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
              <Shield size={24} color="#38B2AC" />
              Información Importante
            </h3>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: "1.5rem" 
            }}>
              <div>
                <h4 style={{ color: "#38B2AC", margin: "0 0 0.75rem 0", fontSize: "1rem", fontWeight: "600" }}>
                  ⏰ Llegada Puntual
                </h4>
                <p style={{ color: "#718096", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Te recomendamos llegar 15 minutos antes de tu cita para completar los trámites necesarios.
                </p>
              </div>
              
              <div>
                <h4 style={{ color: "#4299E1", margin: "0 0 0.75rem 0", fontSize: "1rem", fontWeight: "600" }}>
                  📄 Documentación
                </h4>
                <p style={{ color: "#718096", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
                  No olvides traer tu documento de identidad y carnet de seguro médico si aplica.
                </p>
              </div>
              
              <div>
                <h4 style={{ color: "#2C7A7B", margin: "0 0 0.75rem 0", fontSize: "1rem", fontWeight: "600" }}>
                  🔄 Cancelaciones
                </h4>
                <p style={{ color: "#718096", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Puedes cancelar o reprogramar tu cita con 24 horas de anticipación sin costo alguno.
                </p>
              </div>
            </div>
          </div>
        </div>
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