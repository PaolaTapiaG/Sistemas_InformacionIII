import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 720, margin: "56px auto", padding: 16 }}>
      <h2>Inicio</h2>
      {token ? (
        <p style={{ wordBreak: "break-all" }}>Autenticado. Token en localStorage.</p>
      ) : (
        <p>No has iniciado sesión.</p>
      )}
      <div style={{ marginTop: 16 }}>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );
};
