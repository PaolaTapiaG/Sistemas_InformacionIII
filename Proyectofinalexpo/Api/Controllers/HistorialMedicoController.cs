using Dominio.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Application.DTOs;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Infraestructura.Data;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistorialMedicoController : ControllerBase
    {
        private readonly IHistorialMedicoRepositorio _historialRepositorio;
        private readonly AppDbContext _context;

        public HistorialMedicoController(IHistorialMedicoRepositorio historialRepositorio, AppDbContext context)
        {
            _historialRepositorio = historialRepositorio;
            _context = context;
        }

        // ✅ GET: api/HistorialMedico (TODOS los historiales)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var historiales = await _historialRepositorio.ListarTodosAsync();

                var historialesDto = historiales.Select(h => new
                {
                    id = h.Id,
                    turnoId = h.TurnoId,
                    diagnostico = h.Diagnostico ?? "",
                    tratamiento = h.Tratamiento ?? "",
                    alergias = h.Alergias ?? "",
                    turno = h.Turno != null ? new
                    {
                        id = h.Turno.Id,
                        fecha = h.Turno.Fecha,
                        paciente = h.Turno.Paciente != null ? new
                        {
                            id = h.Turno.Paciente.Id,
                            nombre = h.Turno.Paciente.Usuario.NombreUsuario ?? ""
                        } : null,
                        medico = h.Turno.Medico != null ? new
                        {
                            id = h.Turno.Medico.Id,
                            nombre = h.Turno.Medico.Usuario.NombreUsuario ?? ""
                        } : null
                    } : null
                });

                return Ok(historialesDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener historiales", error = ex.Message });
            }
        }

        // ✅ GET: api/HistorialMedico/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var historial = await _historialRepositorio.ObtenerPorIdAsync(id);
                if (historial == null)
                    return NotFound(new { mensaje = "Historial no encontrado" });

                var historialDto = new
                {
                    id = historial.Id,
                    turnoId = historial.TurnoId,
                    diagnostico = historial.Diagnostico,
                    tratamiento = historial.Tratamiento,
                    alergias = historial.Alergias
                };

                return Ok(historialDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener historial", error = ex.Message });
            }
        }

        
        [HttpGet("paciente/{pacienteId}")]
        public async Task<IActionResult> GetByPacienteId(Guid pacienteId)
        {
            try
            {
                var historiales = await _historialRepositorio.ObtenerPorPacienteIdAsync(pacienteId);

                if (historiales == null || !historiales.Any())
                    return Ok(new List<object>());

                var historialesDto = historiales.Select(h => new
                {
                    id = h.Id,
                    turnoId = h.TurnoId,
                    diagnostico = h.Diagnostico ?? "",
                    tratamiento = h.Tratamiento ?? "",
                    alergias = h.Alergias ?? "",
                    turno = h.Turno != null ? new
                    {
                        id = h.Turno.Id,
                        fecha = h.Turno.Fecha,
                        paciente = h.Turno.Paciente != null ? new
                        {
                            id = h.Turno.Paciente.Id,
                            usuario = new { nombreUsuario = h.Turno.Paciente.Usuario.NombreUsuario ?? "" }
                        } : null,
                        medico = h.Turno.Medico != null ? new
                        {
                            id = h.Turno.Medico.Id,
                            usuario = new { nombreUsuario = h.Turno.Medico.Usuario.NombreUsuario ?? "" }
                        } : null
                    } : null
                });

                return Ok(historialesDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", error = ex.Message });
            }
        }

        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Historial_medicoDTO historialDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Verificar que el Turno existe
                var turnoExiste = await _context.Turnos.AnyAsync(t => t.Id == historialDto.TurnoId);
                if (!turnoExiste)
                    return BadRequest(new { mensaje = "El TurnoId no existe" });

                var historial = new Historial_Medico
                {
                    Id = Guid.NewGuid(),
                    TurnoId = historialDto.TurnoId,
                    Diagnostico = historialDto.Diagnostico,
                    Tratamiento = historialDto.Tratamiento,
                    Alergias = historialDto.Alergias
                };

                await _historialRepositorio.CrearAsync(historial);

                return Ok(new
                {
                    mensaje = "Historial médico creado exitosamente",
                    id = historial.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al crear historial médico",
                    error = ex.Message
                });
            }
        }

       
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Historial_medicoDTO historialDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var historialExistente = await _historialRepositorio.ObtenerPorIdAsync(id);
                if (historialExistente == null)
                    return NotFound(new { mensaje = "Historial médico no encontrado" });

                historialExistente.Diagnostico = historialDto.Diagnostico;
                historialExistente.Tratamiento = historialDto.Tratamiento;
                historialExistente.Alergias = historialDto.Alergias;

                await _historialRepositorio.ActualizarAsync(historialExistente);

                return Ok(new
                {
                    mensaje = "Historial médico actualizado exitosamente",
                    id = historialExistente.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al actualizar historial médico",
                    error = ex.Message
                });
            }
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var historial = await _historialRepositorio.ObtenerPorIdAsync(id);
                if (historial == null)
                    return NotFound(new { mensaje = "Historial no encontrado" });

                await _historialRepositorio.EliminarAsync(id);
                return Ok(new { mensaje = "Historial eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al eliminar historial", error = ex.Message });
            }
        }

        
        [HttpGet("turnos-disponibles")]
        public async Task<IActionResult> GetTurnosDisponibles()
        {
            try
            {
                var turnos = await _context.Turnos
                    .Include(t => t.Paciente).ThenInclude(p => p.Usuario)
                    .Include(t => t.Medico).ThenInclude(m => m.Usuario)
                    .Select(t => new {
                        t.Id,
                        t.Fecha,
                        t.Estado,
                        paciente = t.Paciente.Usuario.NombreUsuario,
                        medico = t.Medico.Usuario.NombreUsuario
                    })
                    .Take(10)
                    .ToListAsync();

                return Ok(turnos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener turnos", error = ex.Message });
            }
        }
    }
}