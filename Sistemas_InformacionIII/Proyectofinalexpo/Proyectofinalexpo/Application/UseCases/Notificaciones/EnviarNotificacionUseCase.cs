using Domain.Interfaces;
using Dominio.Entities;
using System;
using System.Threading.Tasks;

namespace Application.UseCases.EnviarNotificaciones
{
    public class EnviarNotificacion
    {
        private readonly INotificacionRepositorio _notificacionRepositorio;
        private readonly ITurnoRepositorio _turnoRepositorio;

        public EnviarNotificacion(INotificacionRepositorio notificacionRepositorio, ITurnoRepositorio turnoRepositorio)
        {
            _notificacionRepositorio = notificacionRepositorio;
            _turnoRepositorio = turnoRepositorio;
        }

        // ✅ CORREGIDO: Usar Notificaciones en lugar de Not
        public async Task EjecutarAsync(Notificaciones notificacion)
        {
            // Validaciones de negocio
            ValidarNotificacion(notificacion);

            // Validar que el turno exista
            var turnoExiste = await _turnoRepositorio.ObtenerPorIdAsync(notificacion.TurnoId);
            if (turnoExiste == null)
                throw new ArgumentException($"El turno con ID {notificacion.TurnoId} no existe.");

            // Asignar fecha/hora actual si no viene especificada
            if (notificacion.FechaHoraEnvio == default)
            {
                notificacion.FechaHoraEnvio = DateTime.Now;
            }

            // Generar ID si no viene especificado
            if (notificacion.Id == Guid.Empty)
            {
                notificacion.Id = Guid.NewGuid();
            }

            await _notificacionRepositorio.CrearAsync(notificacion);
        }

        private void ValidarNotificacion(Notificaciones notificacion)
        {
            if (notificacion.TurnoId == Guid.Empty)
                throw new ArgumentException("El ID del turno es obligatorio");

            if (string.IsNullOrWhiteSpace(notificacion.DestinatarioCorreo))
                throw new ArgumentException("El correo del destinatario es obligatorio");

            if (!notificacion.DestinatarioCorreo.Contains("@"))
                throw new ArgumentException("El correo del destinatario no es válido");

            if (string.IsNullOrWhiteSpace(notificacion.Asunto))
                throw new ArgumentException("El asunto de la notificación es obligatorio");

            if (string.IsNullOrWhiteSpace(notificacion.Mensaje))
                throw new ArgumentException("El mensaje de la notificación es obligatorio");
        }
    }
}