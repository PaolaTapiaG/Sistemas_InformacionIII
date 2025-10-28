import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { CalendarDays, Stethoscope, Users } from "lucide-react";

export const MedicoLayout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreRol");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <Navbar
        brand="MiClínica — Médico"
        userLabel="Médico"
        onLogout={logout}
        items={[
          { to: "/medico", label: "Dashboard", icon: <Stethoscope size={18} /> },
          { to: "/medico/mis-citas", label: "Mis citas", icon: <CalendarDays size={18} /> },
          { to: "/medico/pacientes", label: "Pacientes", icon: <Users size={18} /> },
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
          <h2 style={{ marginTop: 0, fontSize: 32, fontWeight: 700, background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Panel Médico</h2>
          <p style={{ color: "#6b7280", fontSize: 16, marginBottom: 32 }}>
            Bienvenido. Aquí podrás gestionar tu agenda, ver tus pacientes y administrar citas.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <div 
              onClick={() => navigate("/medico/mis-citas")}
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
              <CalendarDays size={48} color="#ffffff" style={{ marginBottom: 12 }} />
              <h3 style={{ color: "#ffffff", margin: "0 0 8px 0", fontSize: 20 }}>Mis Citas</h3>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: 14 }}>Ver agenda de citas programadas</p>
            </div>

            <div 
              onClick={() => navigate("/medico/pacientes")}
              style={{ 
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", 
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
              <Users size={48} color="#ffffff" style={{ marginBottom: 12 }} />
              <h3 style={{ color: "#ffffff", margin: "0 0 8px 0", fontSize: 20 }}>Pacientes</h3>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: 14 }}>Gestionar información de pacientes</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
