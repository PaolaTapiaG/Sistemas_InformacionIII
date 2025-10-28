import api from "../lib/api";

export interface TurnoRequest {
  idPaciente: string;
  idMedico: string;
  fecha: string; // ISO date (YYYY-MM-DDTHH:mm:ss) - se usará T00:00:00
  horaInicio: string; // HH:mm:ss
  horaFin: string; // HH:mm:ss
  estado: "Pendiente" | "Confirmado" | "Cancelado" | string;
}

export interface TurnoResponse {
  id?: string;
  idPaciente: string;
  idMedico: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

export async function postTurno(payload: TurnoRequest): Promise<TurnoResponse> {
  const { data } = await api.post<TurnoResponse>("Turno", payload);
  return data;
}

export interface Turno {
  id: string;
  pacienteId: string;
  medicoId: string;
  fecha: string; // ISO
  horaInicio: string; // HH:mm:ss
  horaFin: string; // HH:mm:ss
  estado: string;
}

export async function getTurnos(): Promise<Turno[]> {
  const { data } = await api.get<Turno[]>("Turno");
  return data;
}
