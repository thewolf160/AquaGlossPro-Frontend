import { useNavigate } from "react-router-dom";
import {
  hasPermission,
  type ModuleName,
} from "../../utils/checkPermissions.utils";

interface OpcionConfig {
  id: string;
  title: string;
  desc: string;
  icon: string;
  module: ModuleName;
}

const opciones: OpcionConfig[] = [
  {
    id: "jobs",
    title: "Puestos de Trabajo",
    desc: "Defina y administre los cargos del personal",
    icon: "bi bi-person-fill-gear",
    module: "JOBS",
  },
  {
    id: "typesVehicles",
    title: "Tipos de Vehículos",
    desc: "Configura y administra las diferentes categorías de vehículos",
    icon: "bi bi-car-front-fill",
    module: "TYPE_VEHICLES",
  },
  {
    id: "pays",
    title: "Métodos de Pago",
    desc: "Controla las opciones de pago de tu sistema",
    icon: "bi bi-cash",
    module: "PAYMENT_METHODS",
  },
  {
    id: "categories",
    title: "Categorías",
    desc: "Organice sus productos y servicios en grupos personalizados",
    icon: "bi bi-tags",
    module: "CATEGORIES",
  },
];

function SettingsMenu() {
  const navigate = useNavigate();

  const opcionesPermitidas = opciones.filter((opt) =>
    hasPermission(opt.module, "ANY"),
  );

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">
            Configuración del Sistema
          </h1>
          <p className="text-slate-500">
            Gestione los parámetros base del sistema
          </p>
        </div>
      </div>

      {opcionesPermitidas.length === 0 ? (
        <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
          No tienes permisos para gestionar ninguna configuración del sistema.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opcionesPermitidas.map((opt) => (
            <div
              key={opt.id}
              onClick={() => navigate(opt.id)}
              className="card bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all ease-out duration-200 "
            >
              <div className="card-body items-center text-center">
                <div className="text-4xl bg-blue-100 py-1 px-2 mb-2 rounded-lg">
                  <i className={`${opt.icon} text-blue-800`} />
                </div>
                <h2 className="card-title">{opt.title}</h2>
                <p className="text-sm opacity-70">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SettingsMenu;
