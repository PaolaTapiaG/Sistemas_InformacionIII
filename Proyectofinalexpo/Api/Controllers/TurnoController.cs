using Aplication.UseCases;
using Application.DTOs;
using Domain.Interfaces;
using Dominio.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurnoController : ControllerBase
    {
        private readonly RegistrarTurno _registrarTurno;
        private readonly ITurnoRepositorio _turnoRepositorio;

        public TurnoController(RegistrarTurno registrarTurno, ITurnoRepositorio turnoRepositorio)
        {
            _registrarTurno = registrarTurno;
            _turnoRepositorio = turnoRepositorio;
        }

        // POST: api/Turno
        [HttpPost]
        public async Task<IActionResult> CrearTurno([FromBody] TurnosDTO turnoDto)
        {
            if (turnoDto == null)
                return BadRequest("El turno no puede ser nulo.");

            try
            {
                // Mapear DTO a entidad
                var turno = new Turnos
                {
                    Id = turnoDto.ID,
                    PacienteId = turnoDto.IdPaciente,
                    MedicoId = turnoDto.IdMedico,
                    Fecha = turnoDto.Fecha,
                    HoraInicio = turnoDto.HoraInicio,
                    HoraFin = turnoDto.HoraFin,
                    Estado = turnoDto.Estado
                };

                await _registrarTurno.EjecutarAsync(turno);

                return Ok(new { mensaje = "Turno creado exitosamente." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error inesperado.", detalle = ex.Message });
            }
        }


        // GET: api/Turno
        [HttpGet]
        public async Task<IActionResult> ListarTurnos()
        {
            try
            {
                var turnos = await _turnoRepositorio.ListarTodosAsync();
                return Ok(turnos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error al listar los turnos.", detalle = ex.Message });
            }
        }
    }
}
