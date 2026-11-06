import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

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

interface LibroApi {
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
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/libros`;
  private readonly librosSubject = new BehaviorSubject<Libro[]>([]);
  readonly libros$: Observable<Libro[]> = this.librosSubject.asObservable();

  get libros(): Libro[] {
    return this.librosSubject.getValue();
  }

  cargarLibros(): Observable<Libro[]> {
    return this.http.get<LibroApi[]>(this.apiUrl).pipe(
      map(libros => libros.map(libro => ({
        id: String(libro.id),
        titulo: libro.titulo,
        autor: libro.autor,
        copias: Number(libro.copias),
        copiasTotales: Number(libro.copiasTotales),
        estado: libro.estado,
        listaCopias: libro.listaCopias ?? []
      }))),
      tap(libros => this.librosSubject.next(libros))
    );
  }

  guardarLibro(titulo: string, autor: string, cantidad: number): Observable<void> {
    const existente = this.libros.find(libro =>
      libro.titulo.trim().toLowerCase() === titulo.trim().toLowerCase() &&
      libro.autor.trim().toLowerCase() === autor.trim().toLowerCase()
    );

    const request = existente
      ? this.http.put(`${this.apiUrl}/${encodeURIComponent(existente.id)}`, {
          titulo: existente.titulo,
          autor: existente.autor,
          copias: existente.copiasTotales + cantidad,
          estado: 'disponible'
        })
      : this.http.post(this.apiUrl, {
          id: `INV${Date.now().toString(36).toUpperCase()}`,
          titulo: titulo.trim(),
          autor: autor.trim(),
          copias: cantidad
        });

    return request.pipe(
      switchMap(() => this.cargarLibros()),
      map(() => undefined)
    );
  }

  obtenerSiguienteCopiaDisponible(libroId: string): Copia | null {
    const libro = this.libros.find(item => item.id === libroId);
    return libro?.listaCopias.find(copia => copia.estado === 'Disponible') ?? null;
  }
}
