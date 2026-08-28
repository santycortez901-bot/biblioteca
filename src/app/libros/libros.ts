import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Libro {
  inventario: string;
  titulo: string;
  autor: string;
  copiasDisponibles: number;
  copiasTotales: number;
}

@Component({
  selector: 'app-libros',
  imports: [CommonModule],
  templateUrl: './libros.html',
  styleUrl: './libros.css'
})
export class Libros {
  isModalOpen = false;

  // Lista de libros reactiva
  libros: Libro[] = [
    { inventario: 'INV001', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', copiasDisponibles: 2, copiasTotales: 3 },
    { inventario: 'INV002', titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', copiasDisponibles: 2, copiasTotales: 2 },
    { inventario: 'INV003', titulo: '1984', autor: 'George Orwell', copiasDisponibles: 0, copiasTotales: 1 },
    { inventario: 'INV004', titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', copiasDisponibles: 1, copiasTotales: 2 },
    { inventario: 'INV005', titulo: 'La sombra del viento', autor: 'Carlos Ruiz Zafón', copiasDisponibles: 1, copiasTotales: 2 },
    { inventario: 'INV006', titulo: 'Rayuela', autor: 'Julio Cortázar', copiasDisponibles: 0, copiasTotales: 1 },
    { inventario: 'INV007', titulo: 'Ficciones', autor: 'Jorge Luis Borges', copiasDisponibles: 2, copiasTotales: 2 },
    { inventario: 'INV008', titulo: 'El aleph', autor: 'Jorge Luis Borges', copiasDisponibles: 1, copiasTotales: 1 }
  ];

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Disminuye las copias disponibles (Prestar libro)
  prestarCopia(libro: Libro) {
    if (libro.copiasDisponibles > 0) {
      libro.copiasDisponibles--;
    }
  }

  // Aumenta las copias disponibles (Devolver libro)
  devolverCopia(libro: Libro) {
    if (libro.copiasDisponibles < libro.copiasTotales) {
      libro.copiasDisponibles++;
    }
  }
}