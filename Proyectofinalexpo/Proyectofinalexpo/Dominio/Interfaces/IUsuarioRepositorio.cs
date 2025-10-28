using Dominio.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IUsuarioRepositorio
    {
        Task<Usuarios?> ObtenerPorIdAsync(Guid id);
        Task<IEnumerable<Usuarios>> ListarTodosAsync();
        Task CrearAsync(Usuarios usuario);
        Task ActualizarAsync(Usuarios usuario);
        Task EliminarAsync(Guid id);

        // 🔹 Métodos que el AuthController necesita
        Task<Usuarios?> ObtenerPorNombre(string nombreUsuario);
        Task<Usuarios?> ObtenerPorNombreUsuarioAsync(string nombreUsuario);
    }
}
