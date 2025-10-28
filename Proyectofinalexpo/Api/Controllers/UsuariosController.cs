using Dominio.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioRepositorio _usuarioRepositorio;

        public UsuariosController(IUsuarioRepositorio usuarioRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
        }

        // ?? GET: api/Usuarios
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var usuarios = await _usuarioRepositorio.ListarTodosAsync();
            return Ok(usuarios);
        }

        // ?? GET: api/Usuarios/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var usuario = await _usuarioRepositorio.ObtenerPorIdAsync(id);
            if (usuario == null)
                return NotFound(new { mensaje = "Usuario no encontrado." });

            return Ok(usuario);
        }

        // ?? POST: api/Usuarios
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Usuarios usuario)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            usuario.Id = Guid.NewGuid();  // Genera un GUID al crear el usuario

            await _usuarioRepositorio.CrearAsync(usuario);
            return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario);
        }

        // ?? PUT: api/Usuarios/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Usuarios usuario)
        {
            if (id != usuario.Id)
                return BadRequest("El ID del usuario no coincide.");

            var existente = await _usuarioRepositorio.ObtenerPorIdAsync(id);
            if (existente == null)
                return NotFound(new { mensaje = "Usuario no encontrado." });

            await _usuarioRepositorio.ActualizarAsync(usuario);
            return Ok(new { mensaje = "Usuario actualizado correctamente." });
        }

        // ?? DELETE: api/Usuarios/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var usuario = await _usuarioRepositorio.ObtenerPorIdAsync(id);
            if (usuario == null)
                return NotFound(new { mensaje = "Usuario no encontrado." });

            await _usuarioRepositorio.EliminarAsync(id);
            return Ok(new { mensaje = "Usuario eliminado correctamente." });
        }
    }
}
