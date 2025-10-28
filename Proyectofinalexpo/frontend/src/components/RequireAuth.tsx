import { Navigate, Outlet } from "react-router-dom";

interface RequireAuthProps {
  allowedRoles?: string[];
}

export const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const nombreRol = typeof window !== "undefined" ? localStorage.getItem("nombreRol") : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!nombreRol || !allowedRoles.includes(nombreRol)) {
      // Si hay token pero el rol no coincide, envía a una página neutra (inicio o login)
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
