using Domain.Interfaces;
using Dominio.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase  // Cambiar a ControllerBase
    {
        private readonly IRolRepositorio _rolRepositorio;
        private readonly ILogger<RolesController> _logger;

        public RolesController(IRolRepositorio rolRepositorio, ILogger<RolesController> logger = null)
        {
            _rolRepositorio = rolRepositorio;
            _logger = logger;
        }

        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Roles>>> GetAll()
        {
            try
            {
                var roles = await _rolRepositorio.ListarTodosAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error al obtener roles");
                return StatusCode(500, new { mensaje = "Error interno del servidor" });
            }
        }

        // GET: api/Roles/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Roles>> GetById(Guid id)
        {
            try
            {
                var rol = await _rolRepositorio.ObtenerPorIdAsync(id);
                if (rol == null)
                    return NotFound(new { mensaje = "Rol no encontrado." });

                return Ok(rol);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error al obtener rol con ID: {Id}", id);
                return StatusCode(500, new { mensaje = "Error interno del servidor" });
            }
        }

        // POST: api/Roles
        [HttpPost]
        public async Task<ActionResult<Roles>> Create([FromBody] Roles rol)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new
                    {
                        mensaje = "Datos inválidos",
                        errores = ModelState.Values.SelectMany(v => v.Errors)
                    });

                // Validar datos requeridos
                if (string.IsNullOrWhiteSpace(rol.Nombre))
                    return BadRequest(new { mensaje = "El nombre del rol es requerido" });

                rol.Id = Guid.NewGuid();

                await _rolRepositorio.CrearAsync(rol);

                return CreatedAtAction(nameof(GetById), new { id = rol.Id }, new
                {
                    mensaje = "Rol creado exitosamente",
                    rol
                });
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error al crear rol");
                return StatusCode(500, new { mensaje = "Error interno del servidor al crear el rol" });
            }
        }

        // PUT: api/Roles/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Roles rol)
        {
            try
            {
                if (id != rol.Id)
                    return BadRequest(new { mensaje = "El ID del rol no coincide." });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var existente = await _rolRepositorio.ObtenerPorIdAsync(id);
                if (existente == null)
                    return NotFound(new { mensaje = "Rol no encontrado." });

                await _rolRepositorio.ActualizarAsync(rol);
                return Ok(new { mensaje = "Rol actualizado correctamente." });
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error al actualizar rol con ID: {Id}", id);
                return StatusCode(500, new { mensaje = "Error interno del servidor" });
            }
        }

        // DELETE: api/Roles/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var rol = await _rolRepositorio.ObtenerPorIdAsync(id);
                if (rol == null)
                    return NotFound(new { mensaje = "Rol no encontrado." });

                await _rolRepositorio.EliminarAsync(id);
                return Ok(new { mensaje = "Rol eliminado correctamente." });
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error al eliminar rol con ID: {Id}", id);
                return StatusCode(500, new { mensaje = "Error interno del servidor" });
            }
        }
    }
}