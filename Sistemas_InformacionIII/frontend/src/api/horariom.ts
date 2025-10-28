import api from "../lib/api";

export interface HorarioDisponible {
  id: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  duracionTurno: number;
  medicoId: string;
  medico: {
    id: string;
    usuario: {
      nombreUsuario: string;
    };
  };
}

export const getHorariosDisponibles = async (): Promise<HorarioDisponible[]> => {
  try {
    const response = await api.get('/HorariosDisponibles');
    return response.data;
  } catch (error) {
    console.error('Error fetching horarios disponibles:', error);
    throw error;
  }
};

export const createHorarioDisponible = async (horarioData: {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  duracionTurno: number;
  medicoId?: string;
}): Promise<HorarioDisponible> => {
  try {
    const response = await api.post('/HorariosDisponibles', horarioData);
    return response.data;
  } catch (error) {
    console.error('Error creating horario disponible:', error);
    throw error;
  }
};

export const deleteHorarioDisponible = async (id: string): Promise<void> => {
  try {
    await api.delete(`/HorariosDisponibles/${id}`);
  } catch (error) {
    console.error('Error deleting horario disponible:', error);
    throw error;
  }
};

