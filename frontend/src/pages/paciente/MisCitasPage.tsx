import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getTurnos, type Turno } from "../../api/turnos";
import { getMedicos, type Medico } from "../../api/medicos";
import { CalendarCheck, Clock4, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MisCitasPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreRol");
    navigate("/login");
  };

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loadingMedicos, setLoadingMedicos] = useState(false);
  const [errorMedicos, setErrorMedicos] = useState<string | null>(null);

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
    return turnos
      .filter((t) => t.pacienteId === idPaciente)
      .sort((a, b) => {
        const da = new Date(`${a.fecha.substring(0,10)}T${a.horaInicio}`);
        const db = new Date(`${b.fecha.substring(0,10)}T${b.horaInicio}`);
        return da.getTime() - db.getTime();
      });
  }, [turnos, idPaciente]);

  const medicoMap = useMemo(() => {
    const map = new Map<string, Medico>();
    for (const m of medicos) map.set(m.id, m);
    return map;
  }, [medicos]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
      `}</style>
      <Navbar
        brand="MiClínica — Paciente"
        userLabel="Paciente"
        onLogout={logout}
        items={[
          { to: "/paciente", label: "Inicio", icon: <User size={18} /> },
          { to: "/paciente/mis-citas", label: "Mis citas", icon: <CalendarCheck size={18} /> },
          { to: "/paciente/reservar", label: "Reservar", icon: <Search size={18} /> },
        ]}
      />

      <main style={{ 
        maxWidth: 1000, 
        margin: "0 auto", 
        padding: 40,
        animation: "slideUp 0.8s ease-out"
      }}>
        <section style={{ 
          background: "#fff", 
          borderRadius: 16, 
          padding: 40, 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" 
        }}>
          <h2 style={{ 
            marginTop: 0, 
            fontSize: 36, 
            fontWeight: 800, 
            marginBottom: 24,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Mis Citas Médicas
          </h2>
          {!idPaciente ? (
            <p style={{ 
              color: "#ef4444",
              background: "#fee2e2",
              padding: 16,
              borderRadius: 8,
              fontWeight: 500
            }}>
              No se encontró tu sesión. Por favor, inicia sesión nuevamente.
            </p>
          ) : loading ? (
            <p style={{ 
              fontSize: 18,
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
          ) : turnosPaciente.length === 0 ? (
            <p style={{ 
              fontSize: 18,
              textAlign: "center",
              color: "#6b7280",
              padding: 24
            }}>
              Aún no tienes citas registradas.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {turnosPaciente.map((t) => {
                const fechaStr = t.fecha.substring(0, 10);
                const m = medicoMap.get(t.medicoId);
                const medicoLabel = m?.usuario?.nombreUsuario || t.medicoId;
                const estadoColor = t.estado === "Pendiente" ? "#f59e0b" : t.estado === "Confirmado" ? "#10b981" : "#ef4444";
                return (
                  <div key={t.id} style={{ 
                    border: "2px solid #e5e7eb", 
                    borderRadius: 12, 
                    padding: 20,
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 18, color: "#1f2937" }}>
                      {fechaStr}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#374151", marginBottom: 8 }}>
                      <Clock4 size={18} color="#667eea" />
                      <span style={{ fontWeight: 500 }}>{t.horaInicio} - {t.horaFin}</span>
                    </div>
                    <div style={{ marginTop: 8, color: "#374151" }}>
                      Médico: <strong>{medicoLabel}</strong>
                    </div>
                    <div style={{ 
                      marginTop: 12, 
                      fontSize: 13, 
                      fontWeight: 600,
                      color: estadoColor,
                      padding: "6px 12px",
                      background: `${estadoColor}20`,
                      borderRadius: 6,
                      display: "inline-block"
                    }}>
                      {t.estado}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {loadingMedicos && <p style={{ color: "#6b7280", marginTop: 8 }}>Cargando información de médicos...</p>}
          {errorMedicos && <p style={{ color: "#b00020", marginTop: 8 }}>{errorMedicos}</p>}
        </section>
      </main>
    </div>
  );
};
