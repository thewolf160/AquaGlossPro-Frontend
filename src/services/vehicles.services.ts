import api from "../config/api";

export const VehicleService = {
  new: async () => {
    await api.post("/vehicles");
  },
};
