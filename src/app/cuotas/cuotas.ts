import { Component, OnInit } from '@angular/core';
import { Cuota } from '../models/models/cuota';
import { CuotasService } from '../services/cuotas-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cuotas',
  imports: [FormsModule],
  templateUrl: './cuotas.html', 
  styleUrl: './cuotas.css',
})
export class Cuotas {
  cuotas: Cuota[] = [
    { id: 'SOC-001', nombreSocio: 'Nacho Maldonado', dni: '40123456', estado: 'pendiente', numSocio: 5491123456789 },
    { id: 'SOC-002', nombreSocio: 'María Belén Gómez', dni: '38987654', estado: 'pagada', numSocio: 5491198765432 },
    { id: 'SOC-003', nombreSocio: 'Lucas Fernández', dni: '41555666', estado: 'vencida', numSocio: 5491155554444 },
    { id: 'SOC-004', nombreSocio: 'Sofia Rodríguez', dni: '39222333', estado: 'vencida', numSocio: 5491133332222 },
    { id: 'SOC-005', nombreSocio: 'Gonzalo Pérez', dni: '42888999', estado: 'pendiente', numSocio: 5491144448888 },
    { id: 'SOC-006', nombreSocio: 'Valentina Martínez', dni: '37444111', estado: 'vencida', numSocio: 5491177771111 }
  ];

  filtroActivo: string = 'todos';
  terminoBusqueda: string = ''; // Variable del buscador

  constructor(private cuotaService: CuotasService) {}

  filtrarPorEstado(estado: string): void {
    this.filtroActivo = estado;
  }

  // Ejecuta la combinación de filtros (Buscador + Botón de Estado)
  get cuotasFiltradas(): Cuota[] {
    let resultado = this.cuotas;

    // 1. Filtro por botones
    if (this.filtroActivo !== 'todos') {
      resultado = resultado.filter(cuota => cuota.estado === this.filtroActivo);
    }

    // 2. Filtro por barra de búsqueda
    if (this.terminoBusqueda.trim() !== '') {
      const busqueda = this.terminoBusqueda.toLowerCase().trim();
      resultado = resultado.filter(cuota => 
        cuota.nombreSocio.toLowerCase().includes(busqueda) || 
        cuota.dni.includes(busqueda) ||                       
        cuota.id.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  }

  // 👈 AQUÍ SOLUCIONAMOS LOS ERRORES 2 Y 3:
  // Como tu servicio actual modifica directamente los datos y no devuelve una lista, 
  // solo le pasamos el 'id' (1 argumento) y modificamos el estado de forma interna.
  cobrar(id: string): void {
    // 1. Mostramos la barra de confirmación (devuelve true si eligen Aceptar o false si eligen Cancelar)
    const confirmarCobro = confirm('¿Estás seguro de que deseas cobrar esta cuota?');

    // 2. Si el usuario cancela la operación, cortamos la ejecución de la función con un return
    if (!confirmarCobro) {
      return; 
    }

    // 3. Si el usuario confirmó, ejecutamos el proceso de cobro en el servicio
    this.cuotaService.cobrarCuota(id); 
    
    // 4. Actualizamos el estado localmente para refrescar la lista de la pantalla en tiempo real
    this.cuotas = this.cuotas.map(cuota => {
      if (cuota.id === id) {
        return { ...cuota, estado: 'pagada' };
      }
      return cuota;
    });

    // 5. Mostramos la alerta final indicando que la acción se completó con éxito
    alert('¡Cuota cobrada con éxito!');
  }

  notificarSocio(cuota: Cuota): void {
    this.cuotaService.enviarRecordatorioWhatsApp(cuota);
  }
}