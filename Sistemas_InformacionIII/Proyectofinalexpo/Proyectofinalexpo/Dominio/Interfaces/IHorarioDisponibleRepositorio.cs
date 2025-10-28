
using Dominio.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IHorarioDisponibleRepositorio
    {
        Task<Horarios_Disponible?> ObtenerPorIdAsync(Guid id);
        Task<IEnumerable<Horarios_Disponible>> ListarTodosAsync();
        Task CrearAsync(Horarios_Disponible horario);
        Task ActualizarAsync(Horarios_Disponible horario);
        Task EliminarAsync(Guid id);
        Task<bool> ExisteHorarioAsync(Guid medicoId, string diaSemana, TimeSpan horaInicio, TimeSpan horaFin);
    }
}
