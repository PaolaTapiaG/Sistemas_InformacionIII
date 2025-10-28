import api from "../lib/api";

export interface UsuarioMedico {
  id: string;
  nombreUsuario: string;
  email?: string | null;
  telefono?: string | null;
}

export interface EspecialidadResumen {
  id: string;
  nombre: string;
}

export interface Medico {
  id: string;
  usuarioId: string;
  especialidadId: string;
  licencia: number;
  usuario?: UsuarioMedico | null;
  especialidad?: EspecialidadResumen | null;
}



