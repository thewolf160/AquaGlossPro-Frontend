import type React from "react";
import { useJobs } from "../../hooks/useJobs";
import { useModals } from "../../hooks/useModals";
import {
  InitialJob,
  InitialNewJobForm
} from "../../types/jobs.types";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Modal/Input";
import ActionButton from "../../components/Modal/ActionButton";
import { JobService } from "../../services/jobs.services";

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
    deleteJob
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
    }
  };

  const handleOpenDelete = (job: any) => {
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
    const success = await deleteJob(currentJob.id);
    if (success) {
      handleCloseDelete();
      console.log("eliminado")
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold text-slate-700">
            Puestos de Trabajo
          </h2>
          <button className="btn" onClick={handleOpenRegister}>
            Agregar
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {jobsData.data.map((job) => (
            <div
              key={job.id}
              className="card bg-white border border-slate-100 shadow-sm hover:shadow-md"
            >
              <div className="card-body">
                <h3 className="card-title text-2xl">{job.name}</h3>
                <p className="text-slate-500">
                  Salario base:{" "}
                  <span className="text-green-600 font-bold">
                    {job.baseSalary}
                  </span>
                </p>
                <div className="flex gap-4">
                  <button
                    className="bg-red-50 rounded-md text-red-500 hover:bg-red-100 transition-all cursor-pointer px-3 py-2 hidden sm:flex"
                    onClick={() => handleOpenDelete(job)}
                  >
                    <i className="bi bi-trash" />
                  </button>
                  <button className="bg-sky-50 rounded-md p-4 text-sky-600 hover:bg-blue-100 cursor-pointer transition-all px-2.5 py-2.5 hidden sm:flex">
                    <i className="bi bi-pencil-square" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
        deleteText="Eliminar Puesto de Trabajo"
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
    </>
  );
}

export default Jobs;
