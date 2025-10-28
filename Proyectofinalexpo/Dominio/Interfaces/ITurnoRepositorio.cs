
using Dominio.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface ITurnoRepositorio
    {
        Task<Turnos?> ObtenerPorIdAsync(Guid id);
        Task<IEnumerable<Turnos>> ListarTodosAsync();
        Task CrearAsync(Turnos turno);
        Task ActualizarAsync(Turnos turno);
        Task EliminarAsync(Guid id);
      
        Task<bool> ExisteTurnoEnHorarioAsync(Guid medicoId, DateTime fecha, TimeSpan horaInicio, TimeSpan horaFin);
        Task<bool> ExisteTurnoAsync(Guid turnoId);
        Task<bool> ExisteAsync(Guid turnoId);
    }
}
