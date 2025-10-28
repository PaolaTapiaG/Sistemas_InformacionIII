namespace Application.DTOs
{
    public class UsuariosDTO
    {
        public string NombreUsuario { get; set; } = string.Empty; // obligatorio
        public string Nombre { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty; // cliente envía contraseña
        public string Telefono { get; set; } = string.Empty;
        public Guid IdRol { get; set; }
    }
}
