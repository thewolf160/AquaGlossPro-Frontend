import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";

interface ConfirmPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: "P" | "C" | "";
  isSubmitting: boolean;
}

export default function ConfirmPurchaseModal({
  isOpen,
  onClose,
  onConfirm,
  status,
  isSubmitting,
}: ConfirmPurchaseModalProps) {
  const isConfirm = status === "P";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      actions={
        <ActionButton 
          type={isConfirm ? "confirm" : "cancel"} 
          onClick={onConfirm} 
          isLoading={isSubmitting} 
        />
      }
    >
      <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
        
        <div className={`p-5 rounded-full ${isConfirm ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
          <i className={`text-5xl bi ${isConfirm ? "bi-check2-circle" : "bi-exclamation-triangle"}`}></i>
        </div>

        <h3 className="text-3xl font-bold text-slate-800">
          {isConfirm ? "Confirmar Pedido" : "Anular Pedido"}
        </h3>

        <div className="text-slate-600 text-base px-2 md:px-8 mt-2 space-y-3">
          <p>
            ¿Estás seguro de que deseas <b>{isConfirm ? "aceptar y procesar" : "cancelar definitivamente"}</b> este pedido?
          </p>
          
          {isConfirm && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm font-medium">
              <i className="bi bi-info-circle mr-2"></i>
              Esta acción es irreversible e incrementará el stock de los productos comprados permanentemente.
            </div>
          )}
        </div>
        
      </div>
    </Modal>
  );
}