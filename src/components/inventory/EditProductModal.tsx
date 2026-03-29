import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { InventoryItem } from "../../pages/Inventory";

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingItem: InventoryItem | null;
}


export default function EditProductModal ({isOpen, onClose, editingItem}: EditProductModalProps) {
return (
     <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Editar Producto"
        actions={<ActionButton type="edit" />}
      >
        {editingItem && (
          <form className="flex flex-col gap-3">
            <Input 
              name="name" 
              label="Nombre del Producto:" 
              type="text" 
              defaultValue={editingItem.name} 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="edit_category" className="block text-sm font-medium text-slate-700">Categoría:</label>
                <select 
                  id="edit_category" 
                  name="category" 
                  defaultValue={editingItem.category} 
                  className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
                >
                  <option value="" disabled>-- Selecciona una --</option>
                  <option value="Químicos">Químicos</option>
                  <option value="Herramientas">Herramientas</option>
                  <option value="Venta">Artículos de Venta</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="edit_unit" className="block text-sm font-medium text-slate-700">Unidad de Medida:</label>
                <select 
                  id="edit_unit" 
                  name="unit" 
                  defaultValue={editingItem.unit} 
                  className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
                >
                  <option value="" disabled>-- Selecciona una --</option>
                  <option value="Litros">Litros</option>
                  <option value="Galones">Galones</option>
                  <option value="Unidades">Unidades</option>
                  <option value="Paquetes">Paquetes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input 
                name="stock" 
                label="Stock Inicial:" 
                type="number" 
                defaultValue={editingItem.stock.toString()} 
              />
              <Input 
                name="minStock" 
                label="Stock Mínimo:" 
                type="number" 
                defaultValue={editingItem.minStock.toString()} 
              />
              <Input 
                name="price" 
                label="Precio Unitario:" 
                type="number" 
                defaultValue={editingItem.price.toString()} 
                icon={<i className="bi bi-currency-dollar"></i>} 
              />
            </div>
          </form>
        )}
      </Modal>
)
}