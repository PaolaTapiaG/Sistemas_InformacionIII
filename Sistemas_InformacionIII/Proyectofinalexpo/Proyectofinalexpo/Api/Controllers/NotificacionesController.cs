using Dominio.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificacionesController : ControllerBase
    {
        private readonly INotificacionRepositorio _notificacionRepositorio;

        public NotificacionesController(INotificacionRepositorio notificacionRepositorio)
        {
            _notificacionRepositorio = notificacionRepositorio;
        }

        // ?? GET: api/Notificaciones
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notificaciones = await _notificacionRepositorio.ListarTodosAsync();
            return Ok(notificaciones);
        }

        // ?? GET: api/Notificaciones/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var notificacion = await _notificacionRepositorio.ObtenerPorIdAsync(id);
            if (notificacion == null)
                return NotFound(new { mensaje = "Notificación no encontrada." });

            return Ok(notificacion);
        }

        // ?? POST: api/Notificaciones
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Notificaciones notificacion)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            notificacion.FechaHoraEnvio = DateTime.Now;

            await _notificacionRepositorio.CrearAsync(notificacion);
            return CreatedAtAction(nameof(GetById), new { id = notificacion.Id }, notificacion);
        }

        // ?? PUT: api/Notificaciones/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Notificaciones notificacion)
        {
            if (id != notificacion.Id)
                return BadRequest("El ID de la notificación no coincide.");

            var existente = await _notificacionRepositorio.ObtenerPorIdAsync(id);
            if (existente == null)
                return NotFound(new { mensaje = "Notificación no encontrada." });

            await _notificacionRepositorio.ActualizarAsync(notificacion);
            return Ok(new { mensaje = "Notificación actualizada correctamente." });
        }

        // ?? DELETE: api/Notificaciones/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var notificacion = await _notificacionRepositorio.ObtenerPorIdAsync(id);
            if (notificacion == null)
                return NotFound(new { mensaje = "Notificación no encontrada." });

            await _notificacionRepositorio.EliminarAsync(id);
            return Ok(new { mensaje = "Notificación eliminada correctamente." });
        }
    }
}
