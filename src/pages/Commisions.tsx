import Table from "../components/Table/Table";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import { useCommissions } from "../hooks/useCommissions";
import type { Item } from "../types/models";
import { useModals } from "../hooks/useModals";
import { InitialCommission } from "../types/commissions.types";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/Input";
import Alert from "../components/Alert";

const columnsCommissions = [
  { key: "ci", header: "CI", mobile: true },
  { key: "names", header: "Nombre", mobile: false },
  { key: "lastnames", header: "Apellido", mobile: false },
  { key: "conmissionTotal", header: "Comisión", mobile: true },
  { key: "statusPaymentConmission", header: "Estado", mobile: false },
  { key: "actions", header: "Acciones", mobile: true },
];

function Commissions() {
  const {
    commissionsData,
    isLoadingCommissions,
    currentPageCommissions,
    setCurrentPageCommissions,
    totalPagesCommissions,
    searchParameter,
    handleSearchChange,
    currentCommission,
    setCurrentCommission,
    statusPay,
    setSuccessMessage,
    successMessage,
    statusCanceled
  } = useCommissions();

  const {
    toggleModal,
    modals
  } = useModals()

  const handleOpenDetails = (item: Item) => {
    toggleModal("details", true)
    setCurrentCommission((prev) => ({
      ...prev,
      ...item
    }))
  }

  const handleCloseDetails = () => {
    toggleModal("details", false)
    setCurrentCommission(InitialCommission)
  }

  const handleOpenEdit = (item: Item) => {
    toggleModal("edit", true)
    setCurrentCommission((prev) => ({
      ...prev,
      ...item
    }))
  }

  const handleCloseEdit = () => {
    toggleModal("edit", false)
     setCurrentCommission(InitialCommission)
  }

  const handlePay = async () => {
    const success = await statusPay(String(currentCommission.id))
    if(success){
      handleCloseEdit()
      setSuccessMessage("Estado Cambiado con Éxito")
      setTimeout(() => {
        setSuccessMessage(null)
      },3000)
    }
  }

  const handleCanceled = async () => {
    const success = await statusCanceled(String(currentCommission.id))
    if(success){
      handleCloseEdit()
      setSuccessMessage("Estado Cambiado con Éxito")
      setTimeout(() => {
        setSuccessMessage(null)
      },3000)
    }
  }

  return (
    <>
    {successMessage && (<Alert message={successMessage}/> )}
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar comisión..."
          searchTerm={searchParameter}
          onSearchChange={handleSearchChange}
        />
      </HeaderPortal>

      <div className="flex flex-col gap-6">
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200  hover:shadow-md transition-shadow flex items-center gap-4">

            <div>
              <p className="font-medium text-sm text-green-700">
                Pagados
              </p>
              <p className="text-2xl font-bold text-green-900">
                {commissionsData.totalPaid}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-shadow flex items-center gap-4">

            <div>
              <p className="font-medium text-sm text-yellow-500">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-900">
                {commissionsData.totalPending}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-shadow flex items-center gap-4">

            <div>
              <p className="font-medium text-sm text-red-500">Cancelados</p>
              <p className="text-2xl font-bold text-red-900">
                {commissionsData.totalCancelled}
              </p>
            </div>
          </div>
        </section>
        <section className="shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <div className="bg-white px-6 py-3 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">
              Registro de Comisiones
            </h2>
          </div>
          <div>
            {isLoadingCommissions ? (
              <div className="flex items-center justify-center p-10">
                <span className="loading loading-spinner loading-xl"></span>
              </div>
            ) : (
              <Table
                columns={columnsCommissions}
                data={commissionsData.data}
                onView={handleOpenDetails}
                onEdit={handleOpenEdit}
                canEdit={(item: any) => item.statusPaymentConmission === 'W'}
              />
            )}
          </div>
          <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Página <span className="font-bold">{currentPageCommissions}</span> de{" "}
              <span className="font-bold">{totalPagesCommissions}</span>
            </p>
            <div className="join gap-2">
              <button
                className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1"
                onClick={() => setCurrentPageCommissions(currentPageCommissions - 1)}
                disabled={currentPageCommissions === 1 || isLoadingCommissions}
              >
                <i className="bi bi-arrow-left-short text-xl" />
                Anterior
              </button>
              <button
                className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1"
                onClick={() => setCurrentPageCommissions(currentPageCommissions + 1)}
                disabled={currentPageCommissions === totalPagesCommissions || isLoadingCommissions}
              >
                Siguiente
                <i className="bi bi-arrow-right-short text-xl" />
              </button>
            </div>
          </div>
        </section>
      </div>
      <Modal
        isOpen={modals.details}
        onClose={handleCloseDetails}
        title="Detalles de Empleado"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              label="Nombre:"
              type="text"
              value={currentCommission.names}
              readOnly
            />
            <Input
              name="lastname"
              label="Apellido:"
              type="text"
              value={currentCommission.lastnames}
              readOnly
            />
          </div>
          <div>
            <Input
              name="ci"
              label="Cédula:"
              type="number"
              value={currentCommission.ci}
              icon={<i className="bi bi-person-vcard text-xl"></i>}
              readOnly
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="conmissionTotal"
              label="Comisión Total:"
              type="text"
              value={currentCommission.conmissionTotal}
              readOnly
              icon={<i className="bi bi-cash text-xl"></i>}
            />
            <Input
              name="statusPaymentConmission"
              label="Estado:"
              type="text"
              value={currentCommission.statusPaymentConmission}
              readOnly
            />
          </div>

        </div>
      </Modal>
      <Modal
        onClose={handleCloseEdit}
        isOpen={modals.edit}
        title="Actualizar Estado de Comisión"
      >
        <div className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-md p-4 text-center">
          <p className="uppercase text-md text-slate-500 font-semibold">Monto a Liquidar</p>
          <p className="text-2xl text-blue-500 font-bold">{currentCommission.conmissionTotal}</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <button onClick={handlePay} className="btn bg-green-500 hover:bg-green-600 text-white"><i className="bi bi-check-circle-fill"></i> Pagado</button>
          <button onClick={handleCanceled} className="btn bg-red-500 hover:bg-red-600 text-white"><i className="bi bi-x-circle-fill"></i>Cancelado</button>
        </div>
        </div>
      </Modal>
    </>
  );
}

export default Commissions;