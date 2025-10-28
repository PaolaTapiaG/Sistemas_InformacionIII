
using Dominio.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface INotificacionRepositorio
    {
        Task<Notificaciones?> ObtenerPorIdAsync(Guid id);
        Task<IEnumerable<Notificaciones>> ListarTodosAsync();
        Task CrearAsync(Notificaciones notificacion);
        Task ActualizarAsync(Notificaciones notificacion);
        Task EliminarAsync(Guid id);
    }
}
