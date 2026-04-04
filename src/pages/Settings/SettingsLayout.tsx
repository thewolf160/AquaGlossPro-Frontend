import { Outlet, useNavigate, useLocation } from "react-router-dom";

function SettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isRoot = location.pathname === "/settings";

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Configuración del Sistema
          </h1>
          <p className="text-slate-500">
            Gestione los parámetros base del sistema
          </p>
        </div>
        {!isRoot && (
          <button
            onClick={() => navigate("/settings")}
            className="btn"
          >
            Volver
          </button>
        )}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsLayout;
