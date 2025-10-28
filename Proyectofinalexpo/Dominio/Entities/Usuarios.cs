using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dominio.Entities
{
    public class Usuarios
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string NombreUsuario { get; set; } = string.Empty;

        // 🔹 Esta será la contraseña en texto plano solo durante creación (no se guarda en DB)
        [NotMapped]
        public string? Contrasena { get; set; }

        // 🔹 Contraseña encriptada que sí se guarda
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string? Email { get; set; }

        // 🔹 Nuevo: teléfono del usuario
        [MaxLength(15)]
        public string? Telefono { get; set; }

        // 🔹 Relación con rol
        public Guid? RolId { get; set; }
        public Roles? Rol { get; set; }
    }
}
