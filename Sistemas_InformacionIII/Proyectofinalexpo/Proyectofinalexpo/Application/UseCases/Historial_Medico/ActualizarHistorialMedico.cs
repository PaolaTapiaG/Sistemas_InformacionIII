using Domain.Interfaces;
using Dominio.Entities;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class ActualizarHistorialMedico
    {
        private readonly IHistorialMedicoRepositorio _historialMedicoRepositorio;
        private readonly ITurnoRepositorio _turnoRepositorio;

        public ActualizarHistorialMedico(IHistorialMedicoRepositorio historialMedicoRepositorio, ITurnoRepositorio turnoRepositorio)
        {
            _historialMedicoRepositorio = historialMedicoRepositorio;
            _turnoRepositorio = turnoRepositorio;
        }

        public async Task EjecutarAsync(Guid id, Historial_Medico historialMedicoActualizado)
        {
            // Validar que el historial médico exista
            var historialExistente = await _historialMedicoRepositorio.ObtenerPorIdAsync(id);
            if (historialExistente == null)
                throw new ArgumentException($"El historial médico con ID {id} no existe.");

            // Validaciones de negocio
            ValidarHistorialMedico(historialMedicoActualizado);

            // Validar que el turno exista (si se está actualizando el TurnoId)
            if (historialExistente.TurnoId != historialMedicoActualizado.TurnoId)
            {
                var turnoExiste = await _turnoRepositorio.ExisteAsync(historialMedicoActualizado.TurnoId);
                if (!turnoExiste)
                    throw new ArgumentException($"El turno con ID {historialMedicoActualizado.TurnoId} no existe.");
            }

            // Actualizar los campos del historial médico existente
            historialExistente.TurnoId = historialMedicoActualizado.TurnoId;
            historialExistente.Diagnostico = historialMedicoActualizado.Diagnostico;
            historialExistente.Tratamiento = historialMedicoActualizado.Tratamiento;
            historialExistente.Alergias = historialMedicoActualizado.Alergias;

            await _historialMedicoRepositorio.ActualizarAsync(historialExistente);
        }

        public async Task EjecutarAsyncPorTurnoId(Guid turnoId, Historial_Medico historialMedicoActualizado)
        {
            // Buscar historial médico por TurnoId
            var historialExistente = await _historialMedicoRepositorio.ObtenerPorTurnoIdAsync(turnoId);
            if (historialExistente == null)
                throw new ArgumentException($"No se encontró historial médico para el turno con ID {turnoId}.");

            await EjecutarAsync(historialExistente.Id, historialMedicoActualizado);
        }

        private void ValidarHistorialMedico(Historial_Medico historialMedico)
        {
            if (historialMedico.TurnoId == Guid.Empty)
                throw new ArgumentException("El ID del turno es obligatorio");

            if (string.IsNullOrWhiteSpace(historialMedico.Diagnostico))
                throw new ArgumentException("El diagnóstico es obligatorio");

            if (string.IsNullOrWhiteSpace(historialMedico.Tratamiento))
                throw new ArgumentException("El tratamiento es obligatorio");

            // Validar longitud máxima de textos
            if (historialMedico.Diagnostico.Length > 1000)
                throw new ArgumentException("El diagnóstico no puede exceder los 1000 caracteres");

            if (historialMedico.Tratamiento.Length > 1000)
                throw new ArgumentException("El tratamiento no puede exceder los 1000 caracteres");

            if (!string.IsNullOrWhiteSpace(historialMedico.Alergias) && historialMedico.Alergias.Length > 500)
                throw new ArgumentException("Las alergias no pueden exceder los 500 caracteres");
        }
    }
}