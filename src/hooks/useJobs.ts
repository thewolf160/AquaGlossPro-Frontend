import { useEffect, useState } from "react";
import {
  InitialJobsData,
  InitialNewJobForm,
  type NewJobForm,
  type JobApi,
  type JobsData,
  type Job,
  InitialJob,
} from "../types/jobs.types";
import { JobService } from "../services/jobs.services";
import axios from "axios";

export const useJobs = () => {
  const [jobsData, setJobsData] = useState<JobsData>(InitialJobsData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newJobForm, setNewJobForm] = useState<NewJobForm>(InitialNewJobForm);
  const [currentJob, setCurrentJob] = useState<Job>(InitialJob);

  const getJobs = async () => {
    setIsLoading(true);
    try {
      const response = await JobService.getAll();
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

  useEffect(() => {
    getJobs();
  }, []);

  const deleteJob = async (id: any) => {
    setIsLoading(true);
    try {
      await JobService.delete(id);
      await getJobs();
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
    isLoading,
    newJobForm,
    currentJob,
    setCurrentJob,
    setNewJobForm,
    registerJob,
    deleteJob,
    handleChange,
  };
};
