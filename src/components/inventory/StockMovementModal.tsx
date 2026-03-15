import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import type { InventoryItem } from "../../pages/Inventory";

type StockMevementModalProps = {
        selectedItem: InventoryItem | null;
        isOpen: boolean;
        onClose: () => void;
    }

export default function StockMovementModal({isOpen, onClose,selectedItem}: StockMevementModalProps) {

return (
     <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Movimiento de Inventario"
        actions={<button className="btn bg-blue-600 text-white hover:bg-blue-700 border-none">Confirmar Operación</button>}
      >
        {selectedItem && (
          <form className="flex flex-col gap-5 pt-2">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Producto a modificar</p>
                <p className="font-black text-xl text-slate-800">{selectedItem.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Stock Actual</p>
                <p className="font-bold text-lg text-blue-600">{selectedItem.stock} <span className="text-sm font-medium">{selectedItem.unit}</span></p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="block text-sm font-medium text-slate-700">Tipo de movimiento:</label>
               <div className="flex gap-4">
                <label className="flex-1 border-2 flex items-center justify-between px-4 py-3 border-slate-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all group has-checked:border-green-500 has-checked:bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <i className="bi bi-box-arrow-in-right"></i>
                    </div>
                    <span className="text-green-700 font-bold">Entrada (+)</span>
                  </div>
                  <input type="radio" name="movementType" value="in" className="w-4 h-4 text-green-600 border-gray-300" defaultChecked />
                </label>

                <label className="flex-1 border-2 flex items-center justify-between px-4 py-3 border-slate-200 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all group has-checked:border-red-500 has-checked:bg-red-50">
                   <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      <i className="bi bi-box-arrow-right"></i>
                    </div>
                    <span className="text-red-700 font-bold">Salida (-)</span>
                  </div>
                  <input type="radio" name="movementType" value="out" className="w-4 h-4 text-red-600 border-gray-300" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="quantity" label="Cantidad a mover:" type="number" placeholder={`Ej: 10`} />
              <Input name="reason" label="Motivo u observación:" type="text" placeholder="Ej: Compra a proveedor..." />
            </div>
          </form>
        )}
      </Modal>
)
}