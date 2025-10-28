import api from "../lib/api";

export interface HorarioDisponible {
  id: string;
  diaSemana: string;
  horaInicio: string; // "HH:mm:ss"
  horaFin: string; // "HH:mm:ss"
  duracionTurno: number; // minutos
  medicoId: string;
}

export async function getHorariosDisponibles(): Promise<HorarioDisponible[]> {
  const { data } = await api.get<HorarioDisponible[]>("HorariosDisponibles");
  return data;
}
