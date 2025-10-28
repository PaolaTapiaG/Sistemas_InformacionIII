using Dominio.Entities;
using Domain.Interfaces;
using Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.Repositories
{
    public class RolRepositorio : IRolRepositorio
    {
        private readonly AppDbContext _context;

        public RolRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Roles?> ObtenerPorIdAsync(Guid id)
        {
            return await _context.Roles.FindAsync(id);
        }

        public async Task<IEnumerable<Roles>> ListarTodosAsync()
        {
            return await _context.Roles.AsNoTracking().ToListAsync();
        }

        public async Task CrearAsync(Roles rol)
        {
            await _context.Roles.AddAsync(rol);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Roles rol)
        {
            _context.Roles.Update(rol);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(Guid id)
        {
            var rol = await ObtenerPorIdAsync(id);
            if (rol != null)
            {
                _context.Roles.Remove(rol);
                await _context.SaveChangesAsync();
            }
        }
    }
}