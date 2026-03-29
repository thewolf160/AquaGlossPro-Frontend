import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { ClientMapped } from "../../types/clients.types";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingClient: ClientMapped | null;
  // Definimos la función que recibiremos desde el hook
  onEdit: (id: number, data: any) => Promise<{ success: boolean; msg?: string }>;
  isLoading: boolean;
}

export default function EditClientModal({ 
  isOpen, 
  onClose, 
  editingClient, 
  onEdit, 
  isLoading 
}: EditClientModalProps) {
  
  // 1. Estado local (Copia temporal)
  const [form, setForm] = useState({
    names: "",
    lastnames: "",
    ci: "",
    numberPhone: ""
  });
  const [errorMsg, setErrorMsg] = useState("");

  // 2. EFECTO: Sincronizar datos
  // Cuando el modal se abre y recibe un editingClient, rellenamos nuestra copia temporal.
  useEffect(() => {
    if (editingClient) {
      setForm({
        names: editingClient.name, // Recordar que en React lo mapeamos a 'name'
        lastnames: editingClient.lastname, // y 'lastname'
        ci: editingClient.ci,
        numberPhone: editingClient.numberPhone
      });
      setErrorMsg(""); // Limpiamos errores pasados
    }
  }, [editingClient]);

  // 3. Manejador de cambios local
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  // 4. Enviar datos
  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!editingClient) return;

    const result = await onEdit(editingClient.clientId, form);
    
    if (result.success) {
      onClose(); // Si todo sale bien, cerramos
    } else {
      setErrorMsg(result.msg || "Error desconocido"); // Mostramos el error del backend
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
        
        {/* Mostrar errores del backend (ej. CI duplicada) */}
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
          <Input name="ci" label="Cédula / RIF:" type="text" value={form.ci} onChange={handleChange} />
          <Input name="numberPhone" label="Teléfono:" type="tel" value={form.numberPhone} onChange={handleChange} />
        </div>
      </form>
    </Modal>
  );
}