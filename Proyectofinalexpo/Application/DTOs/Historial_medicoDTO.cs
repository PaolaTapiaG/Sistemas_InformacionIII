using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class Historial_medicoDTO
    {
        public Guid Id { get; set; }
        public Guid TurnoId { get; set; }  
        public string Diagnostico { get; set; } = string.Empty;
        public string Tratamiento { get; set; } = string.Empty;
        public string Alergias { get; set; } = string.Empty;
    }
}
