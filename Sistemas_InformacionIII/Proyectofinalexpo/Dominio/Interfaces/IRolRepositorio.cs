using System.Collections.Generic;
using System.Threading.Tasks;
using Dominio.Entities;

namespace Domain.Interfaces
{
    public interface IRolRepositorio
    {
        Task<Roles?> ObtenerPorIdAsync(Guid id);
        Task<IEnumerable<Roles>> ListarTodosAsync();
        Task CrearAsync(Roles rol);
        Task ActualizarAsync(Roles rol);
        Task EliminarAsync(Guid id);
    }
}
