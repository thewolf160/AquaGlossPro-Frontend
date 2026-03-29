import type { Item } from "./models";

export interface Job extends Item {
  name: string;
  baseSalary: string;
}

export const InitialJob: Job = {
  id: null,
  name: "",
  baseSalary: "",
};

export interface JobApi {
  jobId: string;
  name: string;
  baseSalary: string;
}

export interface JobsData {
  data: Item[];
  error: boolean;
  errorMsg: string;
}

export const InitialJobsData: JobsData = {
  data: [] as Item[],
  error: false,
  errorMsg: "",
};

export interface NewJobForm {
  form: {
    name: string;
    baseSalary: string;
  };
  error: boolean;
  errorMSg: string;
}

export const InitialNewJobForm: NewJobForm = {
  form: {
    name: "",
    baseSalary: "",
  },
  error: false,
  errorMSg: "",
};
