using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class PacientesDTO
    {
        public Guid IdPaciente { get; set; }
        public Guid IdUsuario { get; set; }

        public string Cedula { get; set; } = string.Empty;



    }
}
