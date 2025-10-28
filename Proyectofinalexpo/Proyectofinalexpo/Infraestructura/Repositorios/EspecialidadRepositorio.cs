using Dominio.Entities;
using Domain.Interfaces;
using Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.Repositories
{
    public class EspecialidadRepositorio : IEspecialidadRepositorio
    {
        private readonly AppDbContext _context;

        public EspecialidadRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Especialidades?> ObtenerPorIdAsync(Guid id)
        {
            return await _context.Especialidades.FindAsync(id);
        }

        public async Task<IEnumerable<Especialidades>> ListarTodosAsync()
        {
            return await _context.Especialidades.AsNoTracking().ToListAsync();
        }

        public async Task CrearAsync(Especialidades especialidad)
        {
            await _context.Especialidades.AddAsync(especialidad);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Especialidades especialidad)
        {
            _context.Especialidades.Update(especialidad);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(Guid id)
        {
            var especialidad = await ObtenerPorIdAsync(id);
            if (especialidad != null)
            {
                _context.Especialidades.Remove(especialidad);
                await _context.SaveChangesAsync();
            }
        }

        public Task<Especialidades?> ObtenerPorIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task EliminarAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}