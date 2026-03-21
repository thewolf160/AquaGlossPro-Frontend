type ActionType = "edit" | "delete" | "register";

interface ButtonProps {
  type: ActionType;
  onClick?: () => void;
  isLoading?: boolean;
  form?: string;
}

interface ButtonConfig {
  label: string;
  icon: string;
  color: string;
}

function ActionButton({ type, onClick, isLoading = false, form }: ButtonProps) {
  const config: Record<ActionType, ButtonConfig> = {
    edit: {
      label: "Editar",
      icon: "bi bi-pencil-square",
      color: "bg-sky-500 hover:bg-sky-600",
    },
    delete: {
      label: "Eliminar",
      icon: "bi bi-trash3-fill",
      color: "bg-red-500 hover:bg-red-600",
    },
    register: {
      label: "Guardar",
      icon: "bi bi-floppy-fill",
      color: "bg-blue-500 hover:bg-blue-600",
    },
  };

  const { icon, color, label } = config[type];

  return (
    <>
      <button
        disabled={isLoading}
        form={form}
        onClick={onClick}
        className={`btn text-white transition-all ease-in ${color}`}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xl"></span>
        ) : (
          <>
            <i className={icon} />
            <span>{label}</span>
          </>
        )}
      </button>
    </>
  );
}

export default ActionButton;
