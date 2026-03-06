import { useState } from "react";
import HeaderPortal from "../components/HeaderPortal";
import HeaderSearch from "../components/HeaderSearch";
import Table from "../components/Table/Table";
import Input from "../components/Modal/Input";
import Modal from "../components/Modal/Modal";

function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const handleOpenDeleteModal = (user: any) => {
    setUserName(user.name + " ");
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const handleDeleteUser = () => {
    console.log("Eliminando usuario:", userName);
  };
  const deleteButton = (
    <button
      onClick={handleDeleteUser}
      className="btn bg-red-600 text-white hover:bg-red-700"
    >
      {" "}
      Eliminar{" "}
    </button>
  );

  const [formData, setFormData] = useState({
    ci: "",
    name: "",

    email: "",
    phone: "",
    rol: "",
    salary: "",
  });

  const users = [
    {
      id: 1,
      ci: "31161696",
      name: "Yonathan Nieles",
      email: "yonathannieles011@gmail.com",
      phone: "04164537225",
      rol: "Admin",
      salary: "2000$",
    },
    {
      id: 2,
      ci: "32137510",
      name: "Jesus Cortez",
      email: "jesus@gmail.com",
      phone: "04164342389",
      rol: "Cajero",
      salary: "1600$",
    },
    {
      id: 3,
      ci: "30345431",
      name: "Mauricio Valera",
      email: "mauricio@gmail.com",
      phone: "04125617794",
      rol: "Cajero",
      salary: "1600$",
    },
    {
      id: 4,
      ci: "31532234",
      name: "Fabian Da Cal",
      email: "fabian@gmail.com",
      phone: "04164342389",
      rol: "Supervisor de Pista",
      salary: "1600$",
    },
    {
      id: 5,
      ci: "30444555",
      name: "Jose Vasquez",
      email: "jose@gmail.com",
      phone: "04164342389",
      rol: "Supervisor de Pista",
      salary: "1600$",
    },
    {
      id: 6,
      ci: "29991333",
      name: "Juan Perdomo",
      email: "juan@gmail.com",
      phone: "04164342389",
      rol: "Supervisor de Pista",
      salary: "1600$",
    },
  ];

  const columns = [
    { key: "ci", header: "CI" },
    { key: "name", header: "Nombre" },
    { key: "email", header: "Correo" },
    { key: "phone", header: "Teléfono" },
    { key: "rol", header: "Rol" },
    { key: "actions", header: "Acciones" },
  ];

  return (
    <section className="flex flex-col gap-6 p-4">
      <HeaderPortal>
        <HeaderSearch
          searchPlaceholder="Buscar usuario..."
          buttonText="Agregar Usuario"
          searchTerm={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onAddClick={() => setIsModalOpen(true)}
        />
      </HeaderPortal>

      <section className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-200  hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-rose-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-rose-800"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
                />
                <path d="M22 17.28a2.28 2.28 0 0 1-.662 1.606c-.976.984-1.923 2.01-2.936 2.958a.597.597 0 0 1-.823-.017l-2.918-2.94a2.28 2.28 0 0 1 0-3.214a2.277 2.277 0 0 1 3.233 0l.106.107l.106-.107A2.277 2.277 0 0 1 22 17.28Z" />
                <path strokeLinecap="round" d="M5 20v-1a7 7 0 0 1 10-6.326" />
              </g>
            </svg>
          </div>
          <div className="pr-12">
            <p className="font-medium text-sm text-rose-700">Total Usuarios</p>
            <p className="text-2xl font-bold text-rose-900">24</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-purple-800"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8" />
                <path d="M5 20v-1a7 7 0 0 1 10-6.326M21 22l1-6l-3.5 1.8L17 16l-1.5 1.8L12 16l1 6z" />
              </g>
            </svg>
          </div>
          <div className="pr-20">
            <p className="font-medium text-sm text-purple-500">Admins</p>
            <p className="text-2xl font-bold text-purple-900">1</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-emerald-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-emerald-800"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="1.5"
                strokeWidth="1.5"
              >
                <path d="M12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6m1-6s1-2 1-4s-2-4-2-4s-2 2-2 4s1 4 1 4" />
                <path d="M9 11s-2-1-4-1s-4 2-4 2s2 2 4 2s4-1 4-1m4 2s1 2 1 4s-2 4-2 4s-2-2-2-4s1-4 1-4m4-4s2-1 4-1s4 2 4 2s-2 2-4 2s-4-1-4-1m-4.414-3.828S9.879 7.05 8.464 5.636C7.05 4.222 4.222 4.222 4.222 4.222s0 2.828 1.414 4.243c1.414 1.414 3.536 2.121 3.536 2.121m0 2.828s-2.122.707-3.536 2.122c-1.414 1.414-1.414 4.242-1.414 4.242s2.828 0 4.242-1.414s2.122-3.536 2.122-3.536m4.243-1.414s2.12.707 3.535 2.122c1.414 1.414 1.414 4.242 1.414 4.242s-2.828 0-4.242-1.414s-2.122-3.536-2.122-3.536m0-5.656s.707-2.122 2.122-3.536c1.414-1.414 4.242-1.414 4.242-1.414s0 2.828-1.414 4.243c-1.414 1.414-3.536 2.121-3.536 2.121" />
              </g>
            </svg>
          </div>
          <div className="pr-20">
            <p className="font-medium text-sm text-emerald-500">Activos</p>
            <p className="text-2xl font-bold text-emerald-900">6</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-amber-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-pause-circle text-amber-800"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0z" />
            </svg>
          </div>
          <div className="pr-20">
            <p className="font-medium text-sm text-amber-500">Inactivos</p>
            <p className="text-2xl font-bold text-amber-900">8</p>
          </div>
        </div>
      </section>

      {/* Tabla */}
      <section className="shadow-md rounded-xl overflow-hidden border border-slate-300">
        <div className="bg-white px-6 py-3 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 text-xl tracking-tight">
            Gestión de Usuarios
          </h2>
        </div>

        <Table
          columns={columns}
          data={users}
          onEdit={(user) => {
            setFormData(user);
            setIsModalOpen(true);
          }}
          onDelete={(user) => handleOpenDeleteModal(user)}
          onView={(user) => console.log("Ver usuario:", user)}
          emptyMessage="No hay usuarios registrados"
        />

        <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
          <p className="text-sm font-medium text-slate-500">
            Mostrando{" "}
            <span className="text-slate-900 font-semibold">{users.length}</span>{" "}
            de <span className="text-slate-900 font-semibold">24</span> usuarios
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
                  fillRule="evenodd"
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
                  fillRule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Modal con formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({
            ci: "",
            name: "",
            lastname: "",
            email: "",
            phone: "",
            rol: "",
            salary: "",
          });
        }}
        title="Editar Usuario"
        actions={
          <div className="flex justify-end gap-3">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => {
                console.log("Guardar usuario:", formData);
                setIsModalOpen(false);
              }}
            >
              Guardar Usuario
            </button>
          </div>
        }
      >
        <form className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <Input
              label="Nombre:"
              placeholder="Nombre y Apellido"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e: any) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="col-span-2">
            <Input
              label="Cédula:"
              placeholder="Cédula de Identidad"
              min={1}
              required
              name="ci"
              type="number"
              value={formData.ci}
              onChange={(e: any) =>
                setFormData({ ...formData, ci: e.target.value })
              }
            />
          </div>

          <div className="col-span-2">
            <Input
              label="Correo Electrónico:"
              placeholder="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e: any) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="col-span-2">
            <label className="flex flex-col gap-1">
              <span>Rol</span>
              <select
                className="border border-gray-300 rounded px-3 py-3 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-white text-gray-700 shadow-sm"
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="Rol">Elige un Rol</option>
                <option value="admin">Admin</option>
                <option value="user">Cajero</option>
                <option value="guest">Supervisor de Pista</option>
              </select>
            </label>
          </div>

          <Input
            label="Teléfono:"
            name="phone"
            placeholder="Teléfono"
            type="tel"
            value={formData.phone}
            onChange={(e: any) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <Input
            label="Salario Mensual:"
            placeholder="Salario Mensual"
            name="salary"
            type="text"
            value={formData.salary}
            onChange={(e: any) =>
              setFormData({ ...formData, salary: e.target.value })
            }
          />
        </form>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        deleteText="Eliminar Usuario"
        actions={deleteButton}
      >
        <div className="pt-4">
          <p className="text-center text-slate-700">
            ¿ Estás seguro de que deseas eliminar a{" "}
            <span className="font-semibold text-slate-800">{userName}</span>?
          </p>
        </div>
      </Modal>
    </section>
  );
}

export default Users;
