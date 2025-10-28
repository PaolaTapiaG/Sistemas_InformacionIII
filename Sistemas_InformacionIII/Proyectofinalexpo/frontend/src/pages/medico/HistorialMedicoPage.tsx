import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHistorialPorPaciente, type HistorialMedico } from "../../api/historial_medico";
import { Navbar } from "../../components/Navbar";
import { ArrowLeft, ClipboardList, RefreshCw } from "lucide-react";

export const HistorialMedicoPage = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState<HistorialMedico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const cargarHistorial = async () => {
    if (!pacienteId) {
      setError("ID de paciente no proporcionado");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Cargando historial para paciente:", pacienteId);
      const data = await getHistorialPorPaciente(pacienteId);
      console.log("Datos recibidos:", data);
      setHistorial(data);
    } catch (err: any) {
      console.error("Error cargando historial:", err);
      setError(err.response?.data?.mensaje || "Error al cargar historial médico");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, [pacienteId]);

  const handleActualizar = async () => {
    setRefreshing(true);
    await cargarHistorial();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#1f2937",
      }}
    >
      <Navbar
        brand="MiClínica — Médico"
        userLabel="Historial Médico"
        onLogout={() => navigate("/login")}
        items={[]}
      />

      <main style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
        {/* Botones superiores */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ArrowLeft size={18} /> Volver
          </button>

          <button
            onClick={handleActualizar}
            disabled={refreshing}
            style={{
              background: refreshing ? "#6b7280" : "#3b82f6",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: 8,
              cursor: refreshing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              fontSize: 14,
              opacity: refreshing ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
          >
            <RefreshCw
              size={18}
              style={{
                animation: refreshing ? "spin 1s linear infinite" : "none",
              }}
            />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "white",
            marginBottom: 20,
          }}
        >
          <ClipboardList size={32} /> Historial Médico
        </h2>

        {/* Animación de recarga */}
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>

        {/* Casos de carga / error / sin datos */}
        {loading && !refreshing ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
            }}
          >
            <p style={{ color: "#f3f4f6", fontSize: 18 }}>
              Cargando historial médico...
            </p>
          </div>
        ) : error ? (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <p style={{ color: "#dc2626", margin: 0 }}>
              <strong>Error:</strong> {error}
            </p>
            <button
              onClick={handleActualizar}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: 6,
                cursor: "pointer",
                marginTop: 12,
                fontSize: 14,
              }}
            >
              Reintentar
            </button>
          </div>
        ) : historial.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 40,
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <ClipboardList
              size={48}
              style={{ color: "#9ca3af", marginBottom: 16 }}
            />
            <p style={{ color: "#6b7280", fontSize: 18, marginBottom: 16 }}>
              No hay registros de historial médico para este paciente.
            </p>
            <button
              onClick={handleActualizar}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <RefreshCw size={16} style={{ marginRight: 8 }} />
              Actualizar
            </button>
          </div>
        ) : (
          <>
            {/* Conteo */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 20,
                backdropFilter: "blur(10px)",
              }}
            >
              <p style={{ color: "white", margin: 0, fontSize: 14 }}>
                <strong>{historial.length}</strong> registro(s) de historial
                médico encontrado(s)
              </p>
            </div>

            {/* Lista de historiales */}
            {historial.map((h) => (
              <div
                key={h.id}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 24,
                  marginTop: 16,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(0,0,0,0.1)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 700,
                      margin: 0,
                      color: "#1f2937",
                      fontSize: 14,
                      background: "#f3f4f6",
                      padding: "4px 12px",
                      borderRadius: 20,
                    }}
                  >
                    ID: {h.id.substring(0, 8)}...
                  </h3>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      background: "#f3f4f6",
                      padding: "4px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {new Date(h.turno.fecha).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <h4
                    style={{
                      fontWeight: 600,
                      marginBottom: 8,
                      color: "#374151",
                      fontSize: 14,
                    }}
                  >
                    Diagnóstico:
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "#1f2937",
                      background: "#f8fafc",
                      padding: 12,
                      borderRadius: 6,
                      borderLeft: "4px solid #3b82f6",
                    }}
                  >
                    {h.diagnostico}
                  </p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <h4
                    style={{
                      fontWeight: 600,
                      marginBottom: 8,
                      color: "#374151",
                      fontSize: 14,
                    }}
                  >
                    Tratamiento:
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "#1f2937",
                      background: "#f8fafc",
                      padding: 12,
                      borderRadius: 6,
                      borderLeft: "4px solid #10b981",
                    }}
                  >
                    {h.tratamiento}
                  </p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <h4
                    style={{
                      fontWeight: 600,
                      marginBottom: 8,
                      color: "#374151",
                      fontSize: 14,
                    }}
                  >
                    Alergias:
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "#1f2937",
                      background: "#f8fafc",
                      padding: 12,
                      borderRadius: 6,
                      borderLeft: "4px solid #f59e0b",
                    }}
                  >
                    {h.alergias || "No especificadas"}
                  </p>
                </div>

                {/* Paciente y Médico */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    <div>
                      Paciente:{" "}
                      <strong>{h.turno.paciente.usuario.nombreUsuario}</strong>
                    </div>
                    <div>
                      Médico:{" "}
                      <strong>{h.turno.medico.usuario.nombreUsuario}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/medico/historial/editar/${h.id}`)
                    }
                    style={{
                      background: "transparent",
                      color: "#3b82f6",
                      border: "1px solid #3b82f6",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    ✏️ Editar historial
                  </button>
                </div>
              </div>
            ))}

            {/* Botón de actualizar lista */}
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button
                onClick={handleActualizar}
                disabled={refreshing}
                style={{
                  background: refreshing ? "#6b7280" : "#8b5cf6",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 8,
                  cursor: refreshing ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 16,
                  opacity: refreshing ? 0.7 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                <RefreshCw
                  size={18}
                  style={{
                    animation: refreshing ? "spin 1s linear infinite" : "none",
                  }}
                />
                {refreshing ? "Actualizando..." : "Actualizar Lista"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
