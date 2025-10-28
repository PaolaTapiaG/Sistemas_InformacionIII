using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dominio.Entities
{
    public class Horarios_Disponible
    {
        [Key]
        public Guid Id { get; set; }

        [Required, StringLength(20)]
        public string DiaSemana { get; set; }

        [Column(TypeName = "time")]
        public TimeSpan HoraInicio { get; set; }

        [Column(TypeName = "time")]
        public TimeSpan HoraFin { get; set; }

        public int DuracionTurno { get; set; }

        [Required]
        public Guid MedicoId { get; set; }

        [ForeignKey(nameof(MedicoId))]
        public virtual Medicos? Medico { get; set; }
    }
}