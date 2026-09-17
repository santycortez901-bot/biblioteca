import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Prestamo, EstadoPrestamo } from '../models/models/prestamo';
import { PrestamoService } from '../services/prestamo';
import { Socio } from '../models/models/socio';
import { SocioServicio } from '../services/socio';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css'
})
export class Prestamos {
  prestamos: Prestamo[] = [];
  busqueda: string = '';
  filtro: 'todos' | 'activo' | 'atrasado' = 'todos';

  // Control del Modal
  isModalOpen = false;

  // Variables del Formulario
  socioSeleccionadoId: number | null = null;
  libro: string = '';
  inventario: string = '';
  fechaInicio: string = '';
  fechaVencimiento: string = '';

  constructor(
    private prestamoService: PrestamoService,
    private socioService: SocioServicio
  ) {
    this.actualizarPrestamos();
  }

  // Lista de socios activos para desplegar en el select del modal
  get sociosDisponibles(): Socio[] {
    return this.socioService.tenerSocios().filter(s => s.estado === 'activo');
  }

  actualizarPrestamos(): void {
    this.prestamos = this.prestamoService
      .obtenerPrestamos()
      .filter(p => p.estado !== 'devuelto');
  }

  get prestamosFiltrados(): Prestamo[] {
    const texto = this.busqueda.toLowerCase().trim();

    return this.prestamos.filter(p => {
      if (p.estado === 'devuelto') return false;

      const coincideBusqueda =
        p.id.toLowerCase().includes(texto) ||
        p.socio.toLowerCase().includes(texto) ||
        p.libro.toLowerCase().includes(texto) ||
        p.inventario.toLowerCase().includes(texto);

      const coincideFiltro =
        this.filtro === 'todos' || p.estado === this.filtro;

      return coincideBusqueda && coincideFiltro;
    });
  }

  cambiarFiltro(filtro: 'todos' | 'activo' | 'atrasado'): void {
    this.filtro = filtro;
  }

  // Método auxiliar opcional para obtener un socio por ID o Nombre si se requiere en plantilla
  obtenerSocio(identificador: number | string): Socio | undefined {
    return this.socioService
      .tenerSocios()
      .find(s => s.id === identificador || s.nombre === identificador);
  }

  // Formatea un objeto Date a string YYYY-MM-DD para el input date
  private obtenerFechaFormateada(diasAgregar: number = 0): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasAgregar);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  openModal(): void {
    this.isModalOpen = true;
    this.establecerFechasAutomaticas();
  }

  establecerFechasAutomaticas(): void {
    this.fechaInicio = this.obtenerFechaFormateada(0);      // Hoy
    this.fechaVencimiento = this.obtenerFechaFormateada(30); // Hoy + 30 días
  }

  limpiarFormulario(): void {
    this.socioSeleccionadoId = null;
    this.libro = '';
    this.inventario = '';
    this.fechaInicio = '';
    this.fechaVencimiento = '';
  }
    
  closeModal(): void {
    this.isModalOpen = false;
    this.limpiarFormulario();
  }

  crearPrestamo(): void {
    if (
      !this.socioSeleccionadoId ||
      !this.libro.trim() ||
      !this.inventario.trim() ||
      !this.fechaInicio ||
      !this.fechaVencimiento
    ) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, completá todos los campos requeridos.',
        icon: 'warning',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    const socioObj = this.socioService
      .tenerSocios()
      .find(s => s.id === Number(this.socioSeleccionadoId));

    if (!socioObj) return;

    const listaActual = this.prestamoService.obtenerPrestamos();
    const numero = listaActual.length + 1;
    const idGenerado = `PR${String(numero).padStart(3, '0')}`;

    const nuevoPrestamo: Prestamo = {
      id: idGenerado,
      socio: socioObj.nombre,
      libro: this.libro.trim(),
      inventario: this.inventario.trim(),
      fechaInicio: this.fechaInicio,
      fechaVencimiento: this.fechaVencimiento,
      estado: 'activo' as EstadoPrestamo,
      renovaciones: 0
    };

    this.prestamoService.agregarPrestamo(nuevoPrestamo);
    this.socioService.actualizarEstadoPrestamo(socioObj.id, 'Encurso');

    this.actualizarPrestamos();
    this.closeModal();

    Swal.fire({
      title: '¡Préstamo Creado!',
      text: 'Se creó el préstamo con éxito.',
      icon: 'success',
      confirmButtonColor: '#0d9488',
      timer: 2000,
      showConfirmButton: false
    });
  }

  renovarPrestamo(prestamo: Prestamo): void {
    const socioObj = this.socioService
      .tenerSocios()
      .find(s => s.nombre === prestamo.socio);

    this.prestamoService.renovarPrestamo(prestamo.id);
    this.actualizarPrestamos();

    // Recupera el préstamo recién actualizado para leer la nueva fecha de vencimiento
    const prestamoActualizado = this.prestamos.find(p => p.id === prestamo.id) || prestamo;

    if (socioObj && socioObj.telefono) {
      const mensaje = `Hola ${socioObj.nombre}, se ha renovado con éxito tu préstamo del libro "${prestamoActualizado.libro}". Tu nueva fecha de vencimiento es ${prestamoActualizado.fechaVencimiento}.`;
      let tel = socioObj.telefono.replace(/[^0-9]/g, '');

      if (tel.startsWith('54') && !tel.startsWith('549')) {
        tel = '549' + tel.slice(2);
      } else if (!tel.startsWith('54')) {
        tel = '549' + tel;
      }

      const url = `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    }
  }

  devolverPrestamo(prestamo: Prestamo): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas marcar como devuelto el préstamo de "${prestamo.libro}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, devolver',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const socioObj = this.socioService
          .tenerSocios()
          .find(s => s.nombre === prestamo.socio);

        this.prestamoService.devolverPrestamo(prestamo.id);

        if (socioObj) {
          this.socioService.actualizarEstadoPrestamo(socioObj.id, 'Libre');
        }

        this.actualizarPrestamos();

        Swal.fire({
          title: '¡Devuelto!',
          text: 'El préstamo ha sido devuelto correctamente.',
          icon: 'success',
          confirmButtonColor: '#0d9488',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}