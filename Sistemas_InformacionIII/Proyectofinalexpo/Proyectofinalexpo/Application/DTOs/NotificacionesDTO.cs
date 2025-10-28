using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class NotificacionesDTO
    {
        public Guid ID { get; set; }
        public DateTime FechaHoraEnvio { get; set; }
        public string DestinatarioCorreo { get; set; } = string.Empty;
        public string Asunto { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;
        public Guid IdTurno { get; set; }
    }
}
