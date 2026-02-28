import Table from "../components/Table/Table";
import type { Item } from "../types/models";

function Employees() {
  const columns = [
    { key: "ci", header: "CI" },
    { key: "name", header: "Nombre" },
    { key: "email", header: "Email" },
    { key: "phone_number", header: "Número de Teléfono" },
    { key: "salary", header: "Salario" },
    { key: "actions", header: "Acciones" },
  ];

  const handleDelete = (item: Item) => {
    console.log(item.name);
  };

  const handleEdit = (item: Item) => {
    console.log(`Restaurar a ${item.name}`);
  };

  const handleView = (item: Item) => {
    console.log(`Ver a: ${item.name}`);
  };

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
      salary: "1200$",
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-8">
        <section className="flex flex-row gap-5">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100  hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
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
              <p className="font-medium text-sm text-slate-500">
                Total Empleados
              </p>
              <p className="text-2xl font-bold text-slate-900">24</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-100">
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
              <p className="font-medium text-sm text-gray-500">Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </section>
        <section className="shadow-md rounded-xl overflow-hidden border border-slate-300">
          <div className=" bg-white px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">
              Gestión de Empleados
            </h2>
          </div>
          <Table
            columns={columns}
            data={data}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
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
    </>
  );
}

export default Employees;
