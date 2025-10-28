using Application.DTOs;
using Domain.Interfaces;
using Dominio.Entities;

using System;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class AgregarHorarioDisponible
    {
        private readonly IHorarioDisponibleRepositorio _horarioDisponibleRepositorio;
        private readonly IMedicoRepositorio _medicoRepositorio;

        public AgregarHorarioDisponible(IHorarioDisponibleRepositorio horarioDisponibleRepositorio, IMedicoRepositorio medicoRepositorio)
        {
            _horarioDisponibleRepositorio = horarioDisponibleRepositorio;
            _medicoRepositorio = medicoRepositorio;
        }

        public async Task EjecutarAsync(Horarios_DisponibleDTO horarioDTO)
        {
            // Validaciones de negocio
            ValidarHorario(horarioDTO);

            // Validar que el médico exista
            var medicoExiste = await _medicoRepositorio.ObtenerPorIdAsync(horarioDTO.IdMedico);
            if (medicoExiste == null)
                throw new ArgumentException($"El médico con ID {horarioDTO.IdMedico} no existe.");

            // Validar que no exista un horario duplicado para el mismo médico, día y horario
            var horarioExistente = await _horarioDisponibleRepositorio.ExisteHorarioAsync(
                horarioDTO.IdMedico,
                horarioDTO.DiaSemana,
                horarioDTO.HoraInicio,
                horarioDTO.HoraFin);

            if (horarioExistente)
                throw new InvalidOperationException("Ya existe un horario disponible para este médico en el mismo día y horario.");

            // Crear la entidad Horarios_Disponible a partir del DTO
            var horario = new Horarios_Disponible
            {
                Id = horarioDTO.IdHorario == Guid.Empty ? Guid.NewGuid() : horarioDTO.IdHorario,
                DiaSemana = horarioDTO.DiaSemana,
                HoraInicio = horarioDTO.HoraInicio,
                HoraFin = horarioDTO.HoraFin,
                MedicoId = horarioDTO.IdMedico
            };

            await _horarioDisponibleRepositorio.CrearAsync(horario);
        }

        private void ValidarHorario(Horarios_DisponibleDTO horario)
        {
            if (string.IsNullOrWhiteSpace(horario.DiaSemana))
                throw new ArgumentException("El día de la semana es obligatorio");

            // Validar formato del día de la semana
            var diasValidos = new[] { "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo" };
            if (!Array.Exists(diasValidos, dia => dia.Equals(horario.DiaSemana, StringComparison.OrdinalIgnoreCase)))
                throw new ArgumentException("El día de la semana no es válido. Use: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo");

            if (horario.HoraInicio == default)
                throw new ArgumentException("La hora de inicio es obligatoria");

            if (horario.HoraFin == default)
                throw new ArgumentException("La hora de fin es obligatoria");

            if (horario.HoraInicio >= horario.HoraFin)
                throw new ArgumentException("La hora de inicio debe ser anterior a la hora de fin");

            // Validar que el horario esté en un rango razonable (ej: 6:00 - 22:00)
            if (horario.HoraInicio < TimeSpan.FromHours(6) || horario.HoraFin > TimeSpan.FromHours(22))
                throw new ArgumentException("Los horarios disponibles deben estar entre las 6:00 y 22:00 horas");

            // Validar duración mínima (ej: 30 minutos)
            var duracion = horario.HoraFin - horario.HoraInicio;
            if (duracion < TimeSpan.FromMinutes(30))
                throw new ArgumentException("La duración mínima del horario disponible es de 30 minutos");

            if (horario.IdMedico == Guid.Empty)
                throw new ArgumentException("El ID del médico es obligatorio");
        }
    }
}