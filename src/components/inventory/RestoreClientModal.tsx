import Modal from "../Modal/Modal";
import type { Product } from "../../types/inventory.types";

interface RestoreProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  restoringProduct: Product | null;
  onRestore: (id: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function RestoreProductModal({
  isOpen,
  onClose,
  restoringProduct,
  onRestore,
  isLoading
}: RestoreProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reactivar Producto"
      actions={
        <button
          onClick={() => restoringProduct?.id && onRestore(String(restoringProduct.id))}
          disabled={isLoading}
          className="btn bg-green-600 hover:bg-green-700 text-white border-none min-h-0 h-9 px-4 cursor-pointer flex items-center gap-2"
        >
          {isLoading && <span className="loading loading-spinner loading-xs"></span>}
          Reactivar Producto
        </button>
      }
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
          ¿Estás seguro de que deseas reactivar el producto <span className="font-semibold text-slate-800">{restoringProduct?.name}</span>?
        </p>
      </div>
    </Modal>
  );
}