import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LibroService, Libro } from '../services/libro-service';
import { ActividadServicio } from '../services/actividade-service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
  styleUrl: './libros.css'
})
export class Libros implements OnInit, OnDestroy {
  private libroService = inject(LibroService);
  private actividadServicio = inject(ActividadServicio);
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
    this.libroService.cargarLibros().subscribe({
      error: (error: unknown) => this.mostrarErrorApi(error)
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

    const titulo = this.nuevoTitulo.trim();
    const autor = this.nuevoAutor.trim();
    const existente = this.libros.find(libro =>
      libro.titulo.trim().toLowerCase() === titulo.toLowerCase() &&
      libro.autor.trim().toLowerCase() === autor.toLowerCase()
    );

    this.libroService.guardarLibro(titulo, autor, this.nuevasCopias).subscribe({
      next: () => {
        this.actividadServicio.registrarActividad(
          'libro',
          existente
            ? `Copias agregadas al libro: ${existente.titulo} (${this.nuevasCopias})`
            : `Nuevo libro registrado: ${titulo} (${autor}, ${this.nuevasCopias} copias)`,
          existente?.id
        );
        this.closeModal();
        void Swal.fire({
          title: existente ? '¡Copias Agregadas!' : '¡Libro Agregado!',
          text: existente
            ? `Se agregaron ${this.nuevasCopias} nuevas copias a "${existente.titulo}".`
            : `El libro "${titulo}" se guardó exitosamente.`,
          icon: 'success',
          confirmButtonColor: '#0d9488',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error: unknown) => this.mostrarErrorApi(error)
    });
  }

  private mostrarErrorApi(error: unknown): void {
    const mensaje = error instanceof Error ? error.message : 'No se pudo completar la operación.';
    void Swal.fire({
      title: 'Error de conexión con la API',
      text: mensaje,
      icon: 'error',
      confirmButtonColor: '#0d9488'
    });
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