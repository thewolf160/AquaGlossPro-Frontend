import Alert from "../components/Alert";
import { useClients } from "../hooks/useClients";
import { useEmployees } from "../hooks/useEmployees";
import { usePays } from "../hooks/usePays";
import { useSales } from "../hooks/useSales";
import ErrorAlert from "../components/ErrorAlert";

function Sales() {
  const { clientsData } = useClients();
  const { employeesData } = useEmployees();
  const { paysMethodsData } = usePays();

  const {
    customerVehicle,
    handleSelectChange,
    newSale,
    availableServices,
    availableCombos, // Agregado
    handleTextTareaChange,
    handleEmployeeChange,
    toggleService,
    toggleCombo, // Agregado
    registerSale,
    isSubmitting,
    successMessage,
    error
  } = useSales();

  // Cálculo robusto del Total, Subtotal y Descuentos
  const ticketCalculations = newSale.services.reduce(
    (acc, currentItem) => {
      // 1. Buscamos precio en servicios individuales
      const serviceDetail = availableServices.find(
        (s) =>
          (s.prices[0]?.relationId ?? 0) === currentItem.serviceTypeVehicleId,
      );

      let basePrice = serviceDetail
        ? Number(serviceDetail.prices[0]?.price ?? 0)
        : 0;

      // 2. Si no está en individuales, lo buscamos en los combos
      if (!basePrice) {
        const comboDetail = availableCombos?.find(
          (c) => c.comboId === currentItem.comboOriginId,
        );
        const comboServiceDetail = comboDetail?.combosServices?.find(
          (cs) =>
            (cs.servicesTypeVehicle?.serviceTypeVehicleId || cs.servicesTypeVehicleId) ===
            currentItem.serviceTypeVehicleId,
        );
        basePrice = comboServiceDetail
          ? Number(comboServiceDetail.servicesTypeVehicle?.price ?? 0)
          : 0;
      }

      const discountAmount = currentItem.discount || 0;

      return {
        subtotal: acc.subtotal + basePrice,
        totalDiscount: acc.totalDiscount + discountAmount,
        total: acc.total + (basePrice - discountAmount),
      };
    },
    { subtotal: 0, totalDiscount: 0, total: 0 },
  );

  return (
    <>
      {successMessage && <Alert message={successMessage} />}
      {error.active && <ErrorAlert message={error.msg} />}
      <div className="mb-5 space-y-1 flex flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Registro de Orden
          </h1>
          <p className=" text-slate-500">Nuevo Servicio</p>
        </div>
        <div>
          <button
            onClick={registerSale}
            className="btn bg-blue-600 text-white rounded-lg flex gap-2"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-xl"></span>
            ) : (
              <>
                <i className="bi bi-floppy" />
                Procesar Orden
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gray-50 min-h-screen">
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* 1. IDENTIFICACIÓN */}
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 border-l-4 border-l-blue-600">
            <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">
              1. Identificación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="clientId" className="font-semibold text-slate-700">
                  Cliente
                </label>
                <select
                  name="clientId"
                  id="clientId"
                  onChange={handleSelectChange}
                  value={newSale.clientId || ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in cursor-pointer"
                >
                  <option value="" disabled>
                    -- Selecciona un cliente --
                  </option>
                  {clientsData.data.map((client) => (
                    <option key={client.id} value={client.id ?? ""}>
                      {client.names} {client.lastnames}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="vehicleId" className="font-semibold text-slate-700">
                  Vehículo
                </label>
                <select
                  name="vehicleId"
                  id="vehicleId"
                  onChange={handleSelectChange}
                  disabled={!newSale.clientId}
                  value={newSale.vehicleId || ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in cursor-pointer"
                >
                  <option value="">
                    {newSale.clientId
                      ? "-- Selecciona un vehículo --"
                      : "-- Primero elige un cliente --"}
                  </option>
                  {customerVehicle.map((v) => (
                    <option value={v.id ?? ""} key={v.id}>
                      {v.plate} - {v.typeVehicleName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. CATÁLOGO OPERATIVO Y ASIGNACIÓN */}
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 border-l-4 border-l-blue-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                2. Catálogo Operativo y Asignación
              </h2>
            </div>

            <div className="space-y-4">
              {/* RENDER DE COMBOS */}
              {(availableCombos?.length ?? 0) > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700  mb-3 border-b pb-2">
                    Promociones y Combos
                  </h3>
                  <div className="space-y-3">
                    {availableCombos.map((combo) => {
                      const isSelected = newSale.services.some(
                        (s) => s.comboOriginId === combo.comboId,
                      );

                      const originalTotal = (combo.combosServices ?? []).reduce(
                        (sum, cs) =>
                          sum + Number(cs.servicesTypeVehicle?.price || 0),
                        0,
                      );
                      const discountAmount =
                        originalTotal *
                        (Number(combo.discountPercentage) / 100);
                      const finalPrice = originalTotal - discountAmount;

                      return (
                        <div
                          key={`combo-${combo.comboId}`}
                          className={`p-3 rounded-md shadow-sm border-2 transition-all flex flex-col gap-3 cursor-pointer ${isSelected ? "border-amber-500 bg-amber-50" : "border-slate-300 bg-slate-50"}`}
                          onClick={() =>
                            toggleCombo(
                              combo.comboId,
                              combo.combosServices || [],
                              String(combo.discountPercentage),
                            )
                          }
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className="checkbox checkbox-warning"
                                checked={isSelected}
                                readOnly
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3
                                    className={`font-bold ${isSelected ? "text-amber-900" : "text-slate-800"}`}
                                  >
                                    {combo.name}
                                  </h3>
                                  {combo.isPromotion && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                      PROMO
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500">
                                  Incluye:{" "}
                                  {combo.combosServices
                                    ?.map(
                                      (cs) =>
                                        cs.servicesTypeVehicle?.service?.name,
                                    )
                                    .join(", ")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400 line-through">
                                ${originalTotal.toFixed(2)}
                              </p>
                              <p className="font-bold text-xl text-amber-600">
                                ${finalPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div
                              className="mt-2 pt-3 border-t border-amber-200/50 space-y-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <p className="text-xs font-semibold text-amber-800 mb-2">
                                Asigna al personal para este combo:
                              </p>
                              {combo.combosServices?.map((cs) => {
                                const relationId =
                                  cs.servicesTypeVehicle?.serviceTypeVehicleId || cs.servicesTypeVehicleId || 0;
                                const selectedServiceData =
                                  newSale.services.find(
                                    (s) =>
                                      s.serviceTypeVehicleId === relationId,
                                  );

                                return (
                                  <div
                                    key={relationId}
                                    className="flex justify-between items-center bg-white p-2 rounded border border-amber-100"
                                  >
                                    <span className="text-sm font-medium text-slate-600 w-1/2">
                                      {cs.servicesTypeVehicle?.service?.name}
                                    </span>
                                    <select
                                      value={
                                        selectedServiceData?.employeeId || ""
                                      }
                                      onChange={(e) =>
                                        handleEmployeeChange(
                                          relationId,
                                          Number(e.target.value),
                                        )
                                      }
                                      className="w-1/2 px-2 py-1 text-sm border rounded bg-slate-50 focus:ring-2 focus:ring-amber-500"
                                    >
                                      <option value="" disabled>
                                        -- Asignar a --
                                      </option>
                                      {employeesData.data.map((emp) => (
                                        <option
                                          value={emp.id ?? ""}
                                          key={emp.id}
                                        >
                                          {emp.names} {emp.lastnames}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* RENDER DE SERVICIOS INDIVIDUALES */}
              <h3 className="font-semibold text-slate-700  mb-3 border-b pb-2">
                Servicios Individuales
              </h3>
              {availableServices.map((ser) => {
                const relationId = ser.prices[0]?.relationId ?? 0;
                const selectedServiceData = newSale.services?.find(
                  (s) => s.serviceTypeVehicleId === relationId,
                );
                const isSelected = !!selectedServiceData;

                // Ocultamos el servicio individual si ya fue seleccionado vía combo para no duplicar
                if (selectedServiceData?.comboOriginId !== undefined)
                  return null;

                return (
                  <div
                    key={ser.id}
                    onClick={() => toggleService(relationId)}
                    className={`p-2 rounded-md shadow-sm border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 cursor-pointer ${isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-300 bg-slate-50"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-md"
                        checked={isSelected}
                        readOnly
                      />
                      <div className="flex flex-col ">
                        <h3
                          className={`font-medium ${isSelected ? "text-blue-900" : "text-slate-800"}`}
                        >
                          {ser.name}
                        </h3>
                        <p className="text-slate-500 lowercase">
                          {ser.category}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-xl">
                        ${ser.prices[0]?.price || "0.00"}
                      </p>
                    </div>

                    <div>
                      <select
                        value={selectedServiceData?.employeeId || ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleEmployeeChange(
                            relationId,
                            Number(e.target.value),
                          )
                        }
                        disabled={!isSelected}
                        className={`w-full px-3 py-2 border rounded-md shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in ${isSelected
                            ? "bg-white border-blue-300 cursor-pointer"
                            : "bg-white border-slate-300 cursor-not-allowed opacity-70"
                          }`}
                      >
                        <option value="" disabled>
                          -- Seleccione un trabajador --
                        </option>
                        {employeesData.data.map((employee) => (
                          <option value={employee.id ?? ""} key={employee.id}>
                            {employee.names} {employee.lastnames}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 Y 4. TRANSACCIÓN Y OBSERVACIONES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 border-l-4 border-l-blue-600">
              <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">
                3. Transacción
              </h2>
              <div className="flex flex-col gap-2">
                <label htmlFor="paymentMethodId" className="font-semibold text-slate-700">
                  Método de Pago
                </label>
                <select
                  name="paymentMethodId"
                  id="paymentMethodId"
                  onChange={handleSelectChange}
                  value={newSale.paymentMethodId || ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in cursor-pointer"
                >
                  <option value="" disabled>
                    -- Seleccione un método --
                  </option>
                  {paysMethodsData.data.map((pay) => (
                    <option value={pay.id ?? ""} key={pay.id}>
                      {pay.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 border-l-4 border-l-blue-600">
              <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">
                4. Observaciones
              </h2>
              <div>
                <textarea
                  name="initialState"
                  id="initialState"
                  onChange={handleTextTareaChange}
                  value={newSale.initialState}
                  className="border border-slate-300 w-full shadow-md bg-slate-50 p-2 focus:ring-2 focus:outline-none focus:ring-blue-500 transition-all ease-in rounded-md h-20 resize-none"
                  placeholder="Estado inicial del vehiculo..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* 5. RESUMEN (TICKET) */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-white rounded-md shadow-sm border border-gray-100 flex flex-col">
          <div className="grow">
            <div className="p-4 border-b border-slate-200 mb-4">
              <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1">
                5. RESUMEN
              </h2>
              <h1 className="text-2xl font-bold text-slate-800 ">
                Ticket de Orden
              </h1>
            </div>

            <div className="space-y-4">
              {newSale.services.length === 0 ? (
                <div className="text-center p-6 m-4 border-2 border-dashed border-slate-200 rounded-md">
                  <p className="text-sm text-slate-500">
                    Agrega servicios para ver el resumen
                  </p>
                </div>
              ) : (
                newSale.services.map((selectedItem, index) => {
                  let serviceName = "Servicio Desconocido";
                  let basePrice = 0;
                  let isComboItem = false;

                  // Buscar nombre/precio en individuales
                  const individualSvc = availableServices.find(
                    (s) =>
                      (s.prices[0]?.relationId ?? 0) ===
                      selectedItem.serviceTypeVehicleId,
                  );

                  if (individualSvc) {
                    serviceName = individualSvc.name;
                    basePrice = Number(individualSvc.prices[0]?.price ?? 0);
                  } else {
                    // Si no está, buscar en combos
                    const comboSvc = availableCombos?.find(
                      (c) => c.comboId === selectedItem.comboOriginId,
                    );
                    const internalSvc = comboSvc?.combosServices?.find(
                      (cs) =>
                        (cs.servicesTypeVehicle?.serviceTypeVehicleId || cs.servicesTypeVehicleId) ===
                        selectedItem.serviceTypeVehicleId,
                    );

                    if (internalSvc) {
                      serviceName =
                        internalSvc.servicesTypeVehicle?.service?.name ||
                        "Servicio de Combo";
                      basePrice = Number(
                        internalSvc.servicesTypeVehicle?.price ?? 0,
                      );
                      isComboItem = true;
                    }
                  }

                  const employeeDetail = employeesData.data.find(
                    (e) => e.id === selectedItem.employeeId,
                  );
                  const finalItemPrice =
                    basePrice - (selectedItem.discount || 0);

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="px-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-slate-800">
                            {serviceName}
                          </h4>
                          {isComboItem && (
                            <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 rounded uppercase font-bold">
                              En Combo
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-xs mt-1 ${employeeDetail ? "text-slate-500" : "text-red-500 font-medium"}`}
                        >
                          {employeeDetail ? (
                            <p>
                              {" "}
                              <i className="bi bi-person" />{" "}
                              {employeeDetail.names} {employeeDetail.lastnames}
                            </p>
                          ) : (
                            <p>
                              {" "}
                              <i className="bi bi-person-fill-x" /> Empleado sin
                              asignar
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-sm text-slate-800 p-4">
                        ${finalItemPrice.toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-6 border-t border-dashed border-gray-200 bg-gray-50/50 rounded-b-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-500 font-medium tracking-wider text-sm">
                Subtotal
              </span>
              <span className="text-lg font-semibold text-slate-700">
                ${ticketCalculations.subtotal.toFixed(2)}
              </span>
            </div>

            {ticketCalculations.totalDiscount > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-amber-600 font-bold text-sm">
                  Descuento (Combos)
                </span>
                <span className="text-amber-600 font-bold">
                  -${ticketCalculations.totalDiscount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-slate-800 font-bold uppercase tracking-wider">
                Total
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ${ticketCalculations.total.toFixed(2)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Sales;
