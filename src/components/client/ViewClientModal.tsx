import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import type { Client } from "../../types/clients.types";

interface ViewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export default function ViewClientModal({ isOpen, onClose, client }: ViewClientModalProps) {
  if (!client) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Cliente">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="names"
            label="Nombres:"
            type="text"
            value={client.names || ""}
            readOnly
          />
          <Input
            name="lastnames"
            label="Apellidos:"
            type="text"
            value={client.lastnames || ""}
            readOnly
          />
        </div>
        <div>
          <Input
            name="ci"
            label="Cédula / RIF:"
            type="text"
            value={client.ci || ""}
            icon={<i className="bi bi-person-vcard text-xl"></i>}
            readOnly
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="numberPhone"
            label="Teléfono:"
            type="text"
            value={client.numberPhone || ""}
            icon={<i className="bi bi-telephone text-xl" />}
            readOnly
          />
          <Input
            name="vehiclesCount"
            label="Vehículos Totales:"
            type="text"
            value={String(client.countVehicles || 0)}
            icon={<i className="bi bi-car-front text-xl" />}
            readOnly
          />
        </div>
        <div>
          <Input
            name="email"
            label="Correo Electrónico:"
            type="email"
            value={client.email || ""}
            icon={<i className="bi bi-envelope text-xl" />}
            readOnly
          />
        </div>
      </div>
    </Modal>
  );
}