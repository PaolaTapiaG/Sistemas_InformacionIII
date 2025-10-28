using Dominio.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicosController : ControllerBase
    {
        private readonly IMedicoRepositorio _medicoRepositorio;

        public MedicosController(IMedicoRepositorio medicoRepositorio)
        {
            _medicoRepositorio = medicoRepositorio;
        }

        // ?? GET: api/Medicos
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var medicos = await _medicoRepositorio.ListarTodosAsync();
            return Ok(medicos);
        }

        // ?? GET: api/Medicos/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var medico = await _medicoRepositorio.ObtenerPorIdAsync(id);

            if (medico == null)
                return NotFound(new { mensaje = "Médico no encontrado" });

            return Ok(medico);
        }

        // ?? POST: api/Medicos
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Medicos medico)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _medicoRepositorio.CrearAsync(medico);
            return CreatedAtAction(nameof(GetById), new { id = medico.Id }, medico);
        }

        // ?? PUT: api/Medicos/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Medicos medico)
        {
            if (id != medico.Id)
                return BadRequest("El ID del médico no coincide.");

            var existente = await _medicoRepositorio.ObtenerPorIdAsync(id);
            if (existente == null)
                return NotFound(new { mensaje = "Médico no encontrado" });

            await _medicoRepositorio.ActualizarAsync(medico);
            return Ok(new { mensaje = "Médico actualizado correctamente" });
        }

        // ?? DELETE: api/Medicos/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var medico = await _medicoRepositorio.ObtenerPorIdAsync(id);
            if (medico == null)
                return NotFound(new { mensaje = "Médico no encontrado" });

            await _medicoRepositorio.EliminarAsync(id);
            return Ok(new { mensaje = "Médico eliminado correctamente" });
        }
    }
}
