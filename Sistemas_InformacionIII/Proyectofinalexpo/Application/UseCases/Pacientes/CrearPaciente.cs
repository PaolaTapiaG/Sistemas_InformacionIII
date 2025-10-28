using Domain.Interfaces;
using Dominio.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class CrearPaciente
    {
        private readonly IPacienteRepositorio _pacienteRepositorio;
        private readonly IUsuarioRepositorio _usuarioRepositorio;

        public CrearPaciente(IPacienteRepositorio pacienteRepositorio, IUsuarioRepositorio usuarioRepositorio)
        {
            _pacienteRepositorio = pacienteRepositorio;
            _usuarioRepositorio = usuarioRepositorio;
        }

        public async Task EjecutarAsync(Pacientes paciente)
        {
            // Validaciones de negocio
            ValidarPaciente(paciente);

            // Validar que el usuario exista
            var usuarioExiste = await _usuarioRepositorio.ObtenerPorIdAsync(paciente.UsuarioId);
            if (usuarioExiste == null)
                throw new ArgumentException($"El usuario con ID {paciente.UsuarioId} no existe.");

            await _pacienteRepositorio.CrearAsync(paciente);
        }

        private void ValidarPaciente(Pacientes paciente)
        {
            if (string.IsNullOrWhiteSpace(paciente.Cedula))
                throw new ArgumentException("La cédula es obligatoria");

            if (paciente.Cedula.Length != 13)
                throw new ArgumentException("La cédula debe tener exactamente 8 caracteres");

            if (paciente.UsuarioId == Guid.Empty)
                throw new ArgumentException("El ID de usuario es obligatorio");
        }
    }
}