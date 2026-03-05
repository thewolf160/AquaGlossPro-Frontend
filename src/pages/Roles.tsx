import { useState, useMemo } from "react";
import HeaderSearch from "../components/HeaderSearch";
import HeaderPortal from "../components/HeaderPortal";

const columns = [
  { key: "ci", header: "Cédula" },
  { key: "name", header: "Nombre" },
  { key: "lastname", header: "Apellido" },
  { key: "email", header: "Correo electrónico" },
  { key: "phone", header: "Número de Teléfono" },
  { key: "role", header: "Rol" },
  { key: "access", header: "Accesos" },
];

const mockData = [
  {
    ci: "31161696",
    name: "Yonathan",
    lastname: "Nieles",
    email: "yonathannieles011@gmail.com",
    phone: "04164537225",
    role: "Admin",
    access: [
      "Vehículos",
      "Inventario",
      "Empleados",
      "Usuarios",
      "Servicios",
      "Ventas",
    ],
  },
  {
    ci: "32137510",
    name: "Jesus",
    lastname: "Cortez",
    email: "jesus@gmail.com",
    phone: "04164342389",
    role: "Cajero",
    access: ["Ventas"],
  },
  {
    ci: "30345431",
    name: "Mauricio",
    lastname: "Valera",
    email: "mauricio@gmail.com",
    phone: "04125617794",
    role: "Cajero",
    access: ["Ventas"],
  },
  {
    ci: "31532234",
    name: "Fabian",
    lastname: "Da Cal",
    email: "fabian@gmail.com",
    phone: "04125500956",
    role: "Supervisor de pista",
    access: ["Vehículos", "Empleados"],
  },
  {
    ci: "29991333",
    name: "Juan",
    lastname: "Perdomo",
    email: "juan@gmail.com",
    phone: "04164537225",
    role: "Supervisor de pista",
    access: ["Vehículos", "Empleados"],
  },
  {
    ci: "30444555",
    name: "Jose",
    lastname: "Vasquez",
    email: "jose@gmail.com",
    phone: "04164537225",
    role: "Supervisor de pista",
    access: ["Vehículos", "Empleados"],
  },
];

const roleDefaults: Record<string, string[]> = {
  Admin: [
    "Vehículos",
    "Inventario",
    "Empleados",
    "Usuarios",
    "Servicios",
    "Ventas",
  ],
  Cajero: ["Ventas"],
  "Supervisor de pista": ["Vehículos", "Servicios"],
};

export default function Roles() {
  const [users, setUsers] = useState(mockData);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const displayusers = useMemo(() => {
    return users.filter((u) =>
      `${u.ci} ${u.name} ${u.lastname} ${u.email} ${u.phone} ${u.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, users]);

  const handleRowClick = (ci: string) => {
    setExpandedUser(expandedUser === ci ? null : ci);
  };

  const handleRoleChange = (ci: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.ci === ci
          ? { ...u, role: newRole, access: roleDefaults[newRole] }
          : u,
      ),
    );
  };

  const handleAccessToggle = (ci: string, mod: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.ci === ci) {
          const newAccess = u.access.includes(mod)
            ? u.access.filter((a) => a !== mod)
            : [...u.access, mod];
          return { ...u, access: newAccess };
        }
        return u;
      }),
    );
  };

  return (
    <section className="p-1 sm:p-2">
      <div className="shadow-md rounded-xl overflow-hidden border border-slate-300">
        {/* Título roles y acceso */}
        <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-lg sm:text-xl tracking-tight">
            Roles y Acceso
          </h2>
          {/* Botón eliminar rol */}{" "}
          <button className="flex items-center gap-2 px-6 py-2 bg-white text-red-700 font-semibold rounded-lg border border-red-700 hover:bg-red-200 transition">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              {" "}
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 1 1 2 2v2" />{" "}
            </svg>{" "}
            Eliminar Rol{" "}
          </button>{" "}
        </div>
        <div className="">
          {/* buscador de Fabian */}
          <HeaderPortal>
            <HeaderSearch
              searchPlaceholder="Buscar..."
              buttonText="Agregar Un Rol"
              searchTerm={searchTerm}
              onSearchChange={(value) => setSearchTerm(value)}
            />
          </HeaderPortal>
        </div>

        <div className="overflow-x-hidden bg-white">
          <table className="min-w-full table-auto">
            {/* Header gris claro */}
            <thead className="bg-white border-b border-slate-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-1 sm:px-5 py-1 text-left text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="w-8"></th> {/* la columna con las flechas */}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {displayusers.map((user) => {
                const defaultAccessByRole: Record<string, string[]> = {
                  Admin: [
                    "Vehículos",
                    "Inventario",
                    "Empleados",
                    "Usuarios",
                    "Servicios",
                    "Ventas",
                  ],
                  Cajero: ["Ventas"],
                  "Supervisor de pista": ["Vehículos", "Servicios"],
                };

                const defaultAccess = defaultAccessByRole[user.role] || [];

                return (
                  <>
                    <tr
                      key={user.ci}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(user.ci)}
                    >
                      <td className="px-1 sm:px-6 py-3 text-slate-700 text-xs sm:text-sm">
                        {user.ci}
                      </td>
                      <td className="px-2 sm:px-6 py-3 font-medium text-slate-800 text-xs sm:text-sm">
                        {user.name}
                      </td>
                      <td className="px-2 sm:px-6 py-3 text-slate-700 text-xs sm:text-sm">
                        {user.lastname}
                      </td>
                      <td className="px-2 sm:px-6 py-3 text-slate-700 text-xs sm:text-sm break-words">
                        {user.email}
                      </td>
                      <td className="px-2 sm:px-6 py-3 text-slate-700 text-xs sm:text-sm">
                        {user.phone}
                      </td>
                      <td className="px-2 sm:px-6 py-3 font-semibold text-slate-800 text-xs sm:text-sm">
                        {user.role}
                      </td>
                      <td className="px-2 sm:px-6 py-3 text-slate-700 text-xs sm:text-sm">
                        {user.role === "Admin"
                          ? "Acceso total"
                          : user.access.join(", ")}
                      </td>

                      {/* Flecha hacia abajo */}
                      <td className="px-1 sm:px-1 py-1 text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className={`bi bi-chevron-down transition-transform duration-300 ${
                            expandedUser === user.ci ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 
        10.293l5.646-5.647a.5.5 0 0 1 
        .708.708l-6 6a.5.5 0 0 1-.708 
        0l-6-6a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </td>
                    </tr>

                    {/* Panel expandible */}
                    <tr>
                      <td colSpan={8} className="px-1 sm:px-2 py-2">
                        <div
                          className={`overflow-hidden transition-[max-height] ${
                            expandedUser === user.ci
                              ? "max-h-[500px] duration-700 ease-out"
                              : "max-h-0 duration-300 ease-in"
                          }`}
                        >
                          <div
                            className={`transition-opacity ${
                              expandedUser === user.ci
                                ? "opacity-100 duration-700 ease-out"
                                : "opacity-0 duration-200 ease-in"
                            }`}
                          >
                            <div className="p-1 sm:p-2 border rounded-lg bg-white shadow w-full max-w-5xl mx-auto">
                              {/* Título y Rol en la misma fila */}
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                                  Configuración de {user.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <label className="text-slate-700 font-semibold">
                                    Rol:
                                  </label>
                                  <div className="relative">
                                    <select
                                      className="appearance-none border border-slate-300 bg-white px-3 py-2 rounded-lg text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                      value={user.role}
                                      onChange={(e) =>
                                        handleRoleChange(
                                          user.ci,
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="Admin">Admin</option>
                                      <option value="Cajero">Cajero</option>
                                      <option value="Supervisor de pista">
                                        Supervisor de pista
                                      </option>
                                    </select>

                                    {/* Flecha del dropdown */}
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 
          10.293l5.646-5.647a.5.5 0 0 1 
          .708.708l-6 6a.5.5 0 0 1-.708 
          0l-6-6a.5.5 0 0 1 0-.708z"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Accesos */}
                              <div className="border-t border-slate-600 pt-4">
                                <label className="block text-slate-700 font-semibold mb-3">
                                  Accesos:
                                </label>
                                <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
                                  {[
                                    "Vehículos",
                                    "Inventario",
                                    "Empleados",
                                    "Usuarios",
                                    "Servicios",
                                    "Ventas",
                                  ].map((mod) => {
                                    const isActive = user.access.includes(mod);
                                    const isDefault =
                                      defaultAccess.includes(mod);

                                    return (
                                      <label
                                        key={mod}
                                        className={`inline-flex items-center justify-center px-3 py-1 rounded-md font-medium cursor-pointer transition
    ${
      isActive
        ? isDefault
          ? "bg-blue-100 text-blue-700 border border-blue-300" // activo y predeterminado = azul claro
          : "bg-yellow-100 text-yellow-700 border border-yellow-300" // activo pero no predeterminado = amarillo
        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100" // inactivo = gris
    }`}
                                      >
                                        <input
                                          type="checkbox"
                                          className="hidden"
                                          checked={isActive}
                                          onChange={() =>
                                            handleAccessToggle(user.ci, mod)
                                          }
                                        />
                                        {mod}
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Botón Guardar */}
                              <div className="flex justify-end mt-6 sm:mt-8">
                                <button className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-green-100 text-green-900 font-medium rounded-lg border border-green-300 hover:bg-green-200 transition">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                  >
                                    <path d="M14.44 5.78L4.198 16.02a2 2 0 0 0-.565 1.125l-.553 3.774l3.775-.553A2 2 0 0 0 7.98 19.8L18.22 9.56m-3.78-3.78l2.229-2.23a1.6 1.6 0 0 1 2.263 0l1.518 1.518a1.6 1.6 0 0 1 0 2.263l-2.23 2.23M14.44 5.78l3.78 3.78" />
                                  </svg>
                                  Guardar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
