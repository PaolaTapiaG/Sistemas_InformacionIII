import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

export interface NavItem {
  to: string;
  label: string;
  icon?: ReactNode;
}

interface NavbarProps {
  brand?: string;
  items?: NavItem[];
  userLabel?: string;
  onLogout?: () => void;
}

export const Navbar = ({ brand = "MiClínica", items = [], userLabel, onLogout }: NavbarProps) => {
  const { pathname } = useLocation();

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      padding: "12px 20px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: "#ffffff", textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>{brand}</div>

        <ul style={{ display: "flex", alignItems: "center", gap: 12, listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "#ffffff",
                    background: active ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.1)",
                    border: active ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid transparent",
                    transition: "all 0.3s ease",
                    fontWeight: active ? 600 : 400
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = active ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {userLabel && (
            <span style={{ color: "#ffffff", fontSize: 14, opacity: 0.9 }}>Conectado como {userLabel}</span>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontWeight: 500
              }}
              title="Cerrar sesión"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
