type ActionType = "edit" | "delete" | "register" | "restore" | "confirm" | "cancel";

interface ButtonProps {
  type: ActionType;
  onClick?: () => void;
  isLoading?: boolean;
  form?: string;
}

interface ButtonConfig {
  label: string;
  icon?: string;
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
    restore: {
      label: "Restaurar",
      color: "bg-green-500 hover:bg-green-600"
    },
    confirm: {
      label: "Confirmar",
      icon: "bi bi-check-circle-fill",
      color: "bg-green-600 hover:bg-green-700"
    },
    cancel: {
      label: "Anular",
      icon: "bi bi-x-circle-fill",
      color: "bg-red-600 hover:bg-red-700"
    }
  };

  const { icon, color, label } = config[type];

  return (
    <>
      <button
        disabled={isLoading}
        form={form}
        onClick={onClick}
        className={`btn text-white transition-all ease-in border-none ${color}`}
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