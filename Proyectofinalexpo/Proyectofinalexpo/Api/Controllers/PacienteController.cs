using Dominio.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PacientesController : ControllerBase
    {
        private readonly IPacienteRepositorio _pacienteRepositorio;

        public PacientesController(IPacienteRepositorio pacienteRepositorio)
        {
            _pacienteRepositorio = pacienteRepositorio;
        }

        // ?? GET: api/Pacientes
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pacientes = await _pacienteRepositorio.ListarTodosAsync();
            return Ok(pacientes);
        }

        // ?? GET: api/Pacientes/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var paciente = await _pacienteRepositorio.ObtenerPorIdAsync(id);
            if (paciente == null)
                return NotFound(new { mensaje = "Paciente no encontrado." });

            return Ok(paciente);
        }

        // ?? POST: api/Pacientes
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pacientes paciente)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _pacienteRepositorio.CrearAsync(paciente);
            return CreatedAtAction(nameof(GetById), new { id = paciente.Id }, paciente);
        }

        // ?? PUT: api/Pacientes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Pacientes paciente)
        {
            if (id != paciente.Id)
                return BadRequest("El ID del paciente no coincide.");

            var existente = await _pacienteRepositorio.ObtenerPorIdAsync(id);
            if (existente == null)
                return NotFound(new { mensaje = "Paciente no encontrado." });

            await _pacienteRepositorio.ActualizarAsync(paciente);
            return Ok(new { mensaje = "Paciente actualizado correctamente." });
        }

        // ?? DELETE: api/Pacientes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var paciente = await _pacienteRepositorio.ObtenerPorIdAsync(id);
            if (paciente == null)
                return NotFound(new { mensaje = "Paciente no encontrado." });

            await _pacienteRepositorio.EliminarAsync(id);
            return Ok(new { mensaje = "Paciente eliminado correctamente." });
        }
    }
}
