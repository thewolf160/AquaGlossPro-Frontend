import type { Client, ClientMapped } from "../types/clients.types";


export const formatCiForBackend = (ci: string): string => {
  return ci.replace(/-/g, "").replace(/\s/g, "").toUpperCase();
};


export const formatPhoneForBackend = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, "");
  
  const baseNumber = cleanPhone.startsWith("0") 
    ? cleanPhone.substring(1) 
    : cleanPhone;

  return `+58-${baseNumber}`;
};


export const transformClientData = (clients: Client[]): ClientMapped[] => {
  return clients.map((client) => ({
    ...client,
    name: client.names,       
    lastname: client.lastnames, 
  }));
};