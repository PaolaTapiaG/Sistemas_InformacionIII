using Dominio.Entities;
using Domain.Interfaces;
using Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.Repositories
{
    public class HistorialMedicoRepositorio : IHistorialMedicoRepositorio
    {
        private readonly AppDbContext _context;

        public HistorialMedicoRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Historial_Medico?> ObtenerPorIdAsync(Guid id)
        {
            return await _context.HistorialMedico.FindAsync(id);
        }

        public async Task<IEnumerable<Historial_Medico>> ListarTodosAsync()
        {
            return await _context.HistorialMedico
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        public async Task CrearAsync(Historial_Medico historial)
        {
            await _context.HistorialMedico.AddAsync(historial);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Historial_Medico historial)
        {
            _context.HistorialMedico.Update(historial);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(Guid id)
        {
            var historial = await ObtenerPorIdAsync(id);
            if (historial != null)
            {
                _context.HistorialMedico.Remove(historial);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Historial_Medico>> ObtenerPorPacienteIdAsync(Guid pacienteId)
        {
            return await _context.HistorialMedico
                .Include(h => h.Turno)
                    .ThenInclude(t => t.Paciente)
                        .ThenInclude(p => p.Usuario)
                .Include(h => h.Turno)
                    .ThenInclude(t => t.Medico)
                        .ThenInclude(m => m.Usuario)
                .Where(h => h.Turno.PacienteId == pacienteId)
                .AsNoTracking()
                .ToListAsync();
        }
        public Task<Historial_Medico> ObtenerPorTurnoIdAsync(Guid turnoId)
        {
            throw new NotImplementedException();
        }
    }
}
