import { useNavigate } from "react-router-dom";

function SettingsMenu() {
    const navigate = useNavigate();

   const opciones = [
    { id: 'jobs', title: 'Puestos de Trabajo', desc: 'Defina y administre los cargos del personal', icon: 'bi bi-person-fill-gear' },
    { id: 'pagos', title: 'Pagos', desc: 'Métodos de cobro', icon: 'bi bi-cash' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {opciones.map((opt) => (
        <div 
          key={opt.id}
          onClick={() => navigate(opt.id)}
          className="card bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all "
        >
          <div className="card-body items-center text-center">
            <div className="text-4xl bg-blue-100 py-1 px-2 mb-2 rounded-lg">
              <i className={`${opt.icon} text-blue-800`}/>
            </div>
            <h2 className="card-title">{opt.title}</h2>
            <p className="text-sm opacity-70">{opt.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsMenu;