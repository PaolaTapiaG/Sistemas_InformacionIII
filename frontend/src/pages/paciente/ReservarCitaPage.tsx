import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getEspecialidades, type Especialidad } from "../../api/especialidades";
import { getMedicos, type Medico } from "../../api/medicos";
import { getHorariosDisponibles, type HorarioDisponible } from "../../api/horarios";
import { postTurno, getTurnos, type Turno } from "../../api/turnos";
import { CalendarClock, Search, User } from "lucide-react";
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
  const [fecha, setFecha] = useState<string>(""); // YYYY-MM-DD
  const [reservando, setReservando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

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
      } catch (e: any) {
        setMedicosError(e?.message || "Error al cargar médicos");
      } finally {
        setMedicosLoading(false);
      }
    };
    run();
  }, [especialidadId]);

  // Cuando el usuario elija un médico, cargar horarios
  useEffect(() => {
    if (!medicoId) return;
    const run = async () => {
      try {
        setHorariosError(null);
        setHorariosLoading(true);
        const data = await getHorariosDisponibles();
        setHorarios(data);
      } catch (e: any) {
        setHorariosError(e?.message || "Error al cargar horarios");
      } finally {
        setHorariosLoading(false);
      }
    };
    run();
  }, [medicoId]);

  // Cargar turnos existentes al cambiar médico y fecha
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

  // Utilidades de día/normalización
  const normalize = (s: string) => s.normalize?.("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || s.toLowerCase();
  const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]; // sin acentos para comparar

  const medicosFiltrados = useMemo(() => {
    if (!especialidadId) return [] as Medico[];
    return medicos.filter((m) => m.especialidadId === especialidadId);
  }, [medicos, especialidadId]);

  const horariosFiltrados = useMemo(() => {
    if (!medicoId) return [] as HorarioDisponible[];
    return horarios.filter((h) => h.medicoId === medicoId);
  }, [horarios, medicoId]);

  // Filtrar por el día de la semana según la fecha seleccionada
  const dayNameFromFecha = useMemo(() => {
    if (!fecha) return null as string | null;
    const d = new Date(`${fecha}T00:00:00`);
    return dias[d.getDay()];
  }, [fecha, dias]);

  const horariosPorDia = useMemo(() => {
    if (!dayNameFromFecha) return [] as HorarioDisponible[];
    return horariosFiltrados.filter((h) => normalize(h.diaSemana) === dayNameFromFecha);
  }, [horariosFiltrados, dayNameFromFecha]);

  // Filtra horarios ocupados según turnos existentes del médico para la fecha seleccionada
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
    // Validar que el día de la semana coincida con el horario
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
      alert("Turno reservado con éxito.");
      setMensaje("Turno reservado con éxito.");
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Error al reservar el turno";
      alert(msg);
      setMensaje(msg);
    } finally {
      setReservando(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
      <Navbar
        brand="MiClínica — Paciente"
        userLabel="Paciente"
        onLogout={logout}
        items={[
          { to: "/paciente", label: "Inicio", icon: <User size={18} /> },
          { to: "/paciente/mis-citas", label: "Mis citas", icon: <CalendarClock size={18} /> },
          { to: "/paciente/reservar", label: "Reservar", icon: <Search size={18} /> },
        ]}
      />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <section style={{ display: "grid", gap: 20 }}>
          {/* Paso 1: Especialidad */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ marginTop: 0, color: "#1f2937", fontSize: 20, fontWeight: 600 }}>1. Selecciona una especialidad</h3>
            {especialidadesLoading ? (
              <p>Cargando especialidades...</p>
            ) : especialidadesError ? (
              <p style={{ color: "#b00020" }}>{especialidadesError}</p>
            ) : (
              <select
                value={especialidadId}
                onChange={(e) => {
                  setEspecialidadId(e.target.value);
                  setMedicoId("");
                  setHorarios([]);
                }}
                style={{ padding: 10, borderRadius: 8, border: "2px solid #e5e7eb", minWidth: 260, fontSize: 14, outline: "none", transition: "all 0.3s ease" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
              >
                <option value="">-- Selecciona --</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Paso 2: Médicos */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ marginTop: 0, color: "#1f2937", fontSize: 20, fontWeight: 600 }}>2. Elige un médico</h3>
            {!especialidadId ? (
              <p style={{ color: "#6b7280" }}>Selecciona una especialidad para ver médicos.</p>
            ) : medicosLoading ? (
              <p>Cargando médicos...</p>
            ) : medicosError ? (
              <p style={{ color: "#b00020" }}>{medicosError}</p>
            ) : medicosFiltrados.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No hay médicos para esta especialidad.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                {medicosFiltrados.map((m) => (
                  <div key={m.id} style={{ 
                    border: m.id === medicoId ? "2px solid #667eea" : "2px solid #e5e7eb", 
                    borderRadius: 12, 
                    padding: 16,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    background: m.id === medicoId ? "rgba(102, 126, 234, 0.05)" : "#fff"
                  }}
                  onClick={() => setMedicoId(m.id)}
                  onMouseEnter={(e) => {
                    if (m.id !== medicoId) {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (m.id !== medicoId) {
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                  >
                    <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: 4 }}>
                      {m.usuario?.nombreUsuario || "Médico"}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: 14 }}>
                      {m.especialidad?.nombre || "Especialidad"}
                    </div>
                    {m.id === medicoId && (
                      <div style={{ marginTop: 8, color: "#667eea", fontSize: 12, fontWeight: 600 }}>✓ Seleccionado</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paso 3: Horarios */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ marginTop: 0, color: "#1f2937", fontSize: 20, fontWeight: 600 }}>3. Selecciona una fecha y un horario</h3>
            {!medicoId ? (
              <p style={{ color: "#6b7280" }}>Elige un médico para ver sus horarios disponibles.</p>
            ) : horariosLoading ? (
              <p>Cargando horarios...</p>
            ) : horariosError ? (
              <p style={{ color: "#b00020" }}>{horariosError}</p>
            ) : turnosLoading ? (
              <p>Cargando turnos existentes...</p>
            ) : turnosError ? (
              <p style={{ color: "#b00020" }}>{turnosError}</p>
            ) : horariosFiltrados.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No hay horarios disponibles para este médico.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <label style={{ display: "inline-flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>Fecha</span>
                    <input
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      style={{ padding: 10, borderRadius: 8, border: "2px solid #e5e7eb", minWidth: 240, fontSize: 14, outline: "none", transition: "all 0.3s ease" }}
                      disabled={reservando}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
                    />
                  </label>
                </div>

                {!fecha ? (
                  <p style={{ color: "#6b7280" }}>Selecciona una fecha para ver los horarios de ese día.</p>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                    {horariosDisponiblesFinal.map((h) => (
                      <div key={h.id} style={{ 
                        border: "2px solid #e5e7eb", 
                        borderRadius: 12, 
                        padding: 16,
                        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#667eea";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <CalendarClock size={18} color="#667eea" />
                          <strong style={{ color: "#1f2937" }}>{h.diaSemana}</strong>
                        </div>
                        <div style={{ marginTop: 6, color: "#374151", fontSize: 16, fontWeight: 500 }}>
                          {h.horaInicio} - {h.horaFin}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>Duración: {h.duracionTurno} min</div>
                        <div style={{ marginTop: 12 }}>
                          <button
                            onClick={() => reservar(h)}
                            disabled={reservando}
                            style={{ 
                              width: "100%",
                              padding: "10px 12px", 
                              borderRadius: 8, 
                              border: "none", 
                              background: reservando ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                              color: "white",
                              fontWeight: 600,
                              cursor: reservando ? "not-allowed" : "pointer",
                              transition: "all 0.3s ease",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }}
                            onMouseEnter={(e) => {
                              if (!reservando) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                            }}
                          >
                            {reservando ? "Reservando..." : "Reservar cita"}
                          </button>
                        </div>
                      </div>
                    ))}
                    {horariosDisponiblesFinal.length === 0 && (
                      <p style={{ color: "#6b7280" }}>No hay horarios para el día seleccionado.</p>
                    )}
                  </div>
                )}
                {mensaje && <div style={{ color: "#065f46", background: "#d1fae5", border: "1px solid #34d399", padding: 12, borderRadius: 8, marginTop: 12 }}>{mensaje}</div>}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
