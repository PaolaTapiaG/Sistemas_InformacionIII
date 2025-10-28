import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHistorialPorPaciente, type HistorialMedico } from "../../api/historial_medico";
import { Navbar } from "../../components/Navbar";
import { ArrowLeft, ClipboardList, RefreshCw, Calendar, User, Stethoscope, Pill, AlertCircle, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700">
      <Navbar
        brand="MiClínica — Médico"
        userLabel="Historial Médico"
        onLogout={() => navigate("/login")}
        items={[]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-teal-100 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Volver</span>
            </button>

            <button
              onClick={handleActualizar}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white text-teal-600 px-5 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? "Actualizando..." : "Actualizar"}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-white">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <ClipboardList className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1">Historial Médico</h1>
              <p className="text-teal-100 text-lg">Registro completo del paciente</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && !refreshing ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="w-12 h-12 text-teal-600 animate-spin" />
              <p className="text-xl text-gray-700 font-medium">Cargando historial médico...</p>
            </div>
          </div>
        ) : error ? (
          // Error State
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">Error al cargar</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={handleActualizar}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        ) : historial.length === 0 ? (
          // Empty State
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="bg-gray-100 p-8 rounded-full">
                <ClipboardList className="w-20 h-20 text-gray-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay registros</h3>
                <p className="text-gray-600 text-lg mb-6">
                  No se encontraron registros de historial médico para este paciente.
                </p>
                <button
                  onClick={handleActualizar}
                  className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-md"
                >
                  <RefreshCw className="w-5 h-5" />
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 mb-6 shadow-lg border border-white/30">
              <p className="text-white text-lg">
                <span className="font-bold text-2xl">{historial.length}</span> registro{historial.length !== 1 ? 's' : ''} encontrado{historial.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Medical Records Grid */}
            <div className="grid gap-6 mb-8">
              {historial.map((h) => (
                <div
                  key={h.id}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                          <span className="text-white font-mono text-sm font-semibold">
                            ID: {h.id.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(h.turno.fecha).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-6">
                    {/* Diagnóstico */}
                    <div className="group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Diagnóstico</h4>
                      </div>
                      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                        <p className="text-gray-800 leading-relaxed">{h.diagnostico}</p>
                      </div>
                    </div>

                    {/* Tratamiento */}
                    <div className="group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                          <Pill className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Tratamiento</h4>
                      </div>
                      <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                        <p className="text-gray-800 leading-relaxed">{h.tratamiento}</p>
                      </div>
                    </div>

                    {/* Alergias */}
                    <div className="group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-amber-100 p-2 rounded-lg group-hover:bg-amber-200 transition-colors">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">Alergias</h4>
                      </div>
                      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4">
                        <p className="text-gray-800 leading-relaxed">
                          {h.alergias || "No especificadas"}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t-2 border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <User className="w-4 h-4 text-teal-600" />
                            <span className="text-sm">
                              Paciente:{" "}
                              <span className="font-semibold text-gray-900">
                                {h.turno.paciente.usuario.nombreUsuario}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Stethoscope className="w-4 h-4 text-cyan-600" />
                            <span className="text-sm">
                              Médico:{" "}
                              <span className="font-semibold text-gray-900">
                                {h.turno.medico.usuario.nombreUsuario}
                              </span>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/medico/historial/editar/${h.id}`)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar historial
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Update Button */}
            <div className="text-center">
              <button
                onClick={handleActualizar}
                disabled={refreshing}
                className="inline-flex items-center gap-3 bg-white text-teal-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? "Actualizando..." : "Actualizar Lista"}</span>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};