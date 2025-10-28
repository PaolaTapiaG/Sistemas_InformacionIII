using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dominio.Entities
{
    public class Notificaciones
    {
        [Key]
        public Guid Id { get; set; }

        public DateTime FechaHoraEnvio { get; set; }

        [ForeignKey(nameof(Turno))]
        public Guid TurnoId { get; set; }

        public string? DestinatarioCorreo { get; set; }
        public string? Asunto { get; set; }
        public string? Mensaje { get; set; }

        public Turnos Turno { get; set; }
    }
}
