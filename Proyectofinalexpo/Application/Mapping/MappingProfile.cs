using Application.DTOs;
using AutoMapper;
using Dominio.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mapping
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Especialidades, EspecialidadesDTO>().ReverseMap();
            CreateMap<Historial_Medico, Historial_medicoDTO>().ReverseMap();
            CreateMap<Horarios_Disponible, Horarios_DisponibleDTO>().ReverseMap();
            CreateMap<Medicos, MedicosDTO>().ReverseMap();
            CreateMap<Notificaciones, NotificacionesDTO>().ReverseMap();
            CreateMap<Pacientes, PacientesDTO>().ReverseMap();
            CreateMap<Roles, RolesDTO>().ReverseMap();
            CreateMap<Turnos, TurnosDTO>().ReverseMap();
            CreateMap<Usuarios, UsuariosDTO>().ReverseMap();
        }
    }
}
