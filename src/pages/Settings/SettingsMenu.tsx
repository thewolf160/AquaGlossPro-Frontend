import { useNavigate } from "react-router-dom";

const opciones = [
    {
      id: "jobs",
      title: "Puestos de Trabajo",
      desc: "Defina y administre los cargos del personal",
      icon: "bi bi-person-fill-gear",
    },
    {
      id: "typesVehicles",
      title: "Tipos de Vehículos",
      desc: "Configura y administra las diferentes categorías de vehículos",
      icon: "bi bi-car-front-fill"
    },
    {
      id: "pagos",
      title: "Pagos",
      desc: "Métodos de cobro",
      icon: "bi bi-cash",
    },
  ];

function SettingsMenu() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900"> Configuración del Sistema</h1>
          <p className="text-slate-500">
            Gestione los parámetros base del sistema
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {opciones.map((opt) => (
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
    </div>
  );
}

export default SettingsMenu;
