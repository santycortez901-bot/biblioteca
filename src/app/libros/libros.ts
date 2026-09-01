import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  copias: number;        // Copias disponibles actualmente
  copiasTotales: number; // Copias totales registradas
  estado: string;
}

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
  styleUrl: './libros.css'
})
export class Libros {
  isModalOpen: boolean = false;
  searchTerm: string = '';
  
  contador: number = 1;

  nuevoTitulo: string = '';
  nuevoAutor: string = '';
  nuevasCopias: number = 1;

  libros: Libro[] = [];

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.nuevoTitulo = '';
    this.nuevoAutor = '';
    this.nuevasCopias = 1;
  }

  agregarLibro() {
    if (this.nuevoTitulo == '' || this.nuevoAutor == '') {
      alert('Por favor completa el título y el autor');
      return;
    }

    let nuevoId = 'INV00' + this.contador;
    this.contador = this.contador + 1;

    let libroNuevo: Libro = {
      id: nuevoId,
      titulo: this.nuevoTitulo,
      autor: this.nuevoAutor,
      copias: this.nuevasCopias,
      copiasTotales: this.nuevasCopias, // Guardamos el total inicial
      estado: 'disponible'
    };

    this.libros.push(libroNuevo);
    this.closeModal();
  }

  prestarCopia(libro: Libro) {
    if (libro.copias > 0) {
      libro.copias = libro.copias - 1;
      
      if (libro.copias == 0) {
        libro.estado = 'sin copias';
      }
    }
  }

  devolverCopia(libro: Libro) {
    if (libro.copias < libro.copiasTotales) {
      libro.copias = libro.copias + 1;
      libro.estado = 'disponible';
    }
  }

  get librosFiltrados(): Libro[] {
    if (this.searchTerm == '') {
      return this.libros;
    }

    let busqueda = this.searchTerm.toLowerCase();

    return this.libros.filter(libro => {
      let tituloMinuscula = libro.titulo.toLowerCase();
      let autorMinuscula = libro.autor.toLowerCase();
      let idMinuscula = libro.id.toLowerCase();

      return tituloMinuscula.includes(busqueda) || 
             autorMinuscula.includes(busqueda) || 
             idMinuscula.includes(busqueda);
    });
  }
}