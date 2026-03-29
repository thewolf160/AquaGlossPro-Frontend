import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";

interface addProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddProductModal({isOpen, onClose}: addProductModalProps) {
    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Registro de Nuevo Producto"
        actions={<ActionButton type="register" />}
      >
        <form className="flex flex-col gap-3">
          <Input name="name" label="Nombre del Producto:" type="text" placeholder="Ej: Champú Premium" />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="block text-sm font-medium text-slate-700">Categoría:</label>
              <select id="category" name="category" defaultValue="" className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in">
                <option value="" disabled>-- Selecciona una --</option>
                <option value="Químicos">Químicos</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Venta">Artículos de Venta</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="unit" className="block text-sm font-medium text-slate-700">Unidad de Medida:</label>
              <select id="unit" name="unit" defaultValue="" className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in">
                <option value="" disabled>-- Selecciona una --</option>
                <option value="Litros">Litros</option>
                <option value="Galones">Galones</option>
                <option value="Unidades">Unidades</option>
                <option value="Paquetes">Paquetes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input name="stock" label="Stock Inicial:" type="number" placeholder="0" />
            <Input name="minStock" label="Stock Mínimo:" type="number" placeholder="0" />
            <Input 
              name="price" 
              label="Precio Unitario:" 
              type="number" 
              placeholder="0.00" 
              icon={<i className="bi bi-currency-dollar"></i>} 
            />
          </div>
        </form>
      </Modal>
    )
}