import type React from "react";
import { useJobs } from "../../hooks/useJobs";
import { useModals } from "../../hooks/useModals";
import { InitialJob, InitialNewJobForm} from "../../types/jobs.types";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Modal/Input";
import ActionButton from "../../components/Modal/ActionButton";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import type { Item } from "../../types/models";
import Alert from "../../components/Alert";

const columns = [
  { key: "name", header: "Nombre", mobile: true },
  { key: "actions", header: "Acciones", mobile: true },
];

function Jobs() {
  const {
    jobsData,
    newJobForm,
    setNewJobForm,
    registerJob,
    handleChange,
    isLoading,
    currentJob,
    setCurrentJob,
    deleteJob,
    inactiveJobsData,
    restoreJob,
    successMessage,
    setSuccessMessage,
  } = useJobs();

  const { modals, toggleModal } = useModals();

  const handleOpenRegister = () => {
    toggleModal("register", true);
  };

  const handleCloseRegister = () => {
    toggleModal("register", false);
    setNewJobForm(InitialNewJobForm);
  };

  const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await registerJob();
    if (success) {
      handleCloseRegister();
      setSuccessMessage("Trabajo Registrado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenDelete = (job: Item) => {
    toggleModal("delete", true);
    setCurrentJob((prev) => ({
      ...prev,
      id: job.id,
      name: job.name,
      baseSalary: job.baseSalary,
    }));
  };

  const handleCloseDelete = () => {
    toggleModal("delete", false);
    setCurrentJob(InitialJob);
  };

  const handleDelete = async () => {
    const success = await deleteJob(String(currentJob.id));
    if (success) {
      handleCloseDelete();
      setSuccessMessage("Trabajo Eliminado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleOpenRestore = (job: Item) => {
    toggleModal("restore", true);
    setCurrentJob((prev) => ({
      ...prev,
      id: job.id,
      name: job.name
    }))
  }

  const handleCloseRestore = () => {
    toggleModal("restore", false)
    setCurrentJob(InitialJob)
  }
 
  const handleRestore = async () => {
    const success = await restoreJob(String(currentJob.id));
    if (success) {
      handleCloseRestore()
      setSuccessMessage("Trabajo Restaurado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      {successMessage && <Alert message={successMessage} />}
      <div className="space-y-6">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold text-slate-900">
            Puestos de Trabajo
          </h2>
          <div className="flex gap-2">
            <button
              className="btn bg-white rounded-lg"
              onClick={() => navigate("/settings")}
            >
              <i className="bi bi-arrow-left" />
              Volver al Menú
            </button>
            <button
              className="btn bg-blue-600 text-white rounded-lg"
              onClick={handleOpenRegister}
            >
              <i className="bi bi-plus text-xl" />
              Agregar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {jobsData.data.map((job) => (
            <div
              key={job.id}
              className="card bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all ease-in-out"
            >
              <div className="card-body gap-4">
                <div className="flex items-center justify-between">
                  <div className="bg-blue-100 px-2 py-1 rounded-lg">
                    <i className="bi bi-person-fill text-2xl text-blue-500" />
                  </div>

                  <div className="flex gap-4">
                    <button className="cursor-pointer">
                      <i className="bi bi-pencil-square text-xl text-sky-500 hover:text-sky-600 transition-all ease-in" />
                    </button>
                    <button
                      className="cursor-pointer text-xl text-red-500 hover:text-red-600 transition-all ease-in"
                      onClick={() => handleOpenDelete(job)}
                    >
                      <i className="bi bi-trash " />
                    </button>
                  </div>
                </div>
                <h3 className="card-title text-xl">{job.name}</h3>
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase">
                    Salario
                  </p>
                  <p className="text-xl text-green-600 font-bold">
                    ${job.baseSalary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <section className="space-y-5 pt-5">
          <p className="text-xl font-semibold border-l-6 border-l-red-500 rounded-l-md pl-3">
            Historial de Eliminados
          </p>
          <div className="overflow-hidden rounded-xl shadow-md border border-slate-200">
            {isLoading ? (
              <div className="flex items-center justify-center p-10">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <Table
                columns={columns}
                data={inactiveJobsData.data}
                onRestore={handleOpenRestore}
              />
            )}

            <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Página <span className="font-bold"></span> de{" "}
                <span className="font-bold"></span>
              </p>
              <div className="join gap-2">
                <button className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1">
                  <i className="bi bi-arrow-left-short text-xl" />
                  Anterior
                </button>
                <button className="join-item py-1 px-2 text-sm cursor-pointer border border-gray-300 hover:bg-slate-100 rounded flex items-center justify-center gap-1">
                  Siguiente
                  <i className="bi bi-arrow-right-short text-xl" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Modal
        isOpen={modals.register}
        onClose={handleCloseRegister}
        title="Registrar nuevo puesto de trabajo"
        actions={
          <ActionButton
            type="register"
            isLoading={isLoading}
            form="RegisterForm"
          />
        }
      >
        <form
          id="RegisterForm"
          className="grid grid-cols-2 gap-4"
          onSubmit={handleRegister}
        >
          <Input
            name="name"
            label="Nombre:"
            type="text"
            placeholder="Ej: Lavador"
            value={newJobForm.form.name}
            onChange={handleChange}
          />
          <Input
            name="baseSalary"
            label="Salario base:"
            type="number"
            placeholder="Ej: 1200"
            value={newJobForm.form.baseSalary}
            onChange={handleChange}
          />
        </form>
      </Modal>
      <Modal
        isOpen={modals.delete}
        onClose={handleCloseDelete}
        deleteText="Eliminar Trabajo"
        actions={
          <ActionButton
            type="delete"
            isLoading={isLoading}
            onClick={handleDelete}
          />
        }
      >
        <div className="pt-4">
          <p className="text-center text-slate-700">
            ¿Estás seguro de que deseas eliminar{" "}
            <span className="font-semibold text-slate-800">
              {currentJob.name}
            </span>
            ?
          </p>
        </div>
      </Modal>
      <Modal
        isOpen={modals.restore}
        onClose={handleCloseRestore}
        restoreText="Restaurar Trabajo"
        actions={
          <ActionButton
          type="restore"
          isLoading={isLoading}
          onClick={handleRestore}
          />
        }
      >
        <div className="pt-4">
          <p className="text-center text-slate-700">
            ¿Estás seguro de que deseas restaurar{" "}
            <span className="font-semibold text-slate-800">
              {currentJob.name}
            </span>
            ?
          </p>
        </div>
      </Modal>
    </>
  );
}

export default Jobs;
