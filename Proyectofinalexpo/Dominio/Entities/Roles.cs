using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dominio.Entities
{
    public class Roles
    {
        [Key]
        public Guid Id { get; set; }

        [Required, StringLength(100)]
        public string Nombre { get; set; }

        [StringLength(255)]
        public string? Descripcion { get; set; }
        public virtual ICollection<Usuarios> Usuarios { get; set; } = new HashSet<Usuarios>();

    }
}