export type TipoActividad = 'login' | 'prestamo' | 'eliminacion' | 'cuota' | 'socio' | 'libro';
export interface Actividad {
    tipo: TipoActividad;
  descripcion: string;
  fecha: string;
  user: string;
  idrelacionado?: string;
}
