using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    internal class MedicosDTO
    {
        public Guid IdMedico { get; set; }
        public Guid IdUsuario { get; set; }
        public Guid IdEspecialidad { get; set; }
        public int Licencia { get; set; }
    }
}
