import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { Product } from "../../types/inventory.types";

interface DecreaseStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onDecrease: (payload: { items: { productId: number; stock: number; unitType: string }[] }) => Promise<boolean>;
  isLoading: boolean;
}

export default function DecreaseStockModal({
  isOpen,
  onClose,
  product,
  onDecrease,
  isLoading,
}: DecreaseStockModalProps) {
  const [stockToDecrease, setStockToDecrease] = useState<string>("");
  const [unitType, setUnitType] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (product && isOpen) {
      setStockToDecrease("");
      setUnitType(product.unitType);
      setErrorMsg("");
    }
  }, [product, isOpen]);

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    
    if (!product) return;

    const stockNumber = Number(stockToDecrease);
    if (!stockToDecrease || isNaN(stockNumber) || stockNumber <= 0) {
      setErrorMsg("Debes ingresar una cantidad válida mayor a 0");
      return;
    }

    const success = await onDecrease({
      items: [
        {
          productId: product.id,
          stock: stockNumber,
          unitType: unitType,
        },
      ],
    });

    if (success) {
      onClose();
    } else {
      setErrorMsg("Ocurrió un error al decrementar el stock o stock insuficiente.");
    }
  };

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Decrementar Stock"
      actions={
        <ActionButton 
          type="confirm" 
          onClick={handleSubmit} 
          isLoading={isLoading} 
        />
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="bg-orange-50 text-orange-800 p-4 rounded-lg flex items-center gap-3 border border-orange-200">
          <i className="bi bi-exclamation-circle-fill text-2xl"></i>
          <div>
            <p className="font-semibold text-sm">Vas a decrementar stock del producto:</p>
            <p className="font-bold text-lg">{product.name}</p>
            <p className="text-xs mt-1">
              Stock actual: <span className="font-bold">{product.currentStock}</span> {product.unitType === 'L' ? 'Litros' : product.unitType === 'G' ? 'Galones' : 'Unidades'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 flex items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i>
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="stock"
            label="Cantidad a restar:"
            type="number"
            min="0.01"
            step="0.01"
            value={stockToDecrease}
            onChange={(e) => {
              setStockToDecrease(e.target.value);
              setErrorMsg("");
            }}
            icon={<i className="bi bi-hash text-xl" />}
          />
          
          <div className="flex flex-col gap-1 w-full relative">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Unidad:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <i className="bi bi-rulers text-xl" />
              </div>
              <select
                name="unitType"
                value={unitType}
                onChange={(e) => {
                  setUnitType(e.target.value);
                  setErrorMsg("");
                }}
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}
              >
                {product.unitType !== 'U' ? (
                  <>
                    <option value="L">Litros (L)</option>
                    <option value="G">Galones (G)</option>
                  </>
                ) : (
                  <option value="U">Unidades (U)</option>
                )}
              </select>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
