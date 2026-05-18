import { useNavigate } from "react-router-dom";

interface NavBarProps {
  title: string;
  onRegister?: () => void;
}

function NavBar({ title, onRegister }: NavBarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <div className="flex flex-col md:flex-row gap-2">
        <button
          className="btn bg-white rounded-lg"
          onClick={() => navigate("/settings")}
        >
          <i className="bi bi-arrow-left" />
          Volver al Menú
        </button>
        {onRegister && (
           <button
          className="btn bg-blue-600 text-white rounded-lg"
          onClick={onRegister}
        >
          <i className="bi bi-plus text-xl" />
          Agregar
        </button>
        )}
       
      </div>
    </div>
  );
}

export default NavBar;
