export interface Socio {
  carnet: string;
  nombre: string;
  edad: number;
  dni: string;
  telefono: string;
  email: string;
  estado: 'activo' | 'bloqueado' | 'baja';
  prestamoActivo: boolean;
  vencimientoPrestamo?: string;
}