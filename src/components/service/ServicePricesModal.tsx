import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import type { CatalogService } from "../../pages/ServiceCatalog";

interface ServicePricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: CatalogService | null;
}

export default function ServicePricesModal({ isOpen, onClose, service }: ServicePricesModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Tarifas: ${service?.name || ""}`} 
      actions={<button className="btn bg-green-600 text-white hover:bg-green-700 border-none">Guardar Tarifas</button>}
    >
      {service && (
        <form className="flex flex-col gap-4 pt-2">
          <p className="text-sm text-slate-500 mb-2">
            Define el precio de cobro al cliente dependiendo del tipo de vehículo para este servicio.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">
                <i className="bi bi-bicycle"></i> 
              </div>
              <div className="flex-1">
                <Input 
                  name="priceMoto" 
                  label="Precio para Moto:" 
                  type="number" 
                  defaultValue={service.prices?.moto?.toString() || ""} 
                  placeholder="0.00"
                  icon={<i className="bi bi-currency-dollar"></i>} 
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl shrink-0">
                <i className="bi bi-car-front"></i>
              </div>
              <div className="flex-1">
                <Input 
                  name="priceCarro" 
                  label="Precio para Carro:" 
                  type="number" 
                  defaultValue={service.prices?.carro?.toString() || ""} 
                  placeholder="0.00"
                  icon={<i className="bi bi-currency-dollar"></i>} 
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xl shrink-0">
                <i className="bi bi-truck"></i>
              </div>
              <div className="flex-1">
                <Input 
                  name="priceCamion" 
                  label="Precio para Camión:" 
                  type="number" 
                  defaultValue={service.prices?.camion?.toString() || ""} 
                  placeholder="0.00"
                  icon={<i className="bi bi-currency-dollar"></i>} 
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}