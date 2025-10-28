import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { getTurnos, type Turno } from "../../api/turnos";
import { getPacientes, type Paciente } from "../../api/pacientes";
import { Users, CalendarCheck, Stethoscope, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MisPacientesMedicoPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreRol");
    localStorage.removeItem("idMedico");
    navigate("/login");
  };

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idMedico =
    typeof window !== "undefined" ? localStorage.getItem("idMedico") : null;

  useEffect(() => {
    const run = async () => {
      if (!idMedico) return;
      try {
        setError(null);
        setLoading(true);
        const [turnosData, pacientesData] = await Promise.all([
          getTurnos(),
          getPacientes(),
        ]);
        setTurnos(turnosData);
        setPacientes(pacientesData);
      } catch (e: any) {
        setError(e?.message || "Error al cargar los pacientes.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [idMedico]);

  // Filtrar pacientes que tienen una cita con el médico actual
  const pacientesDelMedico = useMemo(() => {
    if (!idMedico) return [] as Paciente[];

    const idsPacientes = new Set(
      turnos.filter((t) => t.medicoId === idMedico).map((t) => t.pacienteId)
    );

    return pacientes.filter((p) => idsPacientes.has(p.id));
  }, [turnos, pacientes, idMedico]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        animation: "fadeIn 0.6s ease-out",
      }}
    >
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
        brand="MiClínica — Médico"
        userLabel="Médico"
        onLogout={logout}
        items={[
          { to: "/medico", label: "Dashboard", icon: <Stethoscope size={18} /> },
          { to: "/medico/mis-citas", label: "Mis citas", icon: <CalendarCheck size={18} /> },
          { to: "/medico/pacientes", label: "Pacientes", icon: <Users size={18} /> },
        ]}
      />

      <main
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: 40,
          animation: "slideUp 0.8s ease-out",
        }}
      >
        <section
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 40,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: 36,
              fontWeight: 800,
              marginBottom: 24,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Mis Pacientes
          </h2>

          {!idMedico ? (
            <p
              style={{
                color: "#ef4444",
                background: "#fee2e2",
                padding: 16,
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              No se encontró tu sesión como médico. Inicia sesión nuevamente.
            </p>
          ) : loading ? (
            <p
              style={{
                fontSize: 18,
                textAlign: "center",
                color: "#6b7280",
                padding: 24,
              }}
            >
              Cargando pacientes...
            </p>
          ) : error ? (
            <p
              style={{
                color: "#ef4444",
                background: "#fee2e2",
                padding: 16,
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              {error}
            </p>
          ) : pacientesDelMedico.length === 0 ? (
            <p
              style={{
                fontSize: 18,
                textAlign: "center",
                color: "#6b7280",
                padding: 24,
              }}
            >
              No tienes pacientes con citas registradas aún.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {pacientesDelMedico.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "2px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 20,
                    background:
                      "linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <UserCircle color="#4facfe" size={28} />
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 18,
                          color: "#1f2937",
                        }}
                      >
                        {p.usuario?.nombreUsuario || "Sin nombre"}
                      </div>
                      <div style={{ fontSize: 13, color: "#4b5563" }}>
                        Cédula: {p.cedula}
                      </div>
                    </div>
                  </div>

                  {p.usuario?.email && (
                    <div style={{ fontSize: 14, color: "#6b7280" }}>
                      ✉️ {p.usuario.email}
                    </div>
                  )}
                  {p.usuario?.telefono && (
                    <div style={{ fontSize: 14, color: "#6b7280" }}>
                      📞 {p.usuario.telefono}
                    </div>
                  )}

                  {/* 👇 Botón Ver Historial Médico */}
                  <button
                    style={{
                      marginTop: 12,
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontWeight: 600,
                      width: "100%",
                      transition: "0.3s",
                    }}
                    onClick={() => navigate(`/medico/historial/${p.id}`)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#2563eb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#3b82f6")
                    }
                  >
                    📋 Ver historial médico
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
