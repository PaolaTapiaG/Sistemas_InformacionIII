using Dominio.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IEspecialidadRepositorio
    {
        Task<Especialidades?> ObtenerPorIdAsync(Guid id);
        Task<IEnumerable<Especialidades>> ListarTodosAsync();
        Task CrearAsync(Especialidades especialidad);
        Task ActualizarAsync(Especialidades especialidad);
        Task EliminarAsync( Guid id);
    }
}
