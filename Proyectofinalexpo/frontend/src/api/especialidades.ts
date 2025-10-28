import api from "../lib/api";

export interface Especialidad {
  id: string;
  nombre: string;
  medicos: unknown[];
}

export async function getEspecialidades(): Promise<Especialidad[]> {
  const { data } = await api.get<Especialidad[]>("Especialidades");
  return data;
}
