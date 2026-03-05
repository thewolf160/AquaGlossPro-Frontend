import Card from "../components/Card";

function Sales() {
  return (
    <>
      <div className="flex flex-row gap-6">
        <section className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Nueva Venta</h1>
            <p className="text-slate-500">
              Selecciona los servicios elegidos por el cliente
            </p>
          </div>
          <div className="flex gap-4">
            <Card title="Lavado Sencillo" text="Exterior" price="$5.00" />
            <Card title="Aspirado Profundo" text="Interior" price="$7.00" />
            <Card title="Encerado" text="Acabado" price="$10.00" />
          </div>
        </section>
        <section className="w-full flex flex-col gap-4">
          <div className="border border-slate-200 shadow-sm rounded-md flex flex-col gap-2 p-2">
            <div>
              <p className="font-medium text-md text-slate-800 px-2 text-xl">
                Cliente y Vehículo
              </p>
            </div>
            <div className="flex gap-4 px-2">
              <div className="p-3 bg-blue-200 rounded-full"></div>
              <select
                name=""
                id=""
                className="px-2 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
              >
                <option value="">Alexandra Nieves</option>
              </select>
            </div>
          </div>
          <div className="border border-slate-200 shadow-sm rounded-md p-2 h-120">
            <div className="flex flex-col gap-4 px-4  border-b border-slate-200">
              <p className="font-medium text-md text-slate-800 text-xl">
                Orden
              </p>
              <div className="flex gap-2 items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <p className="bg-blue-100 border border-blue-200 px-3 py-1 rounded-sm">
                    1
                  </p>

                  <p className="text-sm text-slate-800">Aspirado Profundo</p>
                </div>
                <p>$7.00</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 px-4 border-b border-slate-200">
              <p className="font-medium text-md text-slate-800 text-xl">
                Empleados
              </p>
              <div className="flex items-center gap-1 border border-slate-200 rounded-xl w-20 mb-4">
                <i className="bi bi-plus text-lg"></i>
                <span className="text-sm">Agregar</span>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-4 px-4 py-2 border-b border-slate-200">
              <p className="font-medium text-md text-slate-800 text-xl">Total</p>
              <p>$7.00</p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-medium text-md text-slate-800 text-xl px-4">Métodos de Pago</p>
              <div className="border flex items-center justify-between px-4 py-2 border-slate-400 rounded-md">
                Pago Móvil
                <input type="checkbox" name="" id="" />
              </div>
              <div className="border flex items-center justify-between px-4 py-2 border-slate-400 rounded-md">
                Transferencia
                <input type="checkbox" name="" id="" />
              </div>
              <button className="btn bg-blue-600 text-xl text-white">Registrar</button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Sales;
