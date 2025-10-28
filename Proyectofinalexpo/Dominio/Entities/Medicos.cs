using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Dominio.Entities
{
    public class Medicos
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UsuarioId { get; set; }

        [Required]
        public Guid EspecialidadId { get; set; }

        public int? Licencia { get; set; }

        [ForeignKey(nameof(UsuarioId))]
        public virtual Usuarios? Usuario { get; set; }

        [ForeignKey(nameof(EspecialidadId))]
        public virtual Especialidades? Especialidad { get; set; }

        public virtual ICollection<Turnos> Turnos { get; set; } = new HashSet<Turnos>();

        // Cambiar de object a ICollection
        [JsonIgnore]
        public virtual ICollection<Horarios_Disponible> Horarios_Disponibles { get; set; } = new HashSet<Horarios_Disponible>();
    }
}