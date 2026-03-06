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
        <section className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="border border-slate-200 shadow-sm rounded-lg flex flex-col gap-3 p-4 bg-white">
            <h2 className="font-semibold text-lg text-slate-800">
              Cliente y Vehículo
            </h2>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 bg-blue-200 rounded-full">
                <i className="bi bi-person text-xl"></i>
              </div>
              <select
                name="cliente_id"
                id="cliente_id"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccionar cliente...
                </option>
                <option value="1">Alexandra Nieves</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-200 shadow-sm rounded-lg p-5 bg-white flex flex-col gap-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4">
              <h2 className="font-semibold text-lg text-slate-800">Orden</h2>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-md text-sm font-semibold">
                    1
                  </span>
                  <p className="text-sm font-medium text-slate-700">
                    Aspirado Profundo
                  </p>
                </div>
                <p className="font-medium text-slate-800">$7.00</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4">
              <h2 className="font-semibold text-lg text-slate-800">
                Empleados
              </h2>
              <button className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 w-fit px-3 py-1.5 rounded-lg transition-colors">
                <i className="bi bi-plus text-xl leading-none"></i>
                <span className="text-sm font-medium">Agregar</span>
              </button>
            </div>

            <div className="flex flex-row justify-between items-center border-b border-slate-200 pb-4">
              <h2 className="font-bold text-xl text-slate-800">Total</h2>
              <p className="font-bold text-2xl text-blue-600">$7.00</p>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <h2 className="font-semibold text-lg text-slate-800">
                Métodos de Pago
              </h2>

              <label className="border flex items-center justify-between px-4 py-3 border-slate-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-all">
                <span className="text-slate-700 font-medium">Pago Móvil</span>
                <input
                  type="radio"
                  name="metodo_pago"
                  value="pago_movil"
                  className="w-4 h-4 text-blue-600"
                />
              </label>

              <label className="border flex items-center justify-between px-4 py-3 border-slate-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-all">
                <span className="text-slate-700 font-medium">
                  Transferencia
                </span>
                <input
                  type="radio"
                  name="metodo_pago"
                  value="transferencia"
                  className="w-4 h-4 text-blue-600"
                />
              </label>

              <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-lg font-medium text-white py-3 rounded-md transition-colors shadow-sm">
                Registrar Venta
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Sales;
