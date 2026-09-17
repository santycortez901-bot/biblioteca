import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Actividad,
  TipoActividad
} from '../models/models/actividad';

import { ActividadServicio } from '../services/actividade-service';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actividades.html',
  styleUrl: './actividades.css'
})
export class Actividades implements OnInit {

  // ==========================================
  // ARRAY CON TODAS LAS ACTIVIDADES
  // ==========================================

  actividades: Actividad[] = [];


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
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private actividadServicio: ActividadServicio
  ) {}


  // ==========================================
  // AL INICIAR EL COMPONENTE
  // ==========================================

  ngOnInit(): void {

    // Obtener las actividades guardadas en el servicio
    this.actividades =
      this.actividadServicio.obtenerActividades();

    // Mostrar todas al principio
    this.actividadesFiltradas =
      [...this.actividades];

  }


  // ==========================================
  // FILTRAR POR TIPO
  // ==========================================

  filtrarPorTipo(
    tipo: TipoActividad | 'todos'
  ): void {

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

    const texto =
      this.textoBusqueda
        .toLowerCase()
        .trim();


    this.actividadesFiltradas =
      this.actividades.filter(
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

  esFiltroActivo(
    tipo: TipoActividad | 'todos'
  ): boolean {

    return this.filtroActual === tipo;

  }

}

