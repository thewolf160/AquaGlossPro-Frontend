import React, { useState } from "react";
import { AuthService } from "../services/login.services";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface formState {
  form: {
    email: string;
    password: string;
  };
  error: boolean;
  errorText: string;
}

const initialFormState: formState = {
  form: {
    email: "",
    password: "",
  },
  error: false,
  errorText: "",
};

function Login() {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [formState, setFormState] = useState<formState>(initialFormState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      form: {
        ...prev.form,
        [name]: value,
      },
      error: false,
      errorText: "",
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (!formState.form.email || !formState.form.password) {
      setFormState((prev) => ({
        ...prev,
        error: true,
        errorText: "Todos los campos son obligatorios",
      }));
      setIsLoading(false);
      return;
    }

    try {

      const response = await AuthService.login({
        email: formState.form.email,
        password: formState.form.password,
      });

      localStorage.setItem("token", response.data.tokens)

      navigate("/home", { replace: true });
    } catch (error: unknown) {
      let errorMessage = "Ocurrió un error inesperado";

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          errorMessage = "No se pudo conectar con el servidor";
        } else {
          const status = error.response.status;

          switch (status) {
            case 400:
            case 401:
            case 404:
              errorMessage = "Credenciales incorrectas";
              break;
            case 500:
              errorMessage = "Error interno del servidor. Inténtalo más tarde";
              break;
            default:
              errorMessage = "Error al procesar la solicitud";
          }
        }
      }

      setFormState((prev) => ({
        ...prev,
        error: true,
        errorText: errorMessage,
      }));
      setIsLoading(false);
    }
  };

  const handleViewPassWord = () => {
    setViewPassword(!viewPassword);
  };

  return (
    <>
      <div className="flex justify-center items-center bg-slate-50 min-h-screen p-4 sm:p-8 text-white">
        <div className="flex flex-col lg:flex-row bg-slate-900 overflow-hidden w-full max-w-md lg:max-w-5xl  rounded-2xl shadow-2xl">
          <div className="relative hidden lg:flex w-1/2 bg-linear-to-br from-blue-600 via-slate-800 to-slate-900 flex-col justify-between p-12">
            <img
              src="/login.webp"
              alt="Fondo AquaGloss"
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay "
            />

            <div className="relative z-10 flex items-center gap-4">
              <div className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-md flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-car-front text-white w-8 h-8"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17s2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276" />
                  <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.8.8 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155s4.037-.084 5.592-.155A1.48 1.48 0 0 0 15 9.611v-.413q0-.148-.03-.294l-.335-1.68a.8.8 0 0 0-.43-.563 1.8 1.8 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-wide">
                AquaGloss Pro
              </h1>
            </div>

            <div className="relative z-10 mb-10">
              <h2 className="text-5xl font-extrabold leading-tight mb-4 text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400">
                Sistema de Gestión <br />
                <span className="text-sky-400">de Autolavado</span>
              </h2>
              <p className="text-lg text-slate-300 max-w-sm">
                Optimiza tus procesos, controla tu inventario y mejora la
                experiencia de tus clientes desde un solo lugar.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-10 lg:p-12">
            <div className="flex flex-col items-center text-center gap-3 lg:hidden mb-8">
              <div className="w-16 h-16 bg-sky-600  rounded-xl flex items-center justify-center shadow-lg ">
                <i className="bi bi-car-front text-4xl"></i>
              </div>
              <h1 className="text-2xl font-bold">AquaGloss Pro</h1>
            </div>

            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-slate-400">
                Bienvenido de nuevo. Ingrese sus credenciales para acceder al
                panel.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block font-medium text-sm text-slate-300 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    name="email"
                    onChange={handleChange}
                    value={formState.form.email}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-12 py-3.5 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                  />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 text-slate-500 group-focus-within:text-sky-400 transition-colors">
                    <i className="bi bi-person text-xl"></i>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-medium text-sm text-slate-300">
                    Contraseña
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type={viewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    value={formState.form.password}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-12 py-3.5 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500 tracking-widest"
                  />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex justify-center items-center w-12 text-slate-500 group-focus-within:text-sky-400 transition-colors">
                    <i className="bi bi-lock text-xl"></i>
                  </div>

                  <button
                    type="button"
                    onClick={handleViewPassWord}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-sky-400 transition-colors cursor-pointer"
                  >
                    <i
                      className={`bi text-lg ${viewPassword ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
                  </button>
                </div>
              </div>

              <div className="flex justify-center items-center h-5">
                {formState.error && (
                  <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
                    {formState.errorText}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center border border-transparent gap-3 text-white font-bold text-md bg-sky-600 hover:bg-sky-700 rounded-lg p-3 mt-2 transition-all ease-in shadow-lg shadow-sky-900/30 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-lg"></span>
                ) : (
                  <>
                    <p>Entrar al Sistema</p>
                    <i className="bi bi-box-arrow-in-right text-xl"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
