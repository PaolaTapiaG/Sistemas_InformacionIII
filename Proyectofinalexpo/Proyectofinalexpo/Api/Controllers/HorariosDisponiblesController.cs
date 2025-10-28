using Dominio.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HorariosDisponiblesController : ControllerBase
    {
        private readonly IHorarioDisponibleRepositorio _horarioRepositorio;

        public HorariosDisponiblesController(IHorarioDisponibleRepositorio horarioRepositorio)
        {
            _horarioRepositorio = horarioRepositorio;
        }

        // ?? GET: api/HorariosDisponibles
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var horarios = await _horarioRepositorio.ListarTodosAsync();
            return Ok(horarios);
        }

        // ?? GET: api/HorariosDisponibles/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var horario = await _horarioRepositorio.ObtenerPorIdAsync(id);
            if (horario == null)
                return NotFound(new { mensaje = "Horario no encontrado." });

            return Ok(horario);
        }

        // ?? POST: api/HorariosDisponibles
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Horarios_Disponible horario)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            horario.Id = Guid.NewGuid();  // Genera un GUID al crear el horario

            await _horarioRepositorio.CrearAsync(horario);
            return CreatedAtAction(nameof(GetById), new { id = horario.Id }, horario);
        }

        // ?? PUT: api/HorariosDisponibles/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Horarios_Disponible horario)
        {
            if (id != horario.Id)
                return BadRequest("El ID del horario no coincide.");

            var existente = await _horarioRepositorio.ObtenerPorIdAsync(id);
            if (existente == null)
                return NotFound(new { mensaje = "Horario no encontrado." });

            await _horarioRepositorio.ActualizarAsync(horario);
            return Ok(new { mensaje = "Horario actualizado correctamente." });
        }

        // ?? DELETE: api/HorariosDisponibles/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var horario = await _horarioRepositorio.ObtenerPorIdAsync(id);
            if (horario == null)
                return NotFound(new { mensaje = "Horario no encontrado." });

            await _horarioRepositorio.EliminarAsync(id);
            return Ok(new { mensaje = "Horario eliminado correctamente." });
        }
    }
}
