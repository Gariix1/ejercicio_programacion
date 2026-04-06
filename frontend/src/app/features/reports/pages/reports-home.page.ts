import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActionBarComponent } from '../../../shared/action-bar.component';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';
import { UiButtonComponent } from '../../../shared/ui-button.component';

interface ReportCard {
  title: string;
  status: 'available' | 'upcoming';
  description: string;
  details: string[];
  caption?: string;
  ctaLabel?: string;
  href?: string;
}

@Component({
  selector: 'app-reports-home-page',
  standalone: true,
  imports: [NgFor, NgIf, ActionBarComponent, ModuleHeaderComponent, UiButtonComponent],
  template: `
    <section class="app-page-shell app-page-shell--wide">
      <app-module-header moduleTitle="Reportes" sectionTitle=""></app-module-header>

      <section class="app-surface-panel reports-panel">
        <header class="app-panel-header">
          <div class="app-panel-copy">
            <span class="app-panel-kicker">Centro de reportes</span>
            <h2 class="app-panel-title">Reportes disponibles</h2>
            <p class="app-panel-description">Accede a los reportes operativos actuales y deja lista la navegacion para nuevos reportes a futuro.</p>
          </div>
        </header>

        <div class="report-grid">
          <article
            *ngFor="let report of reports"
            class="app-section-card"
            [class.report-card--available]="report.status === 'available'"
            [class.app-section-card--soft]="report.status === 'upcoming'"
          >
            <div class="app-section-card-copy">
              <span
                class="app-status-pill"
                [class.app-status-pill--info]="report.status === 'available'"
                [class.app-status-pill--warning]="report.status === 'upcoming'"
              >
                {{ report.status === 'available' ? 'Disponible' : 'Proximamente' }}
              </span>
              <h3 class="app-section-card-title">{{ report.title }}</h3>
              <p class="app-section-card-description">{{ report.description }}</p>
            </div>

            <ul class="report-details" *ngIf="report.details.length > 0">
              <li *ngFor="let detail of report.details">{{ detail }}</li>
            </ul>

            <small class="report-caption" *ngIf="report.caption">{{ report.caption }}</small>

            <app-action-bar align="start" *ngIf="report.ctaLabel">
              <app-ui-button
                [variant]="report.status === 'available' ? 'primary' : 'outline-secondary'"
                [routerLink]="report.href ?? null"
                [disabled]="report.status !== 'available'"
                [wide]="true"
              >
                {{ report.ctaLabel }}
              </app-ui-button>
            </app-action-bar>
          </article>
        </div>
      </section>
    </section>
  `,
  styles: [`
    .reports-panel {
      width: 100%;
    }

    .report-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .report-card--available {
      border-color: rgba(49, 119, 165, 0.22);
    }

    .report-details {
      margin: 0;
      padding-left: 18px;
      color: var(--text);
      display: grid;
      gap: 8px;
      font-size: 0.9rem;
    }

    .report-details li::marker {
      color: #3177a5;
    }

    .report-caption {
      color: var(--text-soft);
      font-size: 0.82rem;
      line-height: 1.4;
    }
  `],
})
export class ReportsHomePageComponent {
  protected readonly reports: ReportCard[] = [
    {
      title: 'Reporte de empleados',
      status: 'available',
      description: 'Consulta empleados con filtros, ordenamiento, scroll horizontal y columnas ampliadas para seguimiento operativo.',
      details: [
        'Busqueda por nombre y codigo',
        'Ordenamiento por columnas clave',
        'Resumen de empleados, vigentes, retirados y sueldo promedio',
      ],
      caption: 'Como una consulta operativa y navegacion detallada.',
      ctaLabel: 'Abrir reporte',
      href: '/reports/employees',
    },
    {
      title: 'Reporte de asistencia',
      status: 'upcoming',
      description: 'Permitira revisar presencia, faltas, atrasos y comportamiento diario de asistencia por empleado o periodo.',
      details: [
        'Filtros por rango de fechas y equipo',
        'Indicadores de faltas, atrasos y ausencias justificadas',
        'Base preparada para integrarlo despues.',
      ],
      caption: 'Buen siguiente candidato si luego ampliamos el sistema con control horario.',
      ctaLabel: 'Abrir reporte',
    },
    {
      title: 'Reporte de nomina',
      status: 'upcoming',
      description: 'Servira para consolidar pagos, valores devengados, descuentos y resumen economico por empleado o corte.',
      details: [
        'Vista por periodo de pago y area',
        'Resumen de sueldos, descuentos y totales',
        'Futuros modulos de compensacion y cierre mensual',
      ],
      caption: 'Queda por si la seccion de reportes crece con una ruta clara.',
      ctaLabel: 'Abrir reporte',
    },
  ];
}
