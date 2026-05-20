import { useState } from "react";
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { Client } from "../../types/clients.types";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingClient: Client | null;
  onEdit: (id: number, data: Partial<Client>) => Promise<{ success: boolean; msg?: string }>;
  isLoading: boolean;
}

export default function EditClientModal({ 
  isOpen, 
  onClose, 
  editingClient, 
  onEdit, 
  isLoading 
}: EditClientModalProps) {
  
  const [prevClient, setPrevClient] = useState<Client | null>(null);

  const [form, setForm] = useState({
    names: "",
    lastnames: "",
    ci: "",
    numberPhone: "",
    email: ""
  });
  
  const [errorMsg, setErrorMsg] = useState("");

  if (editingClient !== prevClient) {
    setPrevClient(editingClient); 
    

    setForm({
      names: editingClient?.names || "",
      lastnames: editingClient?.lastnames || "",
      ci: editingClient?.ci || "",
      numberPhone: editingClient?.numberPhone || "",
      email: editingClient?.email || ""
    });
    setErrorMsg(""); 
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!editingClient?.id) return; 

    const result = await onEdit(Number(editingClient.id), form);
    
    if (result.success) {
      onClose(); 
    } else {
      setErrorMsg(result.msg || "Error desconocido"); 
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Editar Cliente" 
      actions={<ActionButton type="edit" onClick={() => handleSubmit()} isLoading={isLoading} />}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            <i className="bi bi-exclamation-triangle-fill mr-2"></i>
            {errorMsg}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="names" label="Nombres:" type="text" value={form.names} onChange={handleChange} />
          <Input name="lastnames" label="Apellidos:" type="text" value={form.lastnames} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="ci" label="Cédula / RIF:" type="text" value={form.ci} onChange={handleChange} icon={<i className="bi bi-person-vcard text-xl" />} />
          <Input name="numberPhone" label="Teléfono:" type="tel" value={form.numberPhone} onChange={handleChange} icon={<i className="bi bi-telephone text-xl" />} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Input name="email" label="Correo Electrónico:" type="email" value={form.email} onChange={handleChange} icon={<i className="bi bi-envelope text-xl" />} />
        </div>
      </form>
    </Modal>
  );
}