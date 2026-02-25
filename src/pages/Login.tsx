import React, { useState } from "react";

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

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.form.email || !formState.form.password) {
      setFormState((prev) => ({
        ...prev,
        error: true,
        errorText: "Todos los campos son obligatorios",
      }));
      return;
    }
  };

  const handleViewPassWord = () => {
    setViewPassword(!viewPassword);
  };

  return (
    <>
      <div className="flex min-h-screen justify-center items-center bg-slate-50 p-4">
        <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 shadow-2xl border border-slate-800 rounded-xl p-6 pt-16 sm:pt-12">
          <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 rounded-full bg-slate-50 w-20 h-20 sm:w-24 sm:h-24 border-4 border-slate-800 flex items-center justify-center shadow-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 sm:w-12 sm:h-12 text-slate-900"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            </svg>
          </div>
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl text-white text-center font-bold mb-2">
              Inicio de sesión
            </h1>
            <p className="text-slate-400 text-center text-sm sm:text-base">
              Ingresa tus credenciales
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium text-sm text-slate-300 mb-2">
                Email:
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo"
                name="email"
                onChange={handleChange}
                value={formState.form.email}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>
            <div className="relative">
              <label className="block font-medium text-sm text-slate-300 mb-2">
                Contraseña:
              </label>

              <div className="relative">
                <input
                  type={viewPassword ? "text" : "password"}
                  placeholder=".  .  .  .  .  .  .  ."
                  name="password"
                  onChange={handleChange}
                  value={formState.form.password}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleViewPassWord}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                >
                  {!viewPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-eye"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-eye-slash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center h-5">
              {formState.error && (
                <span className="text-red-400 text-sm font-medium">
                  {formState.errorText}
                </span>
              )}
            </div>
            <button className="btn w-full border border-transparent text-white font-bold text-md sm:text-lg bg-sky-600 hover:bg-sky-700 cursor-pointer rounded-md p-6 mt-1 transition-colors shadow-lg shadow-sky-900/20">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
