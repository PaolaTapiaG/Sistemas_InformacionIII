using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dominio.Entities
{
    public class Especialidades
    {
        [Key]
        public Guid Id { get; set; }

        [Required, StringLength(100)]
        public string Nombre { get; set; }

        public virtual ICollection<Medicos>? Medicos { get; set; } = new HashSet<Medicos>();
    }
}