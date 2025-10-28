
using Dominio.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IHistorialMedicoRepositorio
    {
        Task<Historial_Medico?> ObtenerPorIdAsync(Guid id);
        Task<IEnumerable<Historial_Medico>> ListarTodosAsync();
        Task<IEnumerable<Historial_Medico>> ObtenerPorPacienteIdAsync(Guid pacienteId);
        Task CrearAsync(Historial_Medico historial);
        Task ActualizarAsync(Historial_Medico historial);
        Task EliminarAsync(Guid id);
        Task<Historial_Medico> ObtenerPorTurnoIdAsync(Guid turnoId);
    }
}
