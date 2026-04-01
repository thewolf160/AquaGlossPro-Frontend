import api from "../config/api";
import type { Job } from "../types/jobs.types";

interface JobsFilters {
  active?: string;
  page?: string;
  param?: string;
  limit?: string;
}

export const JobService = {
  new: async (job: Job) => {
    const { data } = await api.post("/jobs", job);

    return data;
  },

  getAll: async (filters: JobsFilters) => {
    const { data } = await api.get("/jobs", {
      params: {
        limit: "10",
        ...filters,
      },
    });

    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/jobs/${id}`);

    return data;
  },

  restore: async (id: string) => {
    const { data } = await api.patch(`/jobs/restore/${id}`);

    return data;
  },
};
