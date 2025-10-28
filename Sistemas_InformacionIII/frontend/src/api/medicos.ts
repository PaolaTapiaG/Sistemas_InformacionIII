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
export async function getMedicos(): Promise<Medico[]> {
  const { data } = await api.get<Medico[]>("Medicos");
  return data;
}
// Ejemplo de uso de la variable api
export const obtenerMedicos = async () => {
  const response = await api.get('/medicos');
  return response.data;
}



