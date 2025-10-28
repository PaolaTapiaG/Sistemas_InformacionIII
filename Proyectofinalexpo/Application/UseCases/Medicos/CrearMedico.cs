using Domain.Interfaces;
using Dominio.Entities;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class CrearMedico
    {
        private readonly IMedicoRepositorio _medicoRepositorio;
        private readonly IUsuarioRepositorio _usuarioRepositorio;
        private readonly IEspecialidadRepositorio _especialidadRepositorio;

        public CrearMedico(IMedicoRepositorio medicoRepositorio, IUsuarioRepositorio usuarioRepositorio, IEspecialidadRepositorio especialidadRepositorio)
        {
            _medicoRepositorio = medicoRepositorio;
            _usuarioRepositorio = usuarioRepositorio;
            _especialidadRepositorio = especialidadRepositorio;
        }

        public async Task EjecutarAsync(Medicos medico)
        {
            // Validaciones de negocio
            ValidarMedico(medico);

            // Validar que el usuario exista
            var usuarioExiste = await _usuarioRepositorio.ObtenerPorIdAsync(medico.UsuarioId);
            if (usuarioExiste == null)
                throw new ArgumentException($"El usuario con ID {medico.UsuarioId} no existe.");

            // Validar que la especialidad exista
            var especialidadExiste = await _especialidadRepositorio.ObtenerPorIdAsync(medico.EspecialidadId);
            if (especialidadExiste == null)
                throw new ArgumentException($"La especialidad con ID {medico.EspecialidadId} no existe.");

            await _medicoRepositorio.CrearAsync(medico);
        }

        private void ValidarMedico(Medicos medico)
        {
            if (medico.UsuarioId == Guid.Empty)
                throw new ArgumentException("El ID de usuario es obligatorio");

            if (medico.EspecialidadId == Guid.Empty)
                throw new ArgumentException("El ID de especialidad es obligatorio");

            if (medico.Licencia.HasValue && medico.Licencia.Value <= 0)
                throw new ArgumentException("La licencia debe ser un número positivo");
        }
    }
}