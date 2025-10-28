using Dominio.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infraestructura.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


        public DbSet<Roles> Roles { get; set; }
        public DbSet<Usuarios> Usuarios { get; set; }
        public DbSet<Pacientes> Pacientes { get; set; }
        public DbSet<Especialidades> Especialidades { get; set; }
        public DbSet<Medicos> Medicos { get; set; }
        public DbSet<Horarios_Disponible> HorarioDisponible { get; set; }
        public DbSet<Turnos> Turnos { get; set; }
        public DbSet<Notificaciones> Notificaciones { get; set; }
        public DbSet<Historial_Medico> HistorialMedico { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar relaciones sin cascada para evitar ciclos
            modelBuilder.Entity<Turnos>()
                .HasOne(t => t.Medico)
                .WithMany(m => m.Turnos)
                .HasForeignKey(t => t.MedicoId)
                .OnDelete(DeleteBehavior.Restrict); // Cambiar de Cascade a Restrict

            modelBuilder.Entity<Turnos>()
                .HasOne(t => t.Paciente)
                .WithMany()
                .HasForeignKey(t => t.PacienteId)
                .OnDelete(DeleteBehavior.Restrict); // Cambiar de Cascade a Restrict

            // Configurar otras relaciones que podrían causar ciclos
            modelBuilder.Entity<Medicos>()
                .HasOne(m => m.Usuario)
                .WithMany()
                .HasForeignKey(m => m.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Pacientes>()
                .HasOne(p => p.Usuario)
                .WithMany()
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Horarios_Disponible>()
                .HasOne(h => h.Medico)
                .WithMany(m => m.Horarios_Disponibles)
                .HasForeignKey(h => h.MedicoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuración adicional para asegurar que no haya ciclos
            modelBuilder.Entity<Usuarios>()
                .HasOne(u => u.Rol)
                .WithMany()
                .HasForeignKey(u => u.RolId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Medicos>()
                .HasOne(m => m.Especialidad)
                .WithMany()
                .HasForeignKey(m => m.EspecialidadId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Historial_Medico>()
        .HasOne(h => h.Turno)
        .WithMany() // O .WithMany(t => t.Historial_Medico) si Turnos tiene la colección
        .HasForeignKey(h => h.TurnoId)
        .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
    }
}