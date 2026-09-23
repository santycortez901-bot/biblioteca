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
    this.generarLibrosDePrueba(20);
  }

  get libros(): Libro[] {
    return this.librosSubject.getValue();
  }

  // Obtiene la primera copia disponible de un libro
  obtenerSiguienteCopiaDisponible(libroId: string): Copia | null {
    const libro = this.libros.find(l => l.id === libroId);
    if (!libro) return null;
    return libro.listaCopias.find(c => c.estado === 'Disponible') || null;
  }

  // Presta una copia específica
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

  // Devuelve una copia dada su clave de inventario (Ej: INV001-01)
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

  private generarLibrosDePrueba(cantidad: number): void {
    const catalogos = [
      { titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez' },
      { titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes' },
      { titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry' },
      { titulo: '1984', autor: 'George Orwell' },
      { titulo: 'Un Mundo Feliz', autor: 'Aldous Huxley' },
      { titulo: 'Ficciones', autor: 'Jorge Luis Borges' },
      { titulo: 'El Aleph', autor: 'Jorge Luis Borges' },
      { titulo: 'La Odisea', autor: 'Homero' },
      { titulo: 'Crimen y Castigo', autor: 'Fiódor Dostoyevski' },
      { titulo: 'El Señor de los Anillos', autor: 'J.R.R. Tolkien' },
      { titulo: 'Rayuela', autor: 'Julio Cortázar' },
      { titulo: 'Pedro Páramo', autor: 'Juan Rulfo' },
      { titulo: 'El Túnel', autor: 'Ernesto Sabato' },
      { titulo: 'La Metamorfosis', autor: 'Franz Kafka' },
      { titulo: 'Ensayo sobre la Ceguera', autor: 'José Saramago' },
      { titulo: 'Los Miserables', autor: 'Victor Hugo' },
      { titulo: 'La Sombra del Viento', autor: 'Carlos Ruiz Zafón' },
      { titulo: 'Fahrenheit 451', autor: 'Ray Bradbury' },
      { titulo: 'Drácula', autor: 'Bram Stoker' },
      { titulo: 'El Retrato de Dorian Gray', autor: 'Oscar Wilde' }
    ];

    const seleccionados = catalogos.sort(() => 0.5 - Math.random()).slice(0, cantidad);
    const nuevosLibros: Libro[] = [];

    seleccionados.forEach(item => {
      const copiasTotales = Math.floor(Math.random() * 4) + 1;
      const nuevoId = 'INV' + this.contador.toString().padStart(3, '0');
      this.contador++;

      const listaCopias: Copia[] = [];
      for (let i = 1; i <= copiasTotales; i++) {
        listaCopias.push({
          id: `${nuevoId}-${i.toString().padStart(2, '0')}`,
          estado: 'Disponible'
        });
      }

      nuevosLibros.push({
        id: nuevoId,
        titulo: item.titulo,
        autor: item.autor,
        copias: copiasTotales,
        copiasTotales,
        estado: 'disponible',
        listaCopias
      });
    });

    this.librosSubject.next(nuevosLibros);
  }
}