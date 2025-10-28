using Domain.Interfaces;
using Dominio.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class ActualizarPaciente
    {
        private readonly IPacienteRepositorio _pacienteRepositorio;
        private readonly IUsuarioRepositorio _usuarioRepositorio;

        public ActualizarPaciente(IPacienteRepositorio pacienteRepositorio, IUsuarioRepositorio usuarioRepositorio)
        {
            _pacienteRepositorio = pacienteRepositorio;
            _usuarioRepositorio = usuarioRepositorio;
        }

        public async Task EjecutarAsync(Guid id, Pacientes pacienteActualizado)
        {
            // Validar que el paciente exista
            var pacienteExistente = await _pacienteRepositorio.ObtenerPorIdAsync(id);
            if (pacienteExistente == null)
                throw new ArgumentException($"El paciente con ID {id} no existe.");

            // Validaciones de negocio
            ValidarPaciente(pacienteActualizado);

            // Validar que el usuario exista (si se está actualizando)
            if (pacienteExistente.UsuarioId != pacienteActualizado.UsuarioId)
            {
                var usuarioExiste = await _usuarioRepositorio.ObtenerPorIdAsync(pacienteActualizado.UsuarioId);
                if (usuarioExiste == null)
                    throw new ArgumentException($"El usuario con ID {pacienteActualizado.UsuarioId} no existe.");
            }

            // Actualizar los campos del paciente existente
            pacienteExistente.Cedula = pacienteActualizado.Cedula;
            pacienteExistente.UsuarioId = pacienteActualizado.UsuarioId;

            await _pacienteRepositorio.ActualizarAsync(pacienteExistente);
        }

        private void ValidarPaciente(Pacientes paciente)
        {
            if (string.IsNullOrWhiteSpace(paciente.Cedula))
                throw new ArgumentException("La cédula es obligatoria");

            if (paciente.Cedula.Length != 8)
                throw new ArgumentException("La cédula debe tener exactamente 8 caracteres");

            if (paciente.UsuarioId == Guid.Empty)
                throw new ArgumentException("El ID de usuario es obligatorio");
        }
    }
}