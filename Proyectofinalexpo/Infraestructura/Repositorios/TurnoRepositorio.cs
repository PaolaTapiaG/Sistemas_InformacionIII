using Domain.Interfaces;
using Dominio.Entities;
using Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.Repositories
{
    public class TurnoRepositorio : ITurnoRepositorio
    {
        private readonly AppDbContext _context;

        public TurnoRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Turnos?> ObtenerPorIdAsync(Guid id)
        {
            return await _context.Turnos.FindAsync(id);
        }

        public async Task<IEnumerable<Turnos>> ListarTodosAsync()
        {
            return await _context.Turnos.AsNoTracking().ToListAsync();
        }

        public async Task CrearAsync(Turnos turno)
        {
            await _context.Turnos.AddAsync(turno);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Turnos turno)
        {
            _context.Turnos.Update(turno);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(Guid id)
        {
            var turno = await ObtenerPorIdAsync(id);
            if (turno != null)
            {
                _context.Turnos.Remove(turno);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExisteTurnoEnHorarioAsync(Guid medicoId, DateTime fecha, TimeSpan horaInicio, TimeSpan horaFin)
        {
            return await _context.Turnos.AnyAsync(t =>
                t.MedicoId == medicoId &&
                t.Fecha.Date == fecha.Date && // compara solo la fecha
                (
                    // solapamiento de horarios
                    (horaInicio >= t.HoraInicio && horaInicio < t.HoraFin) ||
                    (horaFin > t.HoraInicio && horaFin <= t.HoraFin) ||
                    (horaInicio <= t.HoraInicio && horaFin >= t.HoraFin)
                )
            );
        }


        public Task<bool> ExisteTurnoAsync(Guid turnoId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ExisteAsync(Guid turnoId)
        {
            throw new NotImplementedException();
        }
    }
}