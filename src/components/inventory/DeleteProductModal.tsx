import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { Product } from "../../types/inventory.types";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingProduct: Product | null;
  onDelete: () => Promise<void> | void;
  isLoading: boolean;
}

export default function DeleteProductModal({ 
  isOpen, 
  onClose, 
  deletingProduct,
  onDelete,
  isLoading
}: DeleteProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      deleteText="Eliminar Producto"
      actions={<ActionButton type="delete" isLoading={isLoading} onClick={onDelete} />}
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
          ¿Estás seguro de que deseas eliminar el producto{" "}
          <span className="font-semibold text-slate-800">
            {deletingProduct?.name}
          </span>
          ?
        </p>
      </div>
    </Modal>
  );
}