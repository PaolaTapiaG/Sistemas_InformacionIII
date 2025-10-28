using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dominio.Entities
{
    public class Pacientes
    {
        [Key]
        public Guid Id { get; set; }

        [Required, StringLength(13)]
        public string Cedula { get; set; }

        [Required]
        public Guid UsuarioId { get; set; }

        [ForeignKey(nameof(UsuarioId))]
        public virtual Usuarios? Usuario { get; set; }

        public virtual ICollection<Turnos>? Turnos { get; set; } = new HashSet<Turnos>();
    }
}