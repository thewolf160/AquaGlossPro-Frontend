import api from "../config/api";

interface Login {
  email: string;
  password: string;
}

export const AuthService = {
  login: async (credentials: Login) => {
    const { data } = await api.post("/auth/login", credentials);

    return data;
  },
};
