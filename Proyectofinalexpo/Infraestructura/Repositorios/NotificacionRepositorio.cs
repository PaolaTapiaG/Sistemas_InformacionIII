using Dominio.Entities;
using Domain.Interfaces;
using Dominio.Entities;
using Infraestructura.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.Repositories
{
    public class NotificacionRepositorio : INotificacionRepositorio
    {
        private readonly AppDbContext _context;

        public NotificacionRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Notificaciones?> ObtenerPorIdAsync(Guid id)
        {
            return await _context.Notificaciones.FindAsync(id);
        }

        public async Task<IEnumerable<Notificaciones>> ListarTodosAsync()
        {
            return await _context.Notificaciones.AsNoTracking().ToListAsync();
        }

        public async Task CrearAsync(Notificaciones notificacion)
        {
            await _context.Notificaciones.AddAsync(notificacion);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Notificaciones notificacion)
        {
            _context.Notificaciones.Update(notificacion);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync( Guid id)
        {
            var notificacion = await ObtenerPorIdAsync(id);
            if (notificacion != null)
            {
                _context.Notificaciones.Remove(notificacion);
                await _context.SaveChangesAsync();
            }
        }

        Task<IEnumerable<Notificaciones>> INotificacionRepositorio.ListarTodosAsync()
        {
            throw new NotImplementedException();
        }

       
    }
}