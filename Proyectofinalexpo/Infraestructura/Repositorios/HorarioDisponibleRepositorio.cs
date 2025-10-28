using Dominio.Entities;
using Domain.Interfaces;
using Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.Repositories
{
    public class HorarioDisponibleRepositorio : IHorarioDisponibleRepositorio
    {
        private readonly AppDbContext _context;

        public HorarioDisponibleRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Horarios_Disponible?> ObtenerPorIdAsync(Guid id)
        {
            return await _context.HorarioDisponible
                                 .Include(h => h.Medico)
                                 .FirstOrDefaultAsync(h => h.Id == id);
        }

        public async Task<IEnumerable<Horarios_Disponible>> ListarTodosAsync()
        {
            return await _context.HorarioDisponible
                                 .Include(h => h.Medico)
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        public async Task CrearAsync(Horarios_Disponible horario)
        {
            await _context.HorarioDisponible.AddAsync(horario);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Horarios_Disponible horario)
        {
            _context.HorarioDisponible.Update(horario);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(Guid id)
        {
            var horario = await ObtenerPorIdAsync(id);
            if (horario != null)
            {
                _context.HorarioDisponible.Remove(horario);
                await _context.SaveChangesAsync();
            }
        }

        public Task<bool> ExisteHorarioAsync(Guid medicoId, string diaSemana, TimeSpan horaInicio, TimeSpan horaFin)
        {
            throw new NotImplementedException();
        }
    }
}
