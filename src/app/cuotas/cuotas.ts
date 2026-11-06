import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 Asegura que reconozca directivas básicas
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Socio } from '../models/models/socio';
import { CuotasService } from '../services/cuotas-service';
import { ActividadServicio } from '../services/actividade-service';

@Component({
  selector: 'app-cuotas',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Mantenemos ambos módulos para el HTML
  templateUrl: './cuotas.html', 
  styleUrl: './cuotas.css',
})
export class Cuotas implements OnInit {
  cuotas: Socio[] = []; 
  filtroActivo: string = 'todos';
  terminoBusqueda: string = ''; 

  constructor(
    private cuotaService: CuotasService,
    private actividadServicio: ActividadServicio,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filtroActivo =
      this.route.snapshot.queryParamMap.get('filtro') || 'todos';
    this.cargarCuotas();
  }

  cargarCuotas(): void {
    this.cuotaService.cargarCuotas().subscribe({
      next: socios => {
        this.cuotas = socios;
        this.changeDetector.markForCheck();
      },
      error: error => this.mostrarErrorApi(error)
    });
  }

  filtrarPorEstado(estado: string): void {
    this.filtroActivo = estado;
  }

  puedeCobrarCuota(socio: Socio): boolean {
    return socio.estado !== 'inactivo' && socio.cuota !== 'pagada';
  }

  // ⬇️ REPOSTERÍA DEL GETTER QUE SE HABÍA BORRADO ⬇️
  get cuotasFiltradas(): Socio[] {
    let resultado = this.cuotas;

    // Filtro por botones de estado
    if (this.filtroActivo !== 'todos') {
      resultado = resultado.filter(socio =>
        this.filtroActivo === 'inactivo'
          ? socio.estado === 'inactivo'
          : socio.estado !== 'inactivo' && socio.cuota === this.filtroActivo
      );
    }

    // Filtro por buscador (nombre, DNI o carnet)
    if (this.terminoBusqueda.trim() !== '') {
      const busqueda = this.terminoBusqueda.toLowerCase().trim();
      resultado = resultado.filter(socio => 
        socio.nombre.toLowerCase().includes(busqueda) || 
        socio.dni.includes(busqueda) ||                       
        socio.numCarnet.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  }

  cobrar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cobrar esta cuota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, cobrar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        const socioCobrar = this.cuotas.find(socio => socio.id === id);
        this.cuotaService.cobrarCuota(id).subscribe({
          next: () => {
            if (socioCobrar) {
              this.actividadServicio.registrarActividad(
                'cuota',
                `Cuota cobrada: ${socioCobrar.nombre}`,
                String(socioCobrar.id)
              );
            }
            this.cargarCuotas();
            void Swal.fire({
              title: '¡Cuota Pagada!',
              text: `La cuota del socio "${socioCobrar?.nombre}" se ha cobrado exitosamente.`,
              icon: 'success',
              confirmButtonColor: '#0d9488',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: error => this.mostrarErrorApi(error)
        });
      }
    });
  }

  notificarSocio(socio: Socio): void {
    this.cuotaService.enviarRecordatorioWhatsApp(socio);
    this.actividadServicio.registrarActividad(
      'cuota',
      `Recordatorio de cuota preparado para WhatsApp: ${socio.nombre}`,
      String(socio.id)
    );
  }

 darDeBaja(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se cambiará el estado del socio a "Inactivo" y se abrirá el aviso por WhatsApp.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444', 
    cancelButtonColor: '#6b7280',  
    confirmButtonText: 'Sí, dar de baja',
    cancelButtonText: 'Cancelar'
  }).then((res) => {
    if (res.isConfirmed) {
      const socio = this.cuotas.find(s => s.id === id);

      this.cuotaService.darDeBaja(id).subscribe({
        next: () => {
          if (socio) {
            this.cuotaService.notificarCambioEstado(socio, 'inactivo');
            this.actividadServicio.registrarActividad(
              'cuota',
              `Socio dado de baja desde cuotas: ${socio.nombre}`,
              String(socio.id)
            );
          }
          this.cargarCuotas();
        },
        error: error => this.mostrarErrorApi(error)
      });
    }
  });
}

  darDeAlta(id: number): void {
    const socio = this.cuotas.find(s => s.id === id);

    Swal.fire({
      title: '¿Dar de alta al socio?',
      text: `El socio "${socio?.nombre}" volverá a estar activo.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, dar de alta',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        this.cuotaService.darDeAlta(id).subscribe({
          next: () => {
            if (socio) {
              this.cuotaService.notificarCambioEstado(socio, 'activo');
              this.actividadServicio.registrarActividad(
                'cuota',
                `Socio dado de alta desde cuotas: ${socio.nombre}`,
                String(socio.id)
              );
            }
            this.cargarCuotas();
          },
          error: error => this.mostrarErrorApi(error)
        });
      }
    });
  }

  private mostrarErrorApi(error: unknown): void {
    const mensaje = error instanceof Error ? error.message : 'No se pudo completar la operación en la API.';
    void Swal.fire({
      title: 'Error de conexión con la API',
      text: mensaje,
      icon: 'error',
      confirmButtonColor: '#0d9488'
    });
  }
}