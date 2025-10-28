using Domain.Interfaces;
using Dominio.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;


namespace Aplication.UseCases
{
    public class CrearUsuario
    {
        private readonly IUsuarioRepositorio _usuarioRepositorio;
        private readonly IRolRepositorio _rolRepositorio;

        public CrearUsuario(IUsuarioRepositorio usuarioRepositorio, IRolRepositorio rolRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
            _rolRepositorio = rolRepositorio;
        }

        public async Task EjecutarAsync(Usuarios usuario)
        {
            // ✅ Validaciones de negocio
            ValidarUsuario(usuario);

            // ✅ Validar que el rol exista
            if (usuario.RolId == null || usuario.RolId == Guid.Empty)
                throw new ArgumentException("El RolId es obligatorio.");

            var rolExiste = await _rolRepositorio.ObtenerPorIdAsync(usuario.RolId.Value);
            if (rolExiste == null)
                throw new ArgumentException($"El rol con ID {usuario.RolId} no existe.");

            // 🔐 Encriptar contraseña antes de guardar
            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(usuario.Contrasena);

            await _usuarioRepositorio.CrearAsync(usuario);
        }

        private void ValidarUsuario(Usuarios usuario)
        {
            if (string.IsNullOrWhiteSpace(usuario.NombreUsuario))
                throw new ArgumentException("El nombre del usuario es obligatorio");

            if (string.IsNullOrWhiteSpace(usuario.Contrasena))
                throw new ArgumentException("La contraseña es obligatoria");

            if (!usuario.Contrasena.Contains("@"))
                throw new ArgumentException("La contraseña debe contener el carácter '@'");

            if (!string.IsNullOrWhiteSpace(usuario.Telefono))
            {
                var telefonoLimpio = new string(usuario.Telefono.Where(char.IsDigit).ToArray());

                if (telefonoLimpio.Length != 8)
                    throw new ArgumentException("El teléfono debe tener exactamente 8 números");
            }
        }
    }
}
