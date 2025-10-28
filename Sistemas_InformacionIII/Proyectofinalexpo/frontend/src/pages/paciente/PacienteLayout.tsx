import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { CalendarCheck, Home, PlusCircle } from "lucide-react";

export const PacienteLayout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreRol");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <Navbar
        brand="MiClínica — Paciente"
        userLabel="Paciente"
        onLogout={logout}
        items={[
          { to: "/paciente", label: "Inicio", icon: <Home size={18} /> },
          { to: "/paciente/mis-citas", label: "Mis citas", icon: <CalendarCheck size={18} /> },
          { to: "/paciente/reservar", label: "Reservar", icon: <PlusCircle size={18} /> },
        ]}
      />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <section style={{ 
          background: "#ffffff", 
          borderRadius: 16, 
          padding: 32,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          animation: "slideUp 0.6s ease-out"
        }}>
          <h2 style={{ marginTop: 0, fontSize: 32, fontWeight: 700, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Panel Paciente</h2>
          <p style={{ color: "#6b7280", fontSize: 16, marginBottom: 32 }}>
            Bienvenido. Aquí puedes ver y reservar tus citas, y administrar tu información.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <div 
              onClick={() => navigate("/paciente/mis-citas")}
              style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                borderRadius: 12, 
                padding: 24,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              <CalendarCheck size={48} color="#ffffff" style={{ marginBottom: 12 }} />
              <h3 style={{ color: "#ffffff", margin: "0 0 8px 0", fontSize: 20 }}>Mis Citas</h3>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: 14 }}>Ver todas tus citas programadas</p>
            </div>

            <div 
              onClick={() => navigate("/paciente/reservar")}
              style={{ 
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", 
                borderRadius: 12, 
                padding: 24,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              <PlusCircle size={48} color="#ffffff" style={{ marginBottom: 12 }} />
              <h3 style={{ color: "#ffffff", margin: "0 0 8px 0", fontSize: 20 }}>Reservar Cita</h3>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: 14 }}>Agenda una nueva cita médica</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
