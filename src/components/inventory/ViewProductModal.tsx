import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import type { Product } from "../../types/inventory.types";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ViewProductModal({ isOpen, onClose, product }: ViewProductModalProps) {
  const unitNames: Record<string, string> = { L: "Litros", G: "Galones", U: "Unidades" };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Producto">
      {product && (
        <div className="flex flex-col gap-4">
          <Input name="name" label="Nombre del Producto:" type="text" value={product.name} readOnly />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="category" label="Categoría:" type="text" value={product.categoryName || "N/A"} readOnly />
            <Input name="unitType" label="Unidad de Medida:" type="text" value={unitNames[product.unitType] || product.unitType} readOnly />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-200 pt-4 mt-2">
            <Input name="currentStock" label="Stock Actual:" type="text" value={String(product.currentStock)} readOnly />
            <Input name="minStock" label="Stock Mínimo:" type="text" value={String(product.minStock)} readOnly />
            <Input name="cost" label="Costo Unitario:" type="text" value={`$${Number(product.unitCostLiter).toFixed(2)}`} icon={<i className="bi bi-currency-dollar"></i>} readOnly />
          </div>
        </div>
      )}
    </Modal>
  );
}