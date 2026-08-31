export type EstadoLibro = 'disponible' | 'prestado' | 'extraviado';
export interface Libro {id: string;
  titulo: string;
  autor: string;
  copias: number;
  estado: EstadoLibro;}
