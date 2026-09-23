import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  // Inyección del servicio encargado de manejar el estado y la lógica de los libros
  private libroService = inject(LibroService);
  private sub: Subscription = new Subscription();

  // Controladores visuales para la apertura y cierre de modales
  isModalOpen = false;
  isCopiasModalOpen = false;
  libroSeleccionado: Libro | null = null;

  // Propiedades vinculadas a los inputs del buscador y del formulario de alta
  searchTerm = '';
  nuevoTitulo = '';
  nuevoAutor = '';
  nuevasCopias: number = 1;

  // Arreglo local que almacena la lista actual de libros reactivos
  libros: Libro[] = [];

  // Se ejecuta al inicializar el componente: se suscribe al observable para escuchar cambios en tiempo real
  ngOnInit(): void {
    this.sub = this.libroService.libros$.subscribe(data => {
      this.libros = data;
    });
  }

  // Se ejecuta al destruir el componente para liberar la suscripción y evitar fugas de memoria
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // Abre el modal para registrar un nuevo libro
  openModal(): void {
    this.isModalOpen = true;
  }

  // Cierra todas las ventanas emergentes y limpia los campos del formulario
  closeModal(): void {
    this.isModalOpen = false;
    this.isCopiasModalOpen = false;
    this.libroSeleccionado = null;
    this.limpiarFormulario();
  }

  // Restablece las variables del formulario a sus valores por defecto
  limpiarFormulario(): void {
    this.nuevoTitulo = '';
    this.nuevoAutor = '';
    this.nuevasCopias = 1;
  }

  // Abre el modal secundario para visualizar las copias físicas de un libro en específico
  verCopias(libro: Libro): void {
    this.libroSeleccionado = libro;
    this.isCopiasModalOpen = true;
  }

  // Cierra el modal secundario de copias
  cerrarCopias(): void {
    this.isCopiasModalOpen = false;
    this.libroSeleccionado = null;
  }

  // Valida los datos y dispara la ventana de confirmación (SweetAlert2) antes de guardar
  agregarLibro(): void {
    // Comprobación defensiva por si se intenta forzar el método sin datos válidos
    if (!this.nuevoTitulo.trim() || !this.nuevoAutor.trim() || this.nuevasCopias < 1) {
      return;
    }

    const tituloIngresado = this.nuevoTitulo.trim();

    
    // Muestra un cuadro de diálogo interactivo de confirmación con el nombre del libro
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Estás seguro de que quieres guardar el libro "${tituloIngresado}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Únicamente si el usuario confirma de forma explícita se ejecuta el guardado y se cierran TODOS los modales
      if (result.isConfirmed) {
        this.ejecutarGuardadoLibro();
        this.closeModal(); // <--- Cierra de forma absoluta cualquier ventana emergente abierta
      }
    });
  }

  // Lógica de negocio para registrar un libro nuevo o incrementar copias si ya existe
  private ejecutarGuardadoLibro(): void {
    const tituloNuevo = this.nuevoTitulo.trim().toLowerCase();
    const autorNuevo = this.nuevoAutor.trim().toLowerCase();

    // Busca si el libro ya está registrado en el sistema evaluando título y autor
    const libroExistente = this.libros.find(
      l => l.titulo.trim().toLowerCase() === tituloNuevo && l.autor.trim().toLowerCase() === autorNuevo
    );

    if (libroExistente) {
      const cantidadActual = libroExistente.listaCopias.length;

      // Genera nuevas copias físicas adicionales asociadas al libro existente
      for (let i = 1; i <= this.nuevasCopias; i++) {
        const numeroCopia = (cantidadActual + i).toString().padStart(2, '0');
        libroExistente.listaCopias.push({
          id: `${libroExistente.id}-${numeroCopia}`,
          estado: 'Disponible'
        });
      }

      libroExistente.copiasTotales += this.nuevasCopias;
      this.actualizarEstadoLibro(libroExistente);

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

    // Si no existe, genera un nuevo ID de inventario y crea las copias desde cero
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

    Swal.fire({
      title: '¡Libro Agregado!',
      text: `El libro "${nuevoLibro.titulo}" se ha guardado exitosamente.`,
      icon: 'success',
      confirmButtonColor: '#0d9488',
      timer: 2000,
      showConfirmButton: false
    });
  }

  // Recalcula el conteo de copias libres y modifica el estado general del libro ('disponible' o 'sin copias')
  private actualizarEstadoLibro(libro: Libro): void {
    libro.copias = libro.listaCopias.filter(c => c.estado === 'Disponible').length;
    libro.estado = libro.copias === 0 ? 'sin copias' : 'disponible';
  }

  // Propiedad computada que filtra en tiempo real los libros según la barra de búsqueda
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