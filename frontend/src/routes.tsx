import { BrowserRouter,Routes,Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { RequireAuth } from "./components/RequireAuth";
import { MedicoLayout } from "./pages/medico/MedicoLayout";
import { PacienteLayout } from "./pages/paciente/PacienteLayout";
import { ReservarCitaPage } from "./pages/paciente/ReservarCitaPage";
import { MisCitasPage } from "./pages/paciente/MisCitasPage";
import { MisCitasMedicoPage } from "./pages/medico/MisCitasMedicoPage";
import { MisPacientesMedicoPage } from "./pages/medico/MisPacientesMedicoPage";
import { HistorialMedicoPage } from "./pages/medico/HistorialMedicoPage";
import { EditarHistorialMedicoPage } from "./pages/medico/EditarHistorialMedicoPage";


export const MisRutas = () => {

        return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Rutas protegidas por rol */}
                <Route element={<RequireAuth allowedRoles={["Medico"]} />}>
                    <Route path="/medico" element={<MedicoLayout />} />
                    <Route path="/medico/mis-citas" element={<MisCitasMedicoPage />} />
                    <Route path="/medico/pacientes" element={<MisPacientesMedicoPage />} />
                    <Route path="/medico/historial/:pacienteId" element={<HistorialMedicoPage/>} />
                    <Route path="/medico/historial/editar/:historialId" element={<EditarHistorialMedicoPage />} />

                </Route>
                <Route element={<RequireAuth allowedRoles={["Paciente"]} />}>
                    <Route path="/paciente" element={<PacienteLayout />} />
                    <Route path="/paciente/reservar" element={<ReservarCitaPage />} />
                    <Route path="/paciente/mis-citas" element={<MisCitasPage />} />
                    
                </Route>
            </Routes>
        </BrowserRouter>
    );
}