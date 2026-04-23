export interface Supplier {
  id: string | number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  category: string;
  status: 'ACTIVO' | 'INACTIVO';
}