using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dominio.Entities
{
    public class Historial_Medico
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey(nameof(Turno))]
        public Guid TurnoId { get; set; }

        public string? Diagnostico { get; set; }
        public string? Tratamiento { get; set; }
        public string? Alergias { get; set; }

        public Turnos? Turno { get; set; }
    }
}
