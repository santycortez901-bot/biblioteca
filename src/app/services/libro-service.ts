import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Copia {
  id: string;
  estado: 'Disponible' | 'Prestada';
}

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  copias: number;
  copiasTotales: number;
  estado: string;
  listaCopias: Copia[];
}

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private contador = 1;
  private librosSubject = new BehaviorSubject<Libro[]>([]);
  libros$: Observable<Libro[]> = this.librosSubject.asObservable();

  constructor() {
    // Inicializa vacío sin libros de prueba
  }

  get libros(): Libro[] {
    return this.librosSubject.getValue();
  }

  obtenerSiguienteCopiaDisponible(libroId: string): Copia | null {
    const libro = this.libros.find(l => l.id === libroId);
    if (!libro) return null;
    return libro.listaCopias.find(c => c.estado === 'Disponible') || null;
  }

  prestarCopia(libroId: string, copiaId: string): boolean {
    const listaActual = [...this.libros];
    const libro = listaActual.find(l => l.id === libroId);
    if (!libro) return false;

    const copia = libro.listaCopias.find(c => c.id === copiaId && c.estado === 'Disponible');
    if (!copia) return false;

    copia.estado = 'Prestada';
    this.actualizarEstadoLibro(libro);
    this.librosSubject.next(listaActual);
    return true;
  }

  devolverCopiaPorInventario(inventarioId: string): void {
    const listaActual = [...this.libros];
    for (const libro of listaActual) {
      const copia = libro.listaCopias.find(c => c.id === inventarioId);
      if (copia && copia.estado === 'Prestada') {
        copia.estado = 'Disponible';
        this.actualizarEstadoLibro(libro);
        this.librosSubject.next(listaActual);
        break;
      }
    }
  }

  private actualizarEstadoLibro(libro: Libro): void {
    libro.copias = libro.listaCopias.filter(c => c.estado === 'Disponible').length;
    libro.estado = libro.copias === 0 ? 'sin copias' : 'disponible';
  }
}