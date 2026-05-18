import { useState } from "react";
import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import AddServiceModal from "../components/service/AddServiceModal";
import EditServiceModal from "../components/service/EditServiceModal";
import DeleteServiceModal from "../components/service/DeleteServiceModal";
import ServicePricesModal from "../components/service/ServicePricesModal";
import { useCatalog } from "../hooks/useCatalog";
import type { CatalogService, CatalogServicePrice, ComboApi, CreateServicePayload } from "../types/catalog.types";
import type { ColumnsProps } from "../components/Table/Table.types";
import AddComboModal from "../components/service/AddComboModal";
import EditComboModal from "../components/service/EditComboModal";
import DeleteComboModal from "../components/service/DeleteComboModal";
import { hasPermission } from "../utils/checkPermissions.utils";
import RestoreServiceModal from "../components/service/RestoreServiceModal";
import RestoreComboModal from "../components/service/RestoreComboModal";

export default function ServiceCatalog() {
  const {
    services, combos, categories, isLoading, isSubmitting,
    searchTerm, setSearchTerm, newServiceForm, handleChange, createService,
    deleteService, updateService, saveServicePrices, restoreService,
    isActiveServices, setIsActiveServices,
    isActiveCombos, setIsActiveCombos,
    newComboForm, handleComboChange, toggleServiceInCombo, createCombo,
    deleteCombo, editCombo, restoreCombo,
    currentPage, setCurrentPage, totalPages
  } = useCatalog();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPricesModalOpen, setIsPricesModalOpen] = useState(false);
  const [isAddComboModalOpen, setIsAddComboModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<ComboApi | null>(null);
  const [isEditComboModalOpen, setIsEditComboModalOpen] = useState(false);
  const [isDeleteComboModalOpen, setIsDeleteComboModalOpen] = useState(false);
  const [isRestoreComboModalOpen, setIsRestoreComboModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<CatalogService | null>(null);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    const success = await createService(e);
    if (success) setIsAddModalOpen(false);
  };

  const handleDeleteSubmit = async (id: number) => {
    const success = await deleteService(id);
    if (success) setIsDeleteModalOpen(false);
  };

  const handleRestoreSubmit = async (id: number) => {
    const success = await restoreService(id);
    if (success) setIsRestoreModalOpen(false);
  };

  const handleEditSubmit = async (id: number, payload: Partial<CreateServicePayload>) => {
    const success = await updateService(id, payload);
    if (success) setIsEditModalOpen(false);
  };

  const handleSavePrices = async (serviceId: number, updatedPrices: CatalogServicePrice[]) => {
    const success = await saveServicePrices(serviceId, updatedPrices);
    if (success) setIsPricesModalOpen(false);
  };

  const columns: ColumnsProps[] = [
    {
      header: "Servicio",
      key: "name",
      mobile: true,
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        return (
          <div className="text-left flex flex-col min-w-[120px]">
            <span className="font-bold text-gray-800 leading-tight">{servicio.name}</span>
            <span className="text-[10px] font-medium text-blue-600 mt-0.5">Comisión: {servicio.comissionPercentage}%</span>

            <span className="mt-1 sm:hidden px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-medium w-fit border border-slate-200">
              {servicio.category}
            </span>
          </div>
        );
      }
    },
    {
      header: "Categoría",
      key: "category",
      mobile: false,
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
            {servicio.category}
          </span>
        );
      }
    },
    {
      header: "Tarifas por Vehículo",
      key: "prices",
      mobile: false,
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        return (
          <div className="flex flex-col gap-1 text-xs mx-auto w-fit">
            {servicio.prices.map((p) => (
              <div key={p.typeVehicleId} className="flex items-center justify-between gap-4 w-full border-b border-slate-100 last:border-0 pb-1 last:pb-0">
                <span className="text-slate-500 text-left w-20 truncate" title={p.typeVehicleName}>
                  <i className="bi bi-car-front mr-1"></i> {p.typeVehicleName}:
                </span>
                <span className="font-bold text-slate-800 text-right">
                  {p.price !== null ? `$${p.price.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      header: "Acciones",
      key: "actions",
      mobile: true,
      render: (item: Item) => {
        const servicio = item as unknown as CatalogService;
        return (
          <div className="flex justify-center items-center gap-1.5 md:gap-2">
            {isActiveServices ? (
              <>
                <button
                  onClick={() => {
                    setSelectedService(servicio);
                    setIsPricesModalOpen(true);
                  }}
                  className="bg-green-50 rounded-md text-green-600 hover:bg-green-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                  title="Configurar Tarifas"
                >
                  <i className="bi bi-tags-fill"></i>
                </button>
                <button
                  onClick={() => {
                    setSelectedService(servicio);
                    setIsEditModalOpen(true);
                  }}
                  className="bg-sky-50 rounded-md text-sky-600 hover:bg-sky-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                  title="Editar Servicio"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  onClick={() => {
                    setSelectedService(servicio);
                    setIsDeleteModalOpen(true);
                  }}
                  className="bg-red-50 rounded-md text-red-500 hover:bg-red-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                  title="Eliminar Servicio"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setSelectedService(servicio);
                  setIsRestoreModalOpen(true);
                }}
                className="bg-green-100 rounded-md text-green-600 hover:bg-green-200 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                title="Restaurar Servicio"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in w-full">
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar Servicio o Categoría..."
          buttonText={hasPermission("SERVICES", "C") ? "Agregar Servicio" : undefined}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      </HeaderPortal>

      {/* ── Sección Servicios ── */}
      <section className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 w-full overflow-hidden">
        <div className="mb-4 px-2 md:px-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Servicios Individuales</h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsActiveServices(true)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${isActiveServices ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Activos
            </button>
            <button
              onClick={() => setIsActiveServices(false)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${!isActiveServices ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Inactivos
            </button>
          </div>
        </div>

        <div className="shadow-sm rounded-xl overflow-hidden border border-slate-200 w-full relative min-h-[300px]">
          {isLoading && services.length === 0 ? (
            <div className="flex items-center justify-center p-10 h-full">
              <span className="loading loading-spinner loading-xl text-blue-600"></span>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px] transition-all">
                  <span className="loading loading-spinner loading-lg text-blue-600"></span>
                </div>
              )}
              <Table
                columns={columns}
                data={services}
                emptyMessage={searchTerm ? "No hay servicios..." : "No hay servicios registrados."}
              />
              <div className="bg-slate-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 gap-3">
                <p className="text-sm text-slate-500">Página {currentPage} de {totalPages || 1}</p>
                <div className="join gap-2">
                  <button
                    className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                    disabled={currentPage === 1 || isLoading}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    <i className="bi bi-arrow-left-short text-xl" />
                    Anterior
                  </button>
                  <button
                    className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                    disabled={currentPage === totalPages || isLoading}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Siguiente
                    <i className="bi bi-arrow-right-short text-xl" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Sección Combos ── */}
      <section className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 w-full overflow-hidden">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6 px-2 md:px-0">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Paquetes y Combos</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Toggle activos/inactivos combos */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setIsActiveCombos(true)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${isActiveCombos ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Activos
              </button>
              <button
                onClick={() => setIsActiveCombos(false)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${!isActiveCombos ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Inactivos
              </button>
            </div>
            <button
              onClick={() => setIsAddComboModalOpen(true)}
              className="flex-1 sm:flex-none bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm md:text-base font-medium hover:bg-yellow-600 transition-colors border-none flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <i className="bi bi-plus-lg"></i> Crear Combo
            </button>
          </div>
        </div>

        {isLoading && combos.length === 0 ? (
          <div className="flex items-center justify-center p-10">
            <span className="loading loading-spinner loading-xl text-yellow-500"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px] transition-all rounded-xl">
                <span className="loading loading-spinner loading-lg text-yellow-500"></span>
              </div>
            )}
            {combos.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-400 text-sm">
                No hay combos {isActiveCombos ? "activos" : "inactivos"}.
              </div>
            ) : combos.map((combo: ComboApi) => {
              const uniqueServices = Array.from(new Set(combo.combosServices?.map(cs => cs.servicesTypeVehicle.service.name) || []));

              return (
                <div key={combo.comboId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
                  {combo.isPromotion ? (
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-red-500  via-green-500 to-blue-500"></div>
                  ) :
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500  via-blue-500 to-blue-500"></div>
                  }

                  <h3 className="text-base md:text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3">
                    {combo.name}
                  </h3>

                  <div className="flex-1 mb-4 flex flex-col gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                      <p className="text-[10px] md:text-xs uppercase tracking-wider font-bold">
                        {combo.isPromotion ? (
                          <span className="bg-linear-to-r from-red-500 via-green-500 to-blue-500 text-transparent bg-clip-text">
                            Promoción Especial
                          </span>
                        ) : <span className="text-gray-600">Descuento Base</span>}
                      </p>
                      <p className="text-base md:text-lg font-black text-green-600">
                        - {combo.discountPercentage}%
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-800 font-bold mb-1.5 uppercase tracking-wider">Servicios Incluidos:</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {uniqueServices.length > 0 ? uniqueServices.map((srv, idx) => (
                          <li key={idx} className="bg-blue-50 text-gray-500 text-[10px] md:text-[11px] px-2 py-1 rounded-md font-extrabold border border-blue-100">
                            {srv}
                          </li>
                        )) : <span className="text-xs text-gray-400">Sin servicios</span>}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      {isActiveCombos ? (
                        <>
                          <button
                            onClick={() => { setSelectedCombo(combo); setIsEditComboModalOpen(true); }}
                            className="bg-sky-50 rounded-md text-sky-600 hover:bg-sky-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                            title="Editar Combo"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            onClick={() => { setSelectedCombo(combo); setIsDeleteComboModalOpen(true); }}
                            className="bg-red-50 rounded-md text-red-500 hover:bg-red-100 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                            title="Eliminar Combo"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { setSelectedCombo(combo); setIsRestoreComboModalOpen(true); }}
                          className="bg-green-100 rounded-md text-green-600 hover:bg-green-200 transition-all cursor-pointer px-2.5 py-2.5 shadow-sm"
                          title="Restaurar Combo"
                        >
                          <i className="bi bi-arrow-clockwise"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        formState={newServiceForm}
        categories={categories}
        onChange={handleChange}
        onSubmit={handleCreateSubmit}
        isLoading={isSubmitting}
      />

      <ServicePricesModal
        isOpen={isPricesModalOpen}
        onClose={() => setIsPricesModalOpen(false)}
        service={selectedService}
        onSave={handleSavePrices}
        isLoading={isSubmitting}
      />

      <EditServiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingService={selectedService}
        categories={categories}
        onEdit={handleEditSubmit}
        isLoading={isSubmitting}
      />

      <DeleteServiceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        deletingService={selectedService}
        onDelete={handleDeleteSubmit}
        isLoading={isSubmitting}
      />

      <RestoreServiceModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        restoringService={selectedService}
        onRestore={handleRestoreSubmit}
        isLoading={isSubmitting}
      />

      <AddComboModal
        isOpen={isAddComboModalOpen}
        onClose={() => setIsAddComboModalOpen(false)}
        formState={newComboForm}
        services={services}
        onChange={handleComboChange}
        onToggleService={toggleServiceInCombo}
        onSubmit={async (e) => {
          const success = await createCombo(e);
          if (success) setIsAddComboModalOpen(false);
        }}
        isLoading={isSubmitting}
      />

      <EditComboModal
        isOpen={isEditComboModalOpen}
        onClose={() => setIsEditComboModalOpen(false)}
        combo={selectedCombo}
        services={services}
        onEdit={editCombo}
        isLoading={isSubmitting}
      />

      <DeleteComboModal
        isOpen={isDeleteComboModalOpen}
        onClose={() => setIsDeleteComboModalOpen(false)}
        deletingCombo={selectedCombo}
        onDelete={deleteCombo}
        isLoading={isSubmitting}
      />

      <RestoreComboModal
        isOpen={isRestoreComboModalOpen}
        onClose={() => setIsRestoreComboModalOpen(false)}
        restoringCombo={selectedCombo}
        onRestore={restoreCombo}
        isLoading={isSubmitting}
      />
    </div>
  );
}