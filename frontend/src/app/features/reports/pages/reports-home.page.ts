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
    <section class="screen">
      <app-module-header moduleTitle="Reportes" sectionTitle=""></app-module-header>

      <section class="reports-panel">
        <header class="panel-header">
          <div class="panel-copy">
            <span class="panel-kicker">Centro de reportes</span>
            <h2>Reportes disponibles</h2>
            <p>Accede a los reportes operativos actuales y deja lista la navegacion para nuevos reportes a futuro.</p>
          </div>
        </header>

        <div class="report-grid">
          <article
            *ngFor="let report of reports"
            class="report-card"
            [class.report-card--available]="report.status === 'available'"
            [class.report-card--upcoming]="report.status === 'upcoming'"
          >
            <div class="report-card-copy">
              <span
                class="report-card-kicker"
                [class.report-card-kicker--available]="report.status === 'available'"
                [class.report-card-kicker--upcoming]="report.status === 'upcoming'"
              >
                {{ report.status === 'available' ? 'Disponible' : 'Proximamente' }}
              </span>
              <h3>{{ report.title }}</h3>
              <p>{{ report.description }}</p>
            </div>

            <ul class="report-details" *ngIf="report.details.length > 0">
              <li *ngFor="let detail of report.details">{{ detail }}</li>
            </ul>

            <small class="report-caption" *ngIf="report.caption">{{ report.caption }}</small>

            <app-action-bar align="start" *ngIf="report.href && report.ctaLabel">
              <app-ui-button variant="primary" [routerLink]="report.href!" [wide]="true">
                {{ report.ctaLabel }}
              </app-ui-button>
            </app-action-bar>
          </article>
        </div>
      </section>
    </section>
  `,
  styles: [`
    .screen {
      width: min(100%, var(--content-medium-max));
      margin: 0 auto;
      display: grid;
      gap: 16px;
    }

    .reports-panel {
      display: grid;
      gap: 18px;
      padding: 22px;
      border: 1px solid var(--border);
      border-radius: 22px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 250, 244, 0.84) 100%);
      box-shadow: 0 18px 34px rgba(73, 44, 24, 0.06);
    }

    .panel-copy {
      display: grid;
      gap: 4px;
      max-width: 620px;
    }

    .panel-kicker {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .panel-copy h2 {
      margin: 0;
      font-size: clamp(1.2rem, 1.6vw, 1.42rem);
      line-height: var(--line-height-tight);
      color: var(--text-strong);
      font-weight: 700;
    }

    .panel-copy p {
      margin: 0;
      color: var(--muted);
      font-size: var(--font-size-caption);
      line-height: 1.45;
    }

    .report-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .report-card {
      display: grid;
      gap: 14px;
      padding: 18px;
      border-radius: 18px;
      border: 1px solid rgba(103, 86, 67, 0.14);
      background: rgba(255, 255, 255, 0.78);
      min-height: 100%;
      align-content: start;
      transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        border-color 180ms ease;
    }

    .report-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 28px rgba(73, 44, 24, 0.08);
    }

    .report-card--available {
      border-color: rgba(49, 119, 165, 0.22);
    }

    .report-card--upcoming {
      background: rgba(255, 250, 244, 0.72);
    }

    .report-card-copy {
      display: grid;
      gap: 4px;
    }

    .report-card-kicker {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      min-height: 28px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: var(--font-size-kicker);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border: 1px solid transparent;
    }

    .report-card-kicker--available {
      color: #255c80;
      background: rgba(197, 228, 247, 0.62);
      border-color: rgba(49, 119, 165, 0.14);
    }

    .report-card-kicker--upcoming {
      color: #8a4b1f;
      background: rgba(247, 198, 161, 0.34);
      border-color: rgba(166, 111, 63, 0.14);
    }

    .report-card h3 {
      margin: 0;
      font-size: var(--font-size-section-title);
      line-height: var(--line-height-tight);
      color: var(--text-strong);
      font-weight: 700;
    }

    .report-card p {
      margin: 0;
      color: var(--muted);
      font-size: var(--font-size-caption);
      line-height: 1.45;
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

    @media (max-width: 1080px) {
      .report-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .report-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .reports-panel {
        padding: 16px;
        border-radius: 18px;
      }

      .report-card {
        padding: 16px;
      }
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
    },
  ];
}
