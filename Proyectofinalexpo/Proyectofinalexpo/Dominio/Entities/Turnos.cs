using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dominio.Entities
{
    public class Turnos
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey(nameof(Paciente))]
        public Guid PacienteId { get; set; }

        [ForeignKey(nameof(Medico))]
        public Guid MedicoId { get; set; }

        public DateTime Fecha { get; set; }
        public TimeSpan HoraInicio { get; set; }
        public TimeSpan HoraFin { get; set; }
        public string? Estado { get; set; }

        // 🔗 Relaciones
        public Pacientes? Paciente { get; set; }
        public Medicos? Medico { get; set; }

        public virtual ICollection<Notificaciones> Notificaciones { get; set; } = new HashSet<Notificaciones>();
        public virtual ICollection<Historial_Medico> Historial_Medico { get; set; } = new HashSet<Historial_Medico>();
    }
}
