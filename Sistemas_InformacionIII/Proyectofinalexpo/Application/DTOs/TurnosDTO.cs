using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class TurnosDTO
    {
        public Guid ID { get; set; }
        public Guid IdPaciente { get; set; }
        public Guid IdMedico { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan HoraInicio { get; set; }
        public TimeSpan HoraFin { get; set; }
        public string Estado { get; set; } = string.Empty;
    }
}
