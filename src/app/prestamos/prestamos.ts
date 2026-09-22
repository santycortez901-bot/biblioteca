import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Prestamo, EstadoPrestamo } from '../models/models/prestamo';
import { PrestamoService } from '../services/prestamo';
import { Socio } from '../models/models/socio';
import { SocioServicio } from '../services/socio';
import { LibroService, Libro, Copia } from '../services/libro-service';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css'
})
export class Prestamos implements OnInit, OnDestroy {
  prestamos: Prestamo[] = [];
  librosDisponibles: Libro[] = [];
  busqueda: string = '';
  filtro: 'todos' | 'activo' | 'atrasado' = 'todos';

  isModalOpen = false;
  socioSeleccionadoId: number | null = null;
  libroSeleccionadoId: string = '';
  inventario: string = '';
  copiasDisponiblesParaPrestamo: Copia[] = [];
  fechaInicio: string = '';
  fechaVencimiento: string = '';

  private sub: Subscription = new Subscription();

  constructor(
    private prestamoService: PrestamoService,
    private socioService: SocioServicio,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {
    this.actualizarPrestamos();
    this.sub = this.libroService.libros$.subscribe(libros => {
      this.librosDisponibles = libros.filter(l => l.copias > 0);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get sociosDisponibles(): Socio[] {
    return this.socioService.tenerSocios().filter(s => s.estado === 'activo');
  }

  actualizarPrestamos(): void {
    this.prestamos = this.prestamoService.obtenerPrestamos().filter(p => p.estado !== 'devuelto');
  }

  get prestamosFiltrados(): Prestamo[] {
    const texto = this.busqueda.toLowerCase().trim();
    return this.prestamos.filter(p => {
      if (p.estado === 'devuelto') return false;
      const coincideBusqueda = p.id.toLowerCase().includes(texto) || p.socio.toLowerCase().includes(texto) || p.libro.toLowerCase().includes(texto) || p.inventario.toLowerCase().includes(texto);
      const coincideFiltro = this.filtro === 'todos' || p.estado === this.filtro;
      return coincideBusqueda && coincideFiltro;
    });
  }

  cambiarFiltro(filtro: 'todos' | 'activo' | 'atrasado'): void {
    this.filtro = filtro;
  }

  onLibroChange(): void {
    this.inventario = '';
    const libroObj = this.librosDisponibles.find(l => l.id === this.libroSeleccionadoId);
    this.copiasDisponiblesParaPrestamo = libroObj ? libroObj.listaCopias.filter(c => c.estado === 'Disponible') : [];
  }

  private obtenerFechaFormateada(dias: number = 0): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0];
  }

  openModal(): void {
    this.isModalOpen = true;
    this.fechaInicio = this.obtenerFechaFormateada(0);
    this.fechaVencimiento = this.obtenerFechaFormateada(30);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.socioSeleccionadoId = null;
    this.libroSeleccionadoId = '';
    this.inventario = '';
    this.copiasDisponiblesParaPrestamo = [];
  }

  crearPrestamo(): boolean {
    if (!this.socioSeleccionadoId || !this.libroSeleccionadoId || !this.inventario.trim()) return false;

    const socioObj = this.socioService.tenerSocios().find(s => s.id === Number(this.socioSeleccionadoId));
    const libroObj = this.librosDisponibles.find(l => l.id === this.libroSeleccionadoId);

    if (!socioObj || !libroObj) return false;

    const nuevoPrestamo: any = {
      id: `PR${String(this.prestamoService.obtenerPrestamos().length + 1).padStart(3, '0')}`,
      socio: socioObj.nombre,
      libro: libroObj.titulo,
      libroId: libroObj.id, // <-- Clave para que el servicio de libros se entere
      inventario: this.inventario.trim(),
      fechaInicio: this.fechaInicio,
      fechaVencimiento: this.fechaVencimiento,
      estado: 'activo' as EstadoPrestamo,
      renovaciones: 0
    };

    if (this.prestamoService.agregarPrestamo(nuevoPrestamo)) {
      this.socioService.actualizarEstadoPrestamo(socioObj.id, 'Encurso');
      this.actualizarPrestamos();
      this.closeModal();
      return true;
    }

    return false;
  }

  renovarPrestamo(prestamo: Prestamo): void {
    const socioObj = this.socioService.tenerSocios().find(s => s.nombre === prestamo.socio);
    this.prestamoService.renovarPrestamo(prestamo.id);
    this.actualizarPrestamos();

    if (socioObj?.telefono) {
      const actualizado = this.prestamos.find(p => p.id === prestamo.id) || prestamo;
      const mensaje = `Hola ${socioObj.nombre}, se ha renovado tu préstamo del libro "${actualizado.libro}". Vence el ${actualizado.fechaVencimiento}.`;
      let tel = socioObj.telefono.replace(/[^0-9]/g, '');
      if (tel.startsWith('54') && !tel.startsWith('549')) tel = '549' + tel.slice(2);
      else if (!tel.startsWith('54')) tel = '549' + tel;
      window.open(`https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`, '_blank');
    }
  }

  devolverPrestamo(prestamo: Prestamo): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas devolver "${prestamo.libro}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, devolver',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (res.isConfirmed) {
        const socioObj = this.socioService.tenerSocios().find(s => s.nombre === prestamo.socio);
        this.prestamoService.devolverPrestamo(prestamo.id);
        if (socioObj) this.socioService.actualizarEstadoPrestamo(socioObj.id, 'Libre');
        this.actualizarPrestamos();
      }
    });
  }
}