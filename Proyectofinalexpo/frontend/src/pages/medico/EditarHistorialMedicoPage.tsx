// src/pages/medico/EditarHistorialMedicoPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  getHistorialById, 
  updateHistorialMedico, 
  type HistorialMedico,
  type CreateHistorialMedicoDTO 
} from "../../api/historial_medico";
import { Navbar } from "../../components/Navbar";
import { ArrowLeft, Save, ClipboardList } from "lucide-react";

export const EditarHistorialMedicoPage = () => {
  const { historialId } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState<HistorialMedico | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateHistorialMedicoDTO>({
    turnoId: '',
    diagnostico: '',
    tratamiento: '',
    alergias: ''
  });

  // Cargar el historial médico al iniciar
  useEffect(() => {
    const cargarHistorial = async () => {
      if (!historialId) {
        setError("ID de historial no proporcionado");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await getHistorialById(historialId);
        setHistorial(data);
        setFormData({
          turnoId: data.turnoId,
          diagnostico: data.diagnostico,
          tratamiento: data.tratamiento,
          alergias: data.alergias
        });
      } catch (err: any) {
        console.error("Error cargando historial:", err);
        setError(err.response?.data?.mensaje || "Error al cargar historial médico");
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [historialId]);

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!historialId) return;

    try {
      setSaving(true);
      setError(null);
      
      await updateHistorialMedico(historialId, formData);
      
      // Redirigir de vuelta a la página anterior
      navigate(-1);
      
    } catch (err: any) {
      console.error("Error actualizando historial:", err);
      setError(err.response?.data?.mensaje || "Error al actualizar historial médico");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#1f2937",
      }}>
        <Navbar
          brand="MiClínica — Médico"
          userLabel="Editar Historial Médico"
          onLogout={() => navigate("/login")}
          items={[]}
        />
        <main style={{ maxWidth: 800, margin: "0 auto", padding: 40, textAlign: 'center' }}>
          <p style={{ color: "#f3f4f6" }}>Cargando historial médico...</p>
        </main>
      </div>
    );
  }

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
        userLabel="Editar Historial Médico"
        onLogout={() => navigate("/login")}
        items={[]}
      />

      <main style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button
            onClick={handleCancelar}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: 16,
              cursor: "pointer",
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ArrowLeft size={18} />
          </button>
          
          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "white",
              margin: 0
            }}
          >
            <ClipboardList size={32} /> Editar Historial Médico
          </h2>
        </div>

        {/* Información del historial */}
        {historial && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ color: "white", margin: 0, fontSize: 14 }}>
              <strong>ID del Historial:</strong> {historial.id}
            </p>
            <p style={{ color: "white", margin: '4px 0 0 0', fontSize: 14 }}>
              <strong>Paciente:</strong> {historial.turno.paciente.usuario.nombreUsuario}
            </p>
            <p style={{ color: "white", margin: '4px 0 0 0', fontSize: 14 }}>
              <strong>Fecha:</strong> {new Date(historial.turno.fecha).toLocaleDateString('es-ES')}
            </p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: 8, 
            padding: 16,
            marginBottom: 24
          }}>
            <p style={{ color: "#dc2626", margin: 0 }}>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Formulario de edición */}
        <div style={{
          background: "white",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}>
          <form onSubmit={handleGuardar}>
            {/* Campo Diagnóstico */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                fontWeight: 600,
                color: '#374151',
                fontSize: 16
              }}>
                Diagnóstico:
              </label>
              <textarea
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Ingrese el diagnóstico del paciente..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 16,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Campo Tratamiento */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                fontWeight: 600,
                color: '#374151',
                fontSize: 16
              }}>
                Tratamiento:
              </label>
              <textarea
                name="tratamiento"
                value={formData.tratamiento}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describa el tratamiento recomendado..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 16,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Campo Alergias */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                fontWeight: 600,
                color: '#374151',
                fontSize: 16
              }}>
                Alergias:
              </label>
              <input
                type="text"
                name="alergias"
                value={formData.alergias}
                onChange={handleInputChange}
                placeholder="Liste las alergias del paciente (opcional)..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 16,
                  fontFamily: 'inherit',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f59e0b';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
              />
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4, marginBottom: 0 }}>
                Deje en blanco si no hay alergias conocidas
              </p>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCancelar}
                disabled={saving}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 8,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 16,
                  opacity: saving ? 0.7 : 1,
                  minWidth: 120
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: saving ? "#6b7280" : "#10b981",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 8,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: saving ? 0.7 : 1,
                  minWidth: 120,
                  justifyContent: 'center'
                }}
              >
                <Save size={18} />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>

        {/* Información adicional */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
          padding: 16,
          marginTop: 24,
        }}>
          <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: 0, fontSize: 14, textAlign: 'center' }}>
            <strong>Nota:</strong> Los cambios se guardarán permanentemente en el historial médico del paciente.
          </p>
        </div>
      </main>
    </div>
  );
};