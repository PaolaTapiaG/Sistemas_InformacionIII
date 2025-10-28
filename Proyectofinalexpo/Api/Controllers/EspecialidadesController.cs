using Dominio.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EspecialidadesController : ControllerBase
    {
        private readonly IEspecialidadRepositorio _especialidadRepositorio;

        public EspecialidadesController(IEspecialidadRepositorio especialidadRepositorio)
        {
            _especialidadRepositorio = especialidadRepositorio;
        }

        // ?? GET: api/Especialidades
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var especialidades = await _especialidadRepositorio.ListarTodosAsync();
            return Ok(especialidades);
        }

        // ?? GET: api/Especialidades/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var especialidad = await _especialidadRepositorio.ObtenerPorIdAsync(id);
            if (especialidad == null)
                return NotFound(new { mensaje = "Especialidad no encontrada." });

            return Ok(especialidad);
        }

        // ?? POST: api/Especialidades
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Especialidades especialidad)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            especialidad.Id = Guid.NewGuid(); // Genera GUID al crear la especialidad

            await _especialidadRepositorio.CrearAsync(especialidad);
            return CreatedAtAction(nameof(GetById), new { id = especialidad.Id }, especialidad);
        }

        // ?? PUT: api/Especialidades/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Especialidades especialidad)
        {
            if (id != especialidad.Id)
                return BadRequest("El ID de la especialidad no coincide.");

            var existente = await _especialidadRepositorio.ObtenerPorIdAsync(id);
            if (existente == null)
                return NotFound(new { mensaje = "Especialidad no encontrada." });

            await _especialidadRepositorio.ActualizarAsync(especialidad);
            return Ok(new { mensaje = "Especialidad actualizada correctamente." });
        }

        // ?? DELETE: api/Especialidades/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var especialidad = await _especialidadRepositorio.ObtenerPorIdAsync(id);
            if (especialidad == null)
                return NotFound(new { mensaje = "Especialidad no encontrada." });

            await _especialidadRepositorio.EliminarAsync(id);
            return Ok(new { mensaje = "Especialidad eliminada correctamente." });
        }
    }
}
