using Domain.Interfaces;
using Dominio.Entities;
using Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.Repositories
{
    public class PacienteRepositorio : IPacienteRepositorio
    {
        private readonly AppDbContext _context;

        public PacienteRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Pacientes?> ObtenerPorIdAsync(Guid id)
        {
            return await _context.Pacientes
                                 .Include(p => p.Usuario)
                                 .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Pacientes>> ListarTodosAsync()
        {
            return await _context.Pacientes
                                 .Include(p => p.Usuario)
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        public async Task CrearAsync(Pacientes paciente)
        {
            await _context.Pacientes.AddAsync(paciente);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Pacientes paciente)
        {
            _context.Pacientes.Update(paciente);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(Guid id)
        {
            var paciente = await ObtenerPorIdAsync(id);
            if (paciente != null)
            {
                _context.Pacientes.Remove(paciente);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Pacientes?> ObtenerPorUsuarioIdAsync(Guid usuarioId)
        {
            return await _context.Pacientes
                                 .Include(p => p.Usuario)
                                 .FirstOrDefaultAsync(p => p.UsuarioId == usuarioId);
        }
    }
}
