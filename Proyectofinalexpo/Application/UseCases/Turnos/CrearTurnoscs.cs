using Domain.Interfaces;
using Dominio.Entities;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class RegistrarTurno
    {
        private readonly ITurnoRepositorio _turnoRepositorio;
        private readonly IPacienteRepositorio _pacienteRepositorio;
        private readonly IMedicoRepositorio _medicoRepositorio;

        public RegistrarTurno(ITurnoRepositorio turnoRepositorio, IPacienteRepositorio pacienteRepositorio, IMedicoRepositorio medicoRepositorio)
        {
            _turnoRepositorio = turnoRepositorio;
            _pacienteRepositorio = pacienteRepositorio;
            _medicoRepositorio = medicoRepositorio;
        }

        public async Task EjecutarAsync(Turnos turno)
        {
            // Validaciones de negocio
            ValidarTurno(turno);

            // Validar que el paciente exista
            var pacienteExiste = await _pacienteRepositorio.ObtenerPorIdAsync(turno.PacienteId);
            if (pacienteExiste == null)
                throw new ArgumentException($"El paciente con ID {turno.PacienteId} no existe.");

            // Validar que el médico exista
            var medicoExiste = await _medicoRepositorio.ObtenerPorIdAsync(turno.MedicoId);
            if (medicoExiste == null)
                throw new ArgumentException($"El médico con ID {turno.MedicoId} no existe.");

            // Validar disponibilidad del médico en esa fecha y hora
            var turnoExistente = await _turnoRepositorio.ExisteTurnoEnHorarioAsync(turno.MedicoId, turno.Fecha, turno.HoraInicio, turno.HoraFin);
            if (turnoExistente)
                throw new InvalidOperationException("El médico ya tiene un turno asignado en ese horario.");

            // Asignar estado por defecto si no viene especificado
            if (string.IsNullOrWhiteSpace(turno.Estado))
            {
                turno.Estado = "Programado";
            }

            // Generar ID si no viene especificado
            if (turno.Id == Guid.Empty)
            {
                turno.Id = Guid.NewGuid();
            }

            await _turnoRepositorio.CrearAsync(turno);
        }

        private void ValidarTurno(Turnos turno)
        {
            if (turno.PacienteId == Guid.Empty)
                throw new ArgumentException("El ID del paciente es obligatorio");

            if (turno.MedicoId == Guid.Empty)
                throw new ArgumentException("El ID del médico es obligatorio");

            if (turno.Fecha == default)
                throw new ArgumentException("La fecha del turno es obligatoria");

            if (turno.Fecha < DateTime.Today)
                throw new ArgumentException("La fecha del turno no puede ser en el pasado");

            if (turno.HoraInicio == default)
                throw new ArgumentException("La hora de inicio es obligatoria");

            if (turno.HoraFin == default)
                throw new ArgumentException("La hora de fin es obligatoria");

            if (turno.HoraInicio >= turno.HoraFin)
                throw new ArgumentException("La hora de inicio debe ser anterior a la hora de fin");

            // Validar que el horario esté en un rango razonable (ej: 8:00 - 20:00)
            if (turno.HoraInicio < TimeSpan.FromHours(8) || turno.HoraFin > TimeSpan.FromHours(20))
                throw new ArgumentException("Los turnos deben estar entre las 8:00 y 20:00 horas");

            // Validar duración mínima del turno (ej: 30 minutos)
            var duracion = turno.HoraFin - turno.HoraInicio;
            if (duracion < TimeSpan.FromMinutes(30))
                throw new ArgumentException("La duración mínima del turno es de 30 minutos");
        }
    }
}