import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LibroService, Libro, Copia } from '../services/libro-service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
  styleUrl: './libros.css'
})
export class Libros implements OnInit, OnDestroy {
  private libroService = inject(LibroService);
  private router = inject(Router);
  private sub: Subscription = new Subscription();

  isModalOpen = false;
  isCopiasModalOpen = false;
  libroSeleccionado: Libro | null = null;

  searchTerm = '';
  nuevoTitulo = '';
  nuevoAutor = '';
  nuevasCopias = 1;

  libros: Libro[] = [];

  ngOnInit(): void {
    this.sub = this.libroService.libros$.subscribe(data => {
      this.libros = data;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

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

  agregarLibro(): void {
    if (!this.nuevoTitulo.trim() || !this.nuevoAutor.trim() || this.nuevasCopias < 1) {
      Swal.fire({
        title: 'Campos Incompletos',
        text: 'Por favor completa todos los campos correctamente.',
        icon: 'warning',
        confirmButtonColor: '#0d9488'
      });
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
          id: `${libroExistente.id}-${numeroCopia}`,
          estado: 'Disponible'
        });
      }

      libroExistente.copiasTotales += this.nuevasCopias;
      this.actualizarEstadoLibro(libroExistente);
      this.closeModal();

      Swal.fire({
        title: '¡Copias Agregadas!',
        text: `Se agregaron ${this.nuevasCopias} nuevas copias a "${libroExistente.titulo}".`,
        icon: 'success',
        confirmButtonColor: '#0d9488',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const nuevoId = 'INV' + (this.libros.length + 1).toString().padStart(3, '0');
    const listaCopias: Copia[] = [];

    for (let i = 1; i <= this.nuevasCopias; i++) {
      const numeroCopia = i.toString().padStart(2, '0');
      listaCopias.push({
        id: `${nuevoId}-${numeroCopia}`,
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

    Swal.fire({
      title: '¡Libro Agregado!',
      text: `El libro "${nuevoLibro.titulo}" se ha guardado exitosamente.`,
      icon: 'success',
      confirmButtonColor: '#0d9488',
      timer: 2000,
      showConfirmButton: false
    });
  }

  private actualizarEstadoLibro(libro: Libro): void {
    libro.copias = libro.listaCopias.filter(c => c.estado === 'Disponible').length;
    libro.estado = libro.copias === 0 ? 'sin copias' : 'disponible';
  }

  irAPrestamo(libro: Libro): void {
    this.cerrarCopias();
    this.router.navigate(['/prestamos'], {
      queryParams: { libro: libro.titulo }
    });
  }

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