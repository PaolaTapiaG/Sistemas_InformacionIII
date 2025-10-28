using Domain.Interfaces;
using Dominio.Entities;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class CrearRol
    {
        private readonly IRolRepositorio _rolRepositorio;

        public CrearRol(IRolRepositorio rolRepositorio)
        {
            _rolRepositorio = rolRepositorio;
        }

        public async Task EjecutarAsync(Roles rol)
        {
            // Validaciones de negocio
            ValidarRol(rol);

            // Crear rol
            await _rolRepositorio.CrearAsync(rol);
        }

        private void ValidarRol(Roles rol)
        {
            if (string.IsNullOrWhiteSpace(rol.Nombre))
            {
                throw new ArgumentException("El nombre del rol es obligatorio");
            }

            if (rol.Nombre.Length > 100)
            {
                throw new ArgumentException("El nombre del rol no puede exceder los 100 caracteres");
            }
        }
    }
}