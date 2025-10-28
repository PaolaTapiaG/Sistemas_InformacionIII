import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getHorariosDisponibles, 
  createHorarioDisponible, 
  deleteHorarioDisponible,
  type HorarioDisponible 
} from "../../api/horariom";
import { Navbar } from "../../components/Navbar";
import { ArrowLeft, Plus, Trash2, Calendar, RefreshCw } from "lucide-react";

export const HorariosDisponiblesPage = () => {
  const navigate = useNavigate();
  const [horarios, setHorarios] = useState<HorarioDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [creando, setCreando] = useState(false);
  const [medicoId, setMedicoId] = useState<string | null>(null);

  const [nuevoHorario, setNuevoHorario] = useState({
    diaSemana: "",
    horaInicio: "",
    horaFin: "",
    duracionTurno: 30
  });

  // Opciones de días de la semana
  const diasSemana = [
    { value: "Lunes", label: "Lunes" },
    { value: "Martes", label: "Martes" },
    { value: "Miércoles", label: "Miércoles" },
    { value: "Jueves", label: "Jueves" },
    { value: "Viernes", label: "Viernes" },
    { value: "Sábado", label: "Sábado" },
    { value: "Domingo", label: "Domingo" }
  ];

  // Opciones de duración de turno
  const duracionesTurno = [
    { value: 15, label: "15 minutos" },
    { value: 30, label: "30 minutos" },
    { value: 45, label: "45 minutos" },
    { value: 60, label: "1 hora" }
  ];

  // Obtener el médicoId del usuario autenticado
  useEffect(() => {
    const obtenerMedicoId = () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.medicoId) {
            setMedicoId(user.medicoId);
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }
    };

    obtenerMedicoId();
  }, []);

  const cargarHorarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHorariosDisponibles();
      setHorarios(data);
    } catch (err: any) {
      console.error("Error cargando horarios:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.mensaje || 
                          err.response?.data?.error ||
                          "Error al cargar horarios disponibles";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  const handleAgregarHorario = async () => {
    // Validar que tenemos medicoId
    if (!medicoId) {
      setError("No se pudo identificar al médico. Por favor, inicie sesión nuevamente.");
      return;
    }

    // Resto de validaciones
    if (!nuevoHorario.diaSemana || !nuevoHorario.horaInicio || !nuevoHorario.horaFin) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (nuevoHorario.horaInicio >= nuevoHorario.horaFin) {
      setError("La hora de inicio debe ser anterior a la hora de fin");
      return;
    }

    try {
      setCreando(true);
      setError(null);
      
      // Preparar datos con medicoId
      const horarioData = {
        diaSemana: nuevoHorario.diaSemana,
        horaInicio: nuevoHorario.horaInicio,
        horaFin: nuevoHorario.horaFin,
        duracionTurno: nuevoHorario.duracionTurno,
        medicoId: medicoId
      };

      console.log("Enviando datos al servidor:", horarioData);
      
      await createHorarioDisponible(horarioData);
      
      // Limpiar formulario
      setNuevoHorario({
        diaSemana: "",
        horaInicio: "",
        horaFin: "",
        duracionTurno: 30
      });
      
      // Recargar la lista
      await cargarHorarios();
      
    } catch (err: any) {
      console.error("Error detallado al crear horario:", err);
      
      let errorMessage = "Error al crear horario disponible";
      
      if (err.response?.status === 400) {
        errorMessage = "Datos inválidos: " + 
          (err.response?.data?.message || 
           err.response?.data?.mensaje || 
           err.response?.data?.error ||
           "Verifica que los datos sean correctos");
      } else if (err.response?.status === 500) {
        const serverError = err.response?.data;
        errorMessage = "Error del servidor: " + 
          (serverError?.message || 
           serverError?.mensaje || 
           serverError?.error ||
           "Intenta más tarde o contacta al administrador");
        
        console.error("Detalles del error 500:", serverError);
      } else if (err.message === "Network Error") {
        errorMessage = "Error de conexión. Verifica tu internet.";
      }
      
      setError(errorMessage);
    } finally {
      setCreando(false);
    }
  };

  const handleEliminarHorario = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      return;
    }

    try {
      setError(null);
      await deleteHorarioDisponible(id);
      await cargarHorarios();
    } catch (err: any) {
      console.error("Error eliminando horario:", err);
      setError(err.response?.data?.mensaje || "Error al eliminar horario");
    }
  };

  const handleActualizar = async () => {
    setRefreshing(true);
    await cargarHorarios();
  };

  const limpiarError = () => {
    setError(null);
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
        userLabel="Horarios Disponibles"
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
          <Calendar size={32} /> Horarios Disponibles
        </h2>

        {/* Formulario para agregar nuevo horario */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 24,
            marginBottom: 20,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: 16, color: "#374151" }}>Agregar Nuevo Horario</h3>
          
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ color: "#dc2626", margin: 0, fontSize: 14, flex: 1 }}>
                <strong>Error:</strong> {error}
              </p>
              <button
                onClick={limpiarError}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer",
                  marginLeft: 10,
                  fontSize: 14,
                }}
              >
                ×
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                Día de la semana *
              </label>
              <select
                value={nuevoHorario.diaSemana}
                onChange={(e) => {
                  setNuevoHorario({...nuevoHorario, diaSemana: e.target.value});
                  limpiarError();
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14,
                }}
                required
              >
                <option value="">Seleccionar día</option>
                {diasSemana.map((dia) => (
                  <option key={dia.value} value={dia.value}>
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                Hora Inicio *
              </label>
              <input
                type="time"
                value={nuevoHorario.horaInicio}
                onChange={(e) => {
                  setNuevoHorario({...nuevoHorario, horaInicio: e.target.value});
                  limpiarError();
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14,
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                Hora Fin *
              </label>
              <input
                type="time"
                value={nuevoHorario.horaFin}
                onChange={(e) => {
                  setNuevoHorario({...nuevoHorario, horaFin: e.target.value});
                  limpiarError();
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14,
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600 }}>
                Duración turno *
              </label>
              <select
                value={nuevoHorario.duracionTurno}
                onChange={(e) => {
                  setNuevoHorario({...nuevoHorario, duracionTurno: parseInt(e.target.value)});
                  limpiarError();
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14,
                }}
                required
              >
                {duracionesTurno.map((duracion) => (
                  <option key={duracion.value} value={duracion.value}>
                    {duracion.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                onClick={handleAgregarHorario}
                disabled={creando}
                style={{
                  background: creando ? "#6b7280" : "#10b981",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  cursor: creando ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Plus size={16} />
                {creando ? "Creando..." : "Agregar"}
              </button>
            </div>
          </div>
        </div>

        {/* Lista de horarios */}
        {loading && !refreshing ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 40 }}>
            <p style={{ color: "#f3f4f6", fontSize: 18 }}>Cargando horarios disponibles...</p>
          </div>
        ) : horarios.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 40,
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Calendar size={48} style={{ color: "#9ca3af", marginBottom: 16 }} />
            <p style={{ color: "#6b7280", fontSize: 18, marginBottom: 16 }}>
              No hay horarios disponibles registrados.
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
              Actualizar
            </button>
          </div>
        ) : (
          <>
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
                <strong>{horarios.length}</strong> horario(s) disponible(s)
              </p>
            </div>

            {horarios.map((horario) => (
              <div
                key={horario.id}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: 4 }}>
                    {horario.diaSemana}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 4 }}>
                    {horario.horaInicio} - {horario.horaFin}
                  </div>
                  <div style={{ color: "#9ca3af", fontSize: 12 }}>
                    Duración: {horario.duracionTurno} minutos
                  </div>
                </div>

                <button
                  onClick={() => handleEliminarHorario(horario.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            ))}
          </>
        )}

        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </main>
    </div>
  );
};