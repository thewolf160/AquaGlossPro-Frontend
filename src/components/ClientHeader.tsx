export default function ClientHeader() {
  return (
    <header className="bg-blue-600 border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Lado Izquierdo: Logo y Marca */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-sm">
            <i className="bi bi-car-front-fill"></i>
          </div>
          <span className="font-black text-xl text-gray-900 tracking-tight">
            Auto<span className="text-white">Lavado</span>
          </span>
        </div>

        {/* Centro: Enlaces de Navegación (Solo visibles en PC/Tablet) */}
        <nav className="hidden md:flex items-center  gap-20 text-sm font-medium text-gray-500">
          <a href="#" className="text-white border-b-2 border-blue-600 py-5">Dashboard</a>
          <a href="#" className="text-white hover:text-gray-900 transition-colors py-5">Mis Vehículos</a>
        </nav>

        {/* Lado Derecho: Notificaciones y Perfil */}
        <div className="flex items-center gap-4">
         
          
          <div className="flex items-center gap-3 border-l border-gray-300 pl-4 cursor-pointer bg-gray-100 hover:bg-gray-50 p-1 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200">
              FD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-gray-800 leading-none">Fabián Dacal</p>
              <p className="text-xs text-gray-500 mt-0.5">Cliente Premium</p>
            </div>
            <i className="bi bi-chevron-down text-gray-400 text-xs hidden sm:block"></i>
          </div>
        </div>
        
      </div>
    </header>
  );
}