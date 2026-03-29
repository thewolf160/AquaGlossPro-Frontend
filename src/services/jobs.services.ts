import api from "../config/api";
import type { Job } from "../types/jobs.types";

export const JobService = {
  new: async (job: Job) => {
    const { data } = await api.post("/jobs", job);

    return data;
  },

  getAll: async () => {
    const { data } = await api.get("/jobs", {
      params: {
        page: "1",
        limit: "10",
        active: true,
      },
    });

    return data;
  },

  delete: async (id: any) => {
    const { data } = await api.delete(`/jobs/${id}`);

    return data;
  },
};
