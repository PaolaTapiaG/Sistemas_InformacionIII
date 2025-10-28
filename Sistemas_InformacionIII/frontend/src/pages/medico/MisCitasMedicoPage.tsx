import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getTurnos, type Turno } from "../../api/turnos";
import { CalendarCheck, Clock4, Users, Stethoscope, Calendar, User, FileText, Bell, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MisCitasMedicoPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreRol");
    localStorage.removeItem("idMedico");
    navigate("/login");
  };

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idMedico = typeof window !== "undefined" ? localStorage.getItem("idMedico") : null;

  useEffect(() => {
    const run = async () => {
      if (!idMedico) return;
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
  }, [idMedico]);

  const turnosMedico = useMemo(() => {
    if (!idMedico) return [] as Turno[];
    return turnos
      .filter((t) => t.medicoId === idMedico)
      .sort((a, b) => {
        const da = new Date(`${a.fecha.substring(0,10)}T${a.horaInicio}`);
        const db = new Date(`${b.fecha.substring(0,10)}T${b.horaInicio}`);
        return da.getTime() - db.getTime();
      });
  }, [turnos, idMedico]);

  // Obtener citas de hoy
  const citasHoy = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0];
    return turnosMedico.filter(t => t.fecha.substring(0,10) === hoy).length;
  }, [turnosMedico]);

  // Obtener citas de esta semana
  const citasSemana = useMemo(() => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const finSemana = new Date(hoy);
    finSemana.setDate(hoy.getDate() + (6 - hoy.getDay()));
    
    return turnosMedico.filter(t => {
      const fechaTurno = new Date(t.fecha.substring(0,10));
      return fechaTurno >= inicioSemana && fechaTurno <= finSemana;
    }).length;
  }, [turnosMedico]);

  // Obtener pacientes activos (únicos)
  const pacientesActivos = useMemo(() => {
    const pacientesIds = new Set(turnosMedico.map(t => t.pacienteId));
    return pacientesIds.size;
  }, [turnosMedico]);

  // Obtener ingresos mensuales (simulado)
  const ingresosMensual = useMemo(() => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    
    const citasMes = turnosMedico.filter(t => {
      const fechaTurno = new Date(t.fecha.substring(0,10));
      return fechaTurno >= inicioMes && fechaTurno <= finMes;
    });
    
    // Suponiendo un costo promedio por consulta
    return citasMes.length * 150; // $150 por consulta
  }, [turnosMedico]);

  // Obtener citas de hoy para la agenda
  const agendaHoy = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0];
    return turnosMedico
      .filter(t => t.fecha.substring(0,10) === hoy)
      .sort((a, b) => {
        const da = new Date(`${a.fecha.substring(0,10)}T${a.horaInicio}`);
        const db = new Date(`${b.fecha.substring(0,10)}T${b.horaInicio}`);
        return da.getTime() - db.getTime();
      });
  }, [turnosMedico]);

  // Función para formatear fecha en español
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
      animation: "fadeIn 0.6s ease-out"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
      `}</style>
      <Navbar
        brand="MiClínica — Médico"
        userLabel="Médico"
        onLogout={logout}
        items={[
          { to: "/medico", label: "Dashboard", icon: <Stethoscope size={18} /> },
          { to: "/medico/mis-citas", label: "Mis citas", icon: <CalendarCheck size={18} /> },
          { to: "/medico/pacientes", label: "Pacientes", icon: <Users size={18} /> },
        ]}
      />

      <main style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "20px",
        animation: "slideUp 0.8s ease-out"
      }}>
        {/* Encabezado de bienvenida */}
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            color: "#1e293b",
            marginBottom: 8
          }}>
            Bienvenido, Doctor
          </h1>
          <p style={{ 
            color: "#64748b",
            fontSize: 16,
            margin: 0
          }}>
            Resumen de tu actividad médica
          </p>
        </div>

        {/* Estadísticas */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: 20,
          marginBottom: 30
        }}>
          <div style={{ 
            background: "#fff", 
            borderRadius: 12, 
            padding: 20, 
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease"
          }} className="card-hover">
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <div style={{ 
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", 
                borderRadius: 8, 
                padding: 8,
                marginRight: 12
              }}>
                <CalendarCheck size={20} color="#fff" />
              </div>
              <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Citas Hoy</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
              {citasHoy}
            </div>
            <div style={{ fontSize: 12, color: "#10b981", fontWeight: 500, display: "flex", alignItems: "center" }}>
              <TrendingUp size={12} style={{ marginRight: 4 }} />
              ~ +12%
            </div>
          </div>

          <div style={{ 
            background: "#fff", 
            borderRadius: 12, 
            padding: 20, 
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease"
          }} className="card-hover">
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <div style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                borderRadius: 8, 
                padding: 8,
                marginRight: 12
              }}>
                <Calendar size={20} color="#fff" />
              </div>
              <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Citas Esta Semana</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
              {citasSemana}
            </div>
            <div style={{ fontSize: 12, color: "#10b981", fontWeight: 500, display: "flex", alignItems: "center" }}>
              <TrendingUp size={12} style={{ marginRight: 4 }} />
              ~ +8%
            </div>
          </div>

          <div style={{ 
            background: "#fff", 
            borderRadius: 12, 
            padding: 20, 
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease"
          }} className="card-hover">
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <div style={{ 
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", 
                borderRadius: 8, 
                padding: 8,
                marginRight: 12
              }}>
                <Users size={20} color="#fff" />
              </div>
              <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Pacientes Activos</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
              {pacientesActivos}
            </div>
            <div style={{ fontSize: 12, color: "#10b981", fontWeight: 500, display: "flex", alignItems: "center" }}>
              <TrendingUp size={12} style={{ marginRight: 4 }} />
              ~ +5%
            </div>
          </div>

          <div style={{ 
            background: "#fff", 
            borderRadius: 12, 
            padding: 20, 
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease"
          }} className="card-hover">
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <div style={{ 
                background: "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)", 
                borderRadius: 8, 
                padding: 8,
                marginRight: 12
              }}>
                <FileText size={20} color="#fff" />
              </div>
              <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Ingresos Mensual</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
              ${ingresosMensual}
            </div>
            <div style={{ fontSize: 12, color: "#10b981", fontWeight: 500, display: "flex", alignItems: "center" }}>
              <TrendingUp size={12} style={{ marginRight: 4 }} />
              ~ +15%
            </div>
          </div>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: 30
        }}>
          {/* Columna izquierda: Acciones rápidas y recordatorios */}
          <div>
            {/* Acciones rápidas */}
            <div style={{ 
              background: "#fff", 
              borderRadius: 12, 
              padding: 24, 
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              marginBottom: 24
            }}>
              <h3 style={{ 
                fontSize: 18, 
                fontWeight: 600, 
                color: "#1e293b",
                marginTop: 0,
                marginBottom: 20
              }}>
                Acciones Rápidas
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: 12,
                  borderRadius: 8,
                  background: "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                >
                  <CalendarCheck size={18} color="#4facfe" style={{ marginRight: 12 }} />
                  <span style={{ fontWeight: 500, color: "#334155" }}>Agenda del Día</span>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: 12,
                  borderRadius: 8,
                  background: "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                >
                  <User size={18} color="#667eea" style={{ marginRight: 12 }} />
                  <span style={{ fontWeight: 500, color: "#334155" }}>Gestión de Pacientes</span>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: 12,
                  borderRadius: 8,
                  background: "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                >
                  <FileText size={18} color="#f093fb" style={{ marginRight: 12 }} />
                  <span style={{ fontWeight: 500, color: "#334155" }}>Reportes Médicos</span>
                </div>
              </div>
            </div>
            
            {/* Recordatorios */}
            <div style={{ 
              background: "#fff", 
              borderRadius: 12, 
              padding: 24, 
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
            }}>
              <h3 style={{ 
                fontSize: 18, 
                fontWeight: 600, 
                color: "#1e293b",
                marginTop: 0,
                marginBottom: 20,
                display: "flex",
                alignItems: "center"
              }}>
                <Bell size={18} style={{ marginRight: 8 }} />
                Recordatorios
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 500, color: "#334155", fontSize: 14 }}>
                    Reunión médica mensual
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Mañana 10:00
                  </div>
                </div>
                
                <div>
                  <div style={{ fontWeight: 500, color: "#334155", fontSize: 14 }}>
                    Renovar licencia médica
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Próxima semana
                  </div>
                </div>
                
                <div>
                  <div style={{ fontWeight: 500, color: "#334155", fontSize: 14 }}>
                    Capacitación nueva tecnología
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    15 Nov
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Columna derecha: Agenda de hoy y consultorio */}
          <div>
            {/* Agenda de hoy */}
            <div style={{ 
              background: "#fff", 
              borderRadius: 12, 
              padding: 24, 
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              marginBottom: 24
            }}>
              <h3 style={{ 
                fontSize: 18, 
                fontWeight: 600, 
                color: "#1e293b",
                marginTop: 0,
                marginBottom: 20
              }}>
                Agenda de Hoy
              </h3>
              
              {agendaHoy.length === 0 ? (
                <p style={{ 
                  textAlign: "center",
                  color: "#64748b",
                  padding: 20,
                  fontSize: 14
                }}>
                  No hay citas programadas para hoy
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {agendaHoy.map((t, index) => (
                    <div key={t.id} style={{ 
                      display: "flex",
                      alignItems: "center",
                      padding: 16,
                      borderRadius: 8,
                      background: index === 0 ? "#f0f9ff" : "#f8fafc",
                      border: index === 0 ? "1px solid #e0f2fe" : "1px solid #f1f5f9"
                    }}>
                      <div style={{ 
                        fontWeight: 600, 
                        color: "#1e293b",
                        minWidth: 60,
                        marginRight: 16,
                        fontSize: 14
                      }}>
                        {t.horaInicio}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: "#334155", fontSize: 14 }}>
                          {/* Mostrar nombre del paciente desde el backend */}
                          {t.pacienteNombre || `Paciente ${t.pacienteId}`}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          Consulta
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: 11, 
                        fontWeight: 600,
                        color: t.estado === "Confirmado" ? "#10b981" : "#f59e0b",
                        padding: "4px 8px",
                        background: t.estado === "Confirmado" ? "#dcfce7" : "#fef3c7",
                        borderRadius: 6
                      }}>
                        {t.estado === "Confirmado" ? "Confirmada" : t.estado}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mi consultorio */}
            <div style={{ 
              background: "#fff", 
              borderRadius: 12, 
              padding: 24, 
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
            }}>
              <h3 style={{ 
                fontSize: 18, 
                fontWeight: 600, 
                color: "#1e293b",
                marginTop: 0,
                marginBottom: 16
              }}>
                Mi Consultorio
              </h3>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center",
                marginBottom: 12
              }}>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 8, 
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12
                }}>
                  <Stethoscope size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "#334155" }}>
                    Consultorio Principal
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Lun-Vie: 8:00 - 18:00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de todas las citas */}
        <section style={{ 
          background: "#fff", 
          borderRadius: 12, 
          padding: 24, 
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          marginTop: 30
        }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: "#1e293b",
            marginTop: 0,
            marginBottom: 20
          }}>
            Todas mis Citas
          </h2>
          
          {!idMedico ? (
            <p style={{ 
              color: "#ef4444",
              background: "#fee2e2",
              padding: 16,
              borderRadius: 8,
              fontWeight: 500
            }}>
              No se encontró tu sesión como médico. Inicia sesión nuevamente.
            </p>
          ) : loading ? (
            <p style={{ 
              fontSize: 16,
              textAlign: "center",
              color: "#6b7280",
              padding: 24
            }}>
              Cargando citas...
            </p>
          ) : error ? (
            <p style={{ 
              color: "#ef4444",
              background: "#fee2e2",
              padding: 16,
              borderRadius: 8,
              fontWeight: 500
            }}>
              {error}
            </p>
          ) : turnosMedico.length === 0 ? (
            <p style={{ 
              fontSize: 16,
              textAlign: "center",
              color: "#6b7280",
              padding: 24
            }}>
              No tienes citas registradas.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {turnosMedico.map((t) => {
                const estadoColor = t.estado === "Pendiente" ? "#f59e0b" : t.estado === "Confirmado" ? "#10b981" : "#ef4444";
                return (
                  <div key={t.id} style={{ 
                    display: "flex",
                    alignItems: "center",
                    padding: 16,
                    borderRadius: 8,
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  >
                    <div style={{ 
                      fontWeight: 600, 
                      color: "#1e293b",
                      minWidth: 100,
                      marginRight: 20,
                      fontSize: 14
                    }}>
                      {t.fecha.substring(0, 10)}
                    </div>
                    <div style={{ 
                      fontWeight: 500, 
                      color: "#374151",
                      minWidth: 80,
                      marginRight: 20,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}>
                      <Clock4 size={14} color="#4facfe" />
                      {t.horaInicio}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: "#334155", fontSize: 14 }}>
                        {/* Mostrar nombre del paciente desde el backend */}
                        {t.pacienteNombre || `Paciente ${t.pacienteId}`}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        Consulta
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      fontWeight: 600,
                      color: estadoColor,
                      padding: "6px 12px",
                      background: `${estadoColor}20`,
                      borderRadius: 6
                    }}>
                      {t.estado}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};