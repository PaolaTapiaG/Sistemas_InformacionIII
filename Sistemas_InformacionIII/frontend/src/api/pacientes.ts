import api from "../lib/api";

export interface UsuarioPaciente {
  id: string;
  nombreUsuario: string;
  email?: string | null;
  telefono?: string | null;
}

export interface Paciente {
  id: string;
  cedula: string;
  usuarioId: string;
  usuario?: UsuarioPaciente | null;
}

export async function getPacientes(): Promise<Paciente[]> {
  const { data } = await api.get<Paciente[]>("Pacientes");
  return data;
}