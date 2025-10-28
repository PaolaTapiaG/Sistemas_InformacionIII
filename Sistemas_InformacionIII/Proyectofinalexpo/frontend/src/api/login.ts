import api from "../lib/api";

export interface LoginPayload {
	nombreUsuario: string;
	contrasena: string;
}

export interface LoginResponse {
	token: string;
	nombreRol: "Medico" | "Paciente" | string;
	idUsuario?: string;
	idPaciente?: string;
	idMedico?: string;
}

// Realiza el login contra /Auth/login y devuelve el token JWT
export async function login(payload: LoginPayload): Promise<LoginResponse> {
	const { data } = await api.post<LoginResponse>("Auth/login", payload);
	return data;
}

