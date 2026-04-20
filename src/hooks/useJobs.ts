import { useEffect, useRef, useState } from "react";
import {
  InitialJobsData,
  InitialNewJobForm,
  type NewJobForm,
  type JobApi,
  type JobsData,
  type Job,
  InitialJob,
  type InactiveJobsData,
  InitialInactiveJobsData,
} from "../types/jobs.types";
import { JobService } from "../services/jobs.services";
import axios from "axios";

export const useJobs = () => {
  const [jobsData, setJobsData] = useState<JobsData>(InitialJobsData);
  const [inactiveJobsData, setInactiveJobsData] = useState<InactiveJobsData>(
    InitialInactiveJobsData,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newJobForm, setNewJobForm] = useState<NewJobForm>(InitialNewJobForm);
  const [currentJob, setCurrentJob] = useState<Job>(InitialJob);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [changedFields, setChangedFields] = useState<Partial<Job>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<{ active: boolean; msg: string }>({
    active: false,
    msg: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getJobs = async () => {
    setIsLoading(true);
    try {
      const response = await JobService.getAll({ active: "true", page: "1" });
      const data = response.data.data;

      const formattedData = data.map((job: JobApi) => ({
        ...job,
        id: job.jobId,
      }));
      setJobsData((prev) => ({
        ...prev,
        data: formattedData,
      }));
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInactiveJobs = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await JobService.getAll({
        active: "false",
        page: page.toString(),
        limit: "3",
      });

      const data = response.data.data;

      const formattedData = data.map((job: JobApi) => ({
        ...job,
        id: job.jobId,
      }));
      setInactiveJobsData((prev) => ({
        ...prev,
        data: formattedData,
      }));

      if (response.data.meta.totalPages) {
        setTotalPages(response.data.meta.totalPages);
      }

      return true;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      getInactiveJobs(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getInactiveJobs(currentPage);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPage]);

  const editJob = async () => {
    setIsSubmitting(true);
    setError({ active: false, msg: "" });

    if (Object.keys(changedFields).length === 0) {
      setError({ active: true, msg: "No se han detectado cambios" });
      setIsSubmitting(false);
      return false;
    }

    try {
      await JobService.edit(String(currentJob.id), changedFields);
      await getJobs();
      setChangedFields({});
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        ({
          active: true,
          msg: error.response?.data.message || "Error al editar",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteJob = async (id: string) => {
    setIsSubmitting(true);
    try {
      await JobService.delete(id);
      await getJobs();
      await getInactiveJobs();
      return true;
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerJob = async () => {
    setIsSubmitting(true);

    if (!newJobForm.form.baseSalary || !newJobForm.form.name) {
      setNewJobForm((prev) => ({
        ...prev,
        error: true,
        errorMSg: "Todos los campos son obligatorios",
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      await JobService.new({
        name: newJobForm.form.name,
        baseSalary: newJobForm.form.baseSalary,
      });
      getJobs();
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setNewJobForm((prev) => ({
          ...prev,
          error: true,
          errorMsg: error.response?.data.message,
        }));
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const restoreJob = async (id: string) => {
    setIsSubmitting(true);
    try {
      await JobService.restore(id);
      await getJobs();
      await getInactiveJobs();
      return true;
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewJobForm((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [name]: value,
      },
      error: false,
      errorMsg: "",
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangedFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    jobsData,
    inactiveJobsData,
    isLoading,
    newJobForm,
    currentJob,
    successMessage,
    setSuccessMessage,
    setCurrentJob,
    setNewJobForm,
    registerJob,
    deleteJob,
    handleChange,
    restoreJob,
    changedFields,
    handleEditChange,
    setChangedFields,
    isSubmitting,
    editJob,
    error,
    setError,
    totalPages,
    currentPage,
    setCurrentPage,
  };
};
