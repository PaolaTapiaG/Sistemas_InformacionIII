
import api from "../lib/api";

export interface HistorialMedico {
  id: string;
  turnoId: string;
  diagnostico: string;
  tratamiento: string;
  alergias: string;
  turno: {
    id: string;
    fecha: string;
    paciente: {
      id: string;
      usuario: {
        nombreUsuario: string;
      };
    };
    medico: {
      id: string;
      usuario: {
        nombreUsuario: string;
      };
    };
  };
}

export interface CreateHistorialMedicoDTO {
  turnoId: string;
  diagnostico: string;
  tratamiento: string;
  alergias: string;
}


export async function getAllHistoriales(): Promise<HistorialMedico[]> {
  const { data } = await api.get<HistorialMedico[]>('HistorialMedico');
  return data;
}


export async function getHistorialById(id: string): Promise<HistorialMedico> {
  const { data } = await api.get<HistorialMedico>(`HistorialMedico/${id}`);
  return data;
}


export async function getHistorialPorPaciente(pacienteId: string): Promise<HistorialMedico[]> {
  const { data } = await api.get<HistorialMedico[]>(`HistorialMedico/paciente/${pacienteId}`);
  return data;
}


export async function createHistorialMedico(historial: CreateHistorialMedicoDTO): Promise<any> {
  const { data } = await api.post('HistorialMedico', historial);
  return data;
}


export async function updateHistorialMedico(id: string, historial: CreateHistorialMedicoDTO): Promise<any> {
  const { data } = await api.put(`HistorialMedico/${id}`, historial);
  return data;
}


export async function deleteHistorialMedico(id: string): Promise<any> {
  const { data } = await api.delete(`HistorialMedico/${id}`);
  return data;
}


export async function getTurnosDisponibles(): Promise<any[]> {
  const { data } = await api.get('HistorialMedico/turnos-disponibles');
  return data;
}