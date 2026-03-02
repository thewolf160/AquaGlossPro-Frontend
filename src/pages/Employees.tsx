import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import { useState } from "react";
import Modal from "../components/Modal/Modal";
import Input from "../components/Input";

function Employees() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState<boolean>(false);
  const [isDeleteModalOpen, setISDeleteModalOpen] = useState<boolean>(false);

  const [employeeName, setEmployeeName] = useState<string>("");

  const columns = [
    { key: "ci", header: "CI" },
    { key: "name", header: "Nombre" },
    { key: "email", header: "Email" },
    { key: "phone_number", header: "Número de Teléfono" },
    { key: "salary", header: "Salario" },
    { key: "actions", header: "Acciones" },
  ];

  const handleEdit = (item: Item) => {
    console.log(`Restaurar a ${item.name}`);
  };

  // const handleView = (item: Item) => {
  //   console.log(`Ver a: ${item.name}`);
  // };

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleOpenDeleteModal = (item: Item) => {
    setISDeleteModalOpen(true);
    setEmployeeName(item.name);
  };

  const handleCloseDeleteModal = () => {
    setISDeleteModalOpen(false);
  };

  const searchTerm = "";

  const handleSearch = () => {
    console.log("buscando...");
  };

  const registerButton = (
    <button className="btn bg-blue-500 hover:bg-blue-600 text-white transition-all ease-in">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-floppy"
        viewBox="0 0 16 16"
      >
        <path d="M11 2H9v3h2z" />
        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
      </svg>
      Guardar Empleado
    </button>
  );

  const deleteButton = (
    <button className="btn bg-red-600 text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-trash3-fill"
        viewBox="0 0 16 16"
      >
        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
      </svg>
      Eliminar
    </button>
  );

  const data = [
    {
      id: 1,
      name: "Yonathan Nieles",
      ci: "31161696",
      email: "yonathannieles011@gmail.com",
      phone_number: "04164537225",
      salary: "1200$",
    },
    {
      id: 2,
      name: "Jesus Cortez",
      ci: "32137510",
      email: "jesus@gmail.com",
      phone_number: "04164342389",
      salary: "900$",
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-6">
        <HeaderPortal>
          <HeaderSearch
            searchPlaceholder="Buscar empleado..."
            buttonText="Agregar Empleado"
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onAddClick={handleOpenRegisterModal}
          />
        </HeaderPortal>
        <section className="flex flex-row gap-5">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200  hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-people-fill text-blue-800"
                viewBox="0 0 16 16"
              >
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
              </svg>
            </div>
            <div className="pr-12">
              <p className="font-medium text-sm text-blue-700">
                Total Empleados
              </p>
              <p className="text-2xl font-bold text-blue-900">24</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-pause-circle text-yellow-800"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0z" />
              </svg>
            </div>
            <div className="pr-20">
              <p className="font-medium text-sm text-yellow-500">Inactivos</p>
              <p className="text-2xl font-bold text-yellow-900">8</p>
            </div>
          </div>
        </section>
        <section className="shadow-md rounded-xl overflow-hidden border border-slate-300">
          <div className=" bg-white px-6 py-3 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">
              Gestión de Empleados
            </h2>
          </div>
          <Table
            columns={columns}
            data={data}
            onDelete={handleOpenDeleteModal}
            onEdit={handleEdit}
          />
          <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
            <p className="text-sm font-medium text-slate-500">
              Mostrando <span className="text-slate-900 font-semibold">2</span>{" "}
              de <span className="text-slate-900 font-semibold"> 24</span>{" "}
              empleados
            </p>
            <div className="join gap-1">
              <button className="join-item py-2 px-3">
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
              </button>
              <button className="join-item py-2 px-3">
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
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        title="Registro de Nuevo Empleado"
        actions={registerButton}
      >
        <div>
          <form className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="name"
                label="Nombre:"
                type="text"
                placeholder="Ej. Juan"
              />
              <Input
                name="lastname"
                label="Apellido:"
                type="text"
                placeholder="Ej. Pérez"
              />
            </div>
            <div>
              <Input
                name="ci"
                label="Cédula:"
                type="number"
                placeholder="0000000"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-person-vcard"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
                  </svg>
                }
              />
            </div>
            <div>
              <Input
                name="email"
                label="Correo Electrónico:"
                type="email"
                placeholder="juan.perez@gmail.com"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-envelope"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                  </svg>
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="phone"
                label="Télefono:"
                type="number"
                placeholder="00000000000"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-telephone"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                  </svg>
                }
              />
              <Input
                name="salary"
                label="Salario Mensual:"
                type="number"
                placeholder="0.00$"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-cash-coin"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"
                    />
                    <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z" />
                    <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z" />
                    <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567" />
                  </svg>
                }
              />
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        deleteText="Eliminar Empleado"
        actions={deleteButton}
      >
        <div className="pt-4">
          <p className="text-center text-slate-700">
            ¿Estás seguro de que deseas eliminar a{" "}
            <span className="font-semibold text-slate-800">{employeeName}</span>
            ?
          </p>
        </div>
      </Modal>
    </>
  );
}

export default Employees;
