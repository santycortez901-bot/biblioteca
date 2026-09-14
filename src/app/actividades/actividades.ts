import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Actividad, TipoActividad } from '../models/models/actividad'; 
// ↑ Cambiá esta ruta si tu archivo está en otra carpeta


@Component({
  selector: 'app-actividades',
  imports: [CommonModule, FormsModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css',
})
export class Actividades {

  // ==========================================
  // ARRAY CON TODAS LAS ACTIVIDADES
  // ==========================================

  actividades: Actividad[] = [

    {
      tipo: 'login',
      descripcion: 'Inicio de sesión del sistema',
      fecha: '28/08/2026 12:00',
      user: 'admin'
    },

    {
      tipo: 'login',
      descripcion: 'Inicio de sesión del sistema',
      fecha: '19/08/2026 10:30',
      user: 'admin'
    },

    {
      tipo: 'prestamo',
      descripcion: 'Nuevo préstamo: Rayuela → Florencia Morales',
      fecha: '19/08/2026 09:15',
      user: 'admin',
      idrelacionado: 'PR005'
    },

    {
      tipo: 'cuota',
      descripcion: 'Cuota cobrada: María González — Julio 2026 ($1.200)',
      fecha: '18/08/2026 16:20',
      user: 'admin',
      idrelacionado: 'S001'
    },

    {
      tipo: 'socio',
      descripcion: 'Nuevo socio registrado: Pablo Torres (CAR010)',
      fecha: '18/08/2026 14:45',
      user: 'admin',
      idrelacionado: 'S010'
    },

    {
      tipo: 'libro',
      descripcion: 'Nuevo libro registrado: Cien años de soledad',
      fecha: '17/08/2026 11:30',
      user: 'admin',
      idrelacionado: 'L001'
    },

    {
      tipo: 'eliminacion',
      descripcion: 'Libro eliminado: Don Quijote de la Mancha',
      fecha: '16/08/2026 10:15',
      user: 'admin',
      idrelacionado: 'L002'
    },

    {
      tipo: 'edicion',
      descripcion: 'Libro editado: El Principito',
      fecha: '15/08/2026 16:40',
      user: 'admin',
      idrelacionado: 'L003'
    }

  ];


  // ==========================================
  // ARRAY QUE SE MUESTRA EN LA TABLA
  // ==========================================

  actividadesFiltradas: Actividad[] = [];


  // ==========================================
  // FILTRO ACTUAL
  // ==========================================

  filtroActual: TipoActividad | 'todos' = 'todos';


  // ==========================================
  // TEXTO DEL BUSCADOR
  // ==========================================

  textoBusqueda: string = '';


  // ==========================================
  // FECHA SELECCIONADA
  // ==========================================

  fechaSeleccionada: string = '';


  // ==========================================
  // AL INICIAR EL COMPONENTE
  // ==========================================

  ngOnInit(): void {

    // Al principio mostramos todas
    this.actividadesFiltradas = [...this.actividades];

  }


  // ==========================================
  // FILTRAR POR TIPO
  // ==========================================

  filtrarPorTipo(tipo: TipoActividad | 'todos'): void {

    this.filtroActual = tipo;

    this.aplicarFiltros();

  }


  // ==========================================
  // BUSCAR
  // ==========================================

  buscar(): void {

    this.aplicarFiltros();

  }


  // ==========================================
  // FILTRAR POR FECHA
  // ==========================================

  filtrarPorFecha(): void {

    this.aplicarFiltros();

  }


  // ==========================================
  // APLICAR TODOS LOS FILTROS
  // ==========================================

  private aplicarFiltros(): void {

    const texto = this.textoBusqueda
      .toLowerCase()
      .trim();


    this.actividadesFiltradas = this.actividades.filter(
      (actividad: Actividad) => {


        // --------------------------------------
        // FILTRO POR TIPO
        // --------------------------------------

        const coincideTipo =
          this.filtroActual === 'todos' ||
          actividad.tipo === this.filtroActual;


        // --------------------------------------
        // FILTRO POR TEXTO
        // --------------------------------------

        const coincideBusqueda =
          texto === '' ||

          actividad.descripcion
            .toLowerCase()
            .includes(texto) ||

          actividad.user
            .toLowerCase()
            .includes(texto) ||

          (
            actividad.idrelacionado
              ?.toLowerCase()
              .includes(texto)
            ?? false
          );


        // --------------------------------------
        // FILTRO POR FECHA
        // --------------------------------------

        let coincideFecha = true;


        if (this.fechaSeleccionada) {

          /*
            El input type="date" devuelve:

            YYYY-MM-DD

            Ejemplo:

            2026-08-19


            Pero nuestras actividades tienen:

            DD/MM/YYYY HH:mm

            Ejemplo:

            19/08/2026 09:15
          */

          const partes =
            this.fechaSeleccionada.split('-');


          const fechaBuscada =
            `${partes[2]}/${partes[1]}/${partes[0]}`;


          const fechaActividad =
            actividad.fecha.substring(0, 10);


          coincideFecha =
            fechaActividad === fechaBuscada;

        }


        // --------------------------------------
        // LA ACTIVIDAD DEBE CUMPLIR TODO
        // --------------------------------------

        return (
          coincideTipo &&
          coincideBusqueda &&
          coincideFecha
        );

      }
    );

  }


  // ==========================================
  // SABER SI UN FILTRO ESTÁ ACTIVO
  // ==========================================

  esFiltroActivo(tipo: TipoActividad | 'todos'): boolean {

    return this.filtroActual === tipo;

  }

}