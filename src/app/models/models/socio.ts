export type EstadoSocio = 'activo' | 'inactivo' | 'suspendido'| 'bloqueado';
export interface Socio {
  id: string;
  nombre: string;
  dni: string;
  numCarnet: string;
  edad: number;
  email: string;
  telefono: string;
  estado: EstadoSocio;}
