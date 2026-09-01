import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
  styleUrl: './libros.css'
})
export class Libros {
  // Modales y selección
  isModalOpen = false;
  isCopiasModalOpen = false;
  libroSeleccionado: Libro | null = null;

  // Buscador e Inventario
  searchTerm = '';
  contador = 1;

  // Formulario
  nuevoTitulo = '';
  nuevoAutor = '';
  nuevasCopias = 1;

  // Lista de libros
  libros: Libro[] = [];

  // --- Modales ---
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoTitulo = '';
    this.nuevoAutor = '';
    this.nuevasCopias = 1;
  }

  verCopias(libro: Libro): void {
    this.libroSeleccionado = libro;
    this.isCopiasModalOpen = true;
  }

  cerrarCopias(): void {
    this.isCopiasModalOpen = false;
    this.libroSeleccionado = null;
  }

  // --- Operaciones de Libros ---
  agregarLibro(): void {
    if (!this.nuevoTitulo.trim() || !this.nuevoAutor.trim() || this.nuevasCopias < 1) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    const tituloNuevo = this.nuevoTitulo.trim().toLowerCase();
    const autorNuevo = this.nuevoAutor.trim().toLowerCase();

    const libroExistente = this.libros.find(
      l => l.titulo.trim().toLowerCase() === tituloNuevo && l.autor.trim().toLowerCase() === autorNuevo
    );

    if (libroExistente) {
      const cantidadActual = libroExistente.listaCopias.length;

      for (let i = 1; i <= this.nuevasCopias; i++) {
        const numeroCopia = (cantidadActual + i).toString().padStart(2, '0');
        libroExistente.listaCopias.push({
          id: libroExistente.id + '-' + numeroCopia,
          estado: 'Disponible'
        });
      }

      libroExistente.copiasTotales += this.nuevasCopias;
      this.actualizarEstadoLibro(libroExistente);
      this.closeModal();
      return;
    }

    const nuevoId = 'INV' + this.contador.toString().padStart(3, '0');
    this.contador++;

    const listaCopias: Copia[] = [];
    for (let i = 1; i <= this.nuevasCopias; i++) {
      const numeroCopia = i.toString().padStart(2, '0');
      listaCopias.push({
        id: nuevoId + '-' + numeroCopia,
        estado: 'Disponible'
      });
    }

    const nuevoLibro: Libro = {
      id: nuevoId,
      titulo: this.nuevoTitulo.trim(),
      autor: this.nuevoAutor.trim(),
      copias: this.nuevasCopias,
      copiasTotales: this.nuevasCopias,
      estado: 'disponible',
      listaCopias
    };

    this.actualizarEstadoLibro(nuevoLibro);
    this.libros.push(nuevoLibro);
    this.closeModal();
  }

  // --- Actualizar Estado y Conteo (Calculado) ---
  private actualizarEstadoLibro(libro: Libro): void {
    // Cuenta dinámicamente las disponibles sin tener que sumar/restar manualmente
    libro.copias = libro.listaCopias.filter(c => c.estado === 'Disponible').length;
    libro.estado = libro.copias === 0 ? 'sin copias' : 'disponible';
  }

  // --- Préstamos y Devoluciones ---
  prestarCopia(libro: Libro): void {
    const copiaDisponible = libro.listaCopias.find(c => c.estado === 'Disponible');
    if (!copiaDisponible) return;

    copiaDisponible.estado = 'Prestada';
    this.actualizarEstadoLibro(libro);
  }

  devolverCopia(libro: Libro): void {
    const copiaPrestada = libro.listaCopias.find(c => c.estado === 'Prestada');
    if (!copiaPrestada) return;

    copiaPrestada.estado = 'Disponible';
    this.actualizarEstadoLibro(libro);
  }

  prestarCopiaIndividual(libro: Libro, copia: Copia): void {
    if (copia.estado !== 'Disponible') return;

    copia.estado = 'Prestada';
    this.actualizarEstadoLibro(libro);
  }

  devolverCopiaIndividual(libro: Libro, copia: Copia): void {
    if (copia.estado !== 'Prestada') return;

    copia.estado = 'Disponible';
    this.actualizarEstadoLibro(libro);
  }

  // --- Getter para Buscador ---
  get librosFiltrados(): Libro[] {
    const busqueda = this.searchTerm.trim().toLowerCase();
    if (!busqueda) return this.libros;

    return this.libros.filter(libro => {
      const titulo = libro.titulo.toLowerCase();
      const autor = libro.autor.toLowerCase();
      const id = libro.id.toLowerCase();
      const tieneCopiaCoincidente = libro.listaCopias.some(c => c.id.toLowerCase().includes(busqueda));

      return titulo.includes(busqueda) || autor.includes(busqueda) || id.includes(busqueda) || tieneCopiaCoincidente;
    });
  }
}