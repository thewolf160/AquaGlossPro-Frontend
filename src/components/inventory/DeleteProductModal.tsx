import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { InventoryItem } from "../../pages/Inventory";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingItem: InventoryItem | null;
}

export default function DeleteProductModal({ isOpen, onClose, deletingItem }: DeleteProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      deleteText="Eliminar Producto"
      actions={<ActionButton type="delete" />}
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
          ¿Estás seguro de que deseas eliminar el producto{" "}
          <span className="font-semibold text-slate-800">
            {deletingItem?.name}
          </span>
          ?
        </p>
      </div>
    </Modal>
  );
}