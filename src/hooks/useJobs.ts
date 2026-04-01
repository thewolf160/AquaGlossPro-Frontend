import { useEffect, useState } from "react";
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

  const getInactiveJobs = async () => {
    setIsLoading(true);
    try {
      const response = await JobService.getAll({
        active: "false",
        page: "1",
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
      return true;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
    getInactiveJobs();
  }, []);

  const deleteJob = async (id: string) => {
    setIsLoading(true);
    try {
      await JobService.delete(id);
      await getJobs();
      await getInactiveJobs();
      return true;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerJob = async () => {
    setIsLoading(true);

    if (!newJobForm.form.baseSalary || !newJobForm.form.name) {
      setNewJobForm((prev) => ({
        ...prev,
        error: true,
        errorMSg: "Todos los campos son obligatorios",
      }));
      setIsLoading(false);
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
        console.log("error: ", error.response?.data);
        setNewJobForm((prev) => ({
          ...prev,
          error: true,
          errorMsg: error.response?.data.message,
        }));
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const restoreJob = async (id: string) => {
    try {
      await JobService.restore(id);
      await getJobs();
      await getInactiveJobs();
      return true;
    } catch (error) {
      console.log(error);
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
  };
};
