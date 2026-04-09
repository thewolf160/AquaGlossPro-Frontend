import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import type { Item } from "../types/models";
import Table from "../components/Table/Table";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/Input";
import { Link } from "react-router-dom";
import ActionButton from "../components/Modal/ActionButton";
import { useTypesVehicles } from "../hooks/useTypesVehicles";
import { useModals } from "../hooks/useModals";

const columns = [
  { key: "plate", header: "Placa", mobile: true },
  { key: "vehicle_type", header: "Tipo", mobile: false },
  { key: "owner", header: "Cliente Propietario", mobile: true },
  { key: "actions", header: "Acciones", mobile: true },
];

const data = [
  {
    id: 1,
    plate: "ABC-1234",
    vehicle_type: "Camioneta",
    owner: "Alexandra Nieves",
  },
];

function Vehicles() {
  const {toggleModal, modals} = useModals()

  const { typesVehiclesData } = useTypesVehicles();



  const handleOpenRegister = () => {
    toggleModal("register", true)
  };

  const handleCloseRegister = () => {
    toggleModal("register", false)
  };

  const handleOpenDelete = (item: Item) => {
    toggleModal("delete", true)
  };

  const handleCloseDelete = () => {
    toggleModal("delete", false)
  };

  const handleOpenEdit = (item: Item) => {
    toggleModal("edit", true)
  };

  const handleCloseEdit = () => {
    toggleModal("edit", false)  
  };

  const searchTerm: string = "";

  const handleSearch = () => {
    console.log("Buscar...");
  };

  return (
    <>
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar Vehiculo..."
          buttonText="Agregar Vehiculo"
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onAddClick={handleOpenRegister}
        />
      </HeaderPortal>
      <div className="flex flex-col gap-6">
        <section className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200  hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-car-front-fill text-blue-800"
                viewBox="0 0 16 16"
              >
                <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-blue-700">
                Total Vehiculos
              </p>
              <p className="text-2xl font-bold text-blue-900">20</p>
            </div>
          </div>
        </section>
        <section className="shadow-md rounded-xl overflow-hidden border border-slate-200">
          <div className="bg-white px-6 py-3 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">
              Gestión de Vehiculos
            </h2>
          </div>
          <Table
            columns={columns}
            data={data}
            onDelete={handleOpenDelete}
            onEdit={handleOpenEdit}
          />
          <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
            <p className="text-sm text-slate-500">Página 1 de 2</p>
            <div className="join gap-2">
              <button className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-arrow-left-short"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
                  />
                </svg>
                Anterior
              </button>
              <button className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1">
                Siguiente
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-arrow-right-short"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>
      <Modal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        title="Registro de Nuevo Vehículo"
        actions={<ActionButton type="register" />}
      >
        <form className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="vehicle_type"
                className="block text-sm font-medium text-slate-700"
              >
                Tipo de Vehículo:
              </label>
              <select
                defaultValue="-- Selecciona uno--"  
                name="vehicle_type"
                id="vehicle_type"
                className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
              >
                <option value="" disabled>
                  -- Selecciona una opción--
                </option>
                {typesVehiclesData.data.map((typeVehicle) => (
                  <option key={typeVehicle.id} value={typeVehicle.id || ""}>
                    {typeVehicle.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              name="plate"
              label="Placa:"
              type="text"
              placeholder="Ej: ABC-123"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              name="owner"
              label="Cliente:"
              type="text"
              placeholder="Buscar Cliente..."
              icon={<i className="bi bi-search text-xl" />}
            />
            <p className="text-sm text-slate-500 px-2">
              ¿No encuentras al Cliente?{" "}
              <Link to="/clients" className="text-blue-400 hover:text-blue-500">
                Crear Nuevo Cliente
              </Link>
            </p>
          </div>
        </form>
      </Modal>
      <Modal isOpen={modals.delete} onClose={handleCloseDelete}>
        <div className="pt-4">
          <p className="text-center text-slate-700">
            ¿Estás seguro de que deseas eliminar el vehiculo{" "}
            <span className="font-semibold text-slate-800">

            </span>
            ?
          </p>
        </div>
      </Modal>
      <Modal
        isOpen={modals.edit}
        onClose={handleCloseEdit}
        title="Editar Vehículo"
      >
        <form className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="vehicle_type"
                className="block text-sm font-medium text-slate-700"
              >
                Tipo de Vehículo:
              </label>
              <select
                defaultValue="-- Selecciona uno--"
                name="vehicle_type"
                id="vehicle_type"

                className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in "
              >
                <option value="" disabled={true}>
                  -- Selecciona uno--
                </option>
                <option value="Carro">Carro</option>
                <option value="Moto">Moto</option>
                <option value="Camioneta">Camioneta</option>
              </select>
            </div>
            <Input
              name="plate"
              label="Placa:"
              type="text"
              placeholder="Ej: ABC-123"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              name="owner"
              label="Cliente:"
              type="text"
              placeholder="Buscar Cliente..."
              icon={<i className="bi bi-search text-xl"/>}
            />
            <p className="text-sm text-slate-500 px-2">
              ¿No encuentras al Cliente?{" "}
              <Link to="" className="text-blue-400 hover:text-blue-500">
                Crear Nuevo Cliente
              </Link>
            </p>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Vehicles;
