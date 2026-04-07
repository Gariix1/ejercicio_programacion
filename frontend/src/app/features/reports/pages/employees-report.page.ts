import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { firstValueFrom, combineLatest, map, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionBarComponent } from '../../../shared/action-bar.component';
import { ExportFormatOption, ExportModalComponent, ExportPreviewMetric } from '../../../shared/export-modal.component';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';
import { PaginationControlsComponent } from '../../../shared/pagination-controls.component';
import { ExportColumn, ReportExportService } from '../../../shared/report-export.service';
import { ProcessFeedbackModalComponent, ProcessFeedbackState } from '../../../shared/process-feedback-modal.component';
import { ensureMinimumProcessFeedbackDuration } from '../../../shared/process-feedback.utils';
import { StatStripComponent } from '../../../shared/stat-strip.component';
import { UiButtonComponent } from '../../../shared/ui-button.component';
import { Employee, EmployeeListQuery, EmployeeSortField } from '../../employees/models/employee.model';
import { ReportsApiService } from '../data-access/reports-api.service';
import { ReportFiltersComponent, ReportFiltersValue } from '../components/report-filters.component';
import { DEFAULT_REPORT_COLUMNS } from '../components/report-table.columns';
import { ReportTableComponent } from '../components/report-table.component';

@Component({
  selector: 'app-employees-report-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    ActionBarComponent,
    ModuleHeaderComponent,
    PaginationControlsComponent,
    StatStripComponent,
    UiButtonComponent,
    ProcessFeedbackModalComponent,
    ExportModalComponent,
    ReportFiltersComponent,
    ReportTableComponent,
  ],
  template: `
    <section class="d-grid gap-3 w-100">
      <ng-container *ngIf="vm$ | async as vm">
        <div class="app-page-max-shell">
          <app-module-header
            moduleTitle="Reportes"
            sectionTitle="Reporte de empleados"
          ></app-module-header>

          <section class="app-surface-panel app-surface-panel--compact">
            <header class="app-panel-header">
              <div class="app-panel-copy app-panel-copy--wide">
                <span class="app-panel-kicker">Consulta de empleados</span>
                <h2 class="app-panel-title">Reporte operativo del catalogo</h2>
              </div>

              <app-action-bar align="end">
                <app-ui-button variant="outline-primary" (click)="openExportModal()">
                  Exportar
                </app-ui-button>
                <app-ui-button
                  *ngIf="moduleBackLink"
                  variant="link"
                  [routerLink]="moduleBackLink"
                >
                  {{ moduleBackLabel }}
                </app-ui-button>
                <app-ui-button variant="link" routerLink="/reports">Volver a reportes</app-ui-button>
              </app-action-bar>
            </header>

            <app-stat-strip
              ariaLabel="Resumen del reporte"
              [items]="vm.summaryChips"
            ></app-stat-strip>

            <section class="app-panel-section">
              <app-report-filters
                [embedded]="true"
                [activeCount]="vm.activeFilterCount"
                [value]="filters"
                (filtersChange)="onFiltersChange($event)"
              ></app-report-filters>

              <section class="app-filter-chips" *ngIf="vm.activeFilters.length > 0">
                <span class="app-filter-label">Filtros activos:</span>
                <span class="app-filter-chip" *ngFor="let filter of vm.activeFilters">{{ filter }}</span>
              </section>
            </section>
          </section>
        </div>

        <div class="app-page-max-shell">
          <app-report-table
            [result]="vm.report"
            [sortBy]="filters.sortBy"
            [sortDir]="filters.sortDir"
            (sortChange)="onSortChange($event)"
          ></app-report-table>

          <app-pagination-controls
            *ngIf="vm.report.pagination && vm.report.pagination.last_page > 1"
            [currentPage]="vm.report.pagination.current_page"
            [lastPage]="vm.report.pagination.last_page"
            [disablePrevious]="vm.report.pagination.current_page <= 1"
            [disableNext]="vm.report.pagination.current_page >= vm.report.pagination.last_page"
            [statusText]="vm.report.pagination.current_page + ' de ' + vm.report.pagination.last_page"
            (previous)="goToPage(vm.report.pagination.current_page - 1, vm.report.pagination.last_page)"
            (next)="goToPage(vm.report.pagination.current_page + 1, vm.report.pagination.last_page)"
            (pageChange)="goToPage($event, vm.report.pagination.last_page)"
          ></app-pagination-controls>
        </div>

        <app-export-modal
          [open]="isExportModalOpen"
          [busy]="isExporting"
          [title]="'Exportar reporte de empleados'"
          [description]="'Elige el formato y genera una version portable del reporte actual con sus filtros.'"
          [fileName]="buildExportFileName()"
          [formats]="exportFormats"
          [previewMetrics]="buildExportPreviewMetrics(vm)"
          [previewColumns]="exportPreviewColumns"
          [activeFilters]="vm.activeFilters"
          (close)="closeExportModal()"
          (confirm)="onExport($event)"
        ></app-export-modal>

        <app-process-feedback-modal
          [open]="isExportFeedbackOpen"
          [state]="exportFeedbackState"
          [title]="exportFeedbackTitle"
          [description]="exportFeedbackDescription"
          [actionLabel]="exportFeedbackActionLabel"
          [requireActionConfirm]="exportFeedbackRequiresConfirm"
          (close)="closeExportFeedback()"
        ></app-process-feedback-modal>
      </ng-container>
    </section>
  `,
})
export class EmployeesReportPageComponent {
  protected readonly moduleBackLink = (this.route.snapshot.data['moduleBackLink'] as string | null) ?? null;
  protected readonly moduleBackLabel = (this.route.snapshot.data['moduleBackLabel'] as string | null) ?? 'Volver al modulo';
  protected readonly exportFormats: ExportFormatOption[] = [
    {
      id: 'pdf',
      label: 'PDF',
      description: 'Abre una vista previa en otra pestaña, lista para imprimir o guardar como PDF.',
      helper: 'Ideal si quieres revisar el documento en el navegador antes de imprimirlo o conservarlo.',
    },
    {
      id: 'csv',
      label: 'CSV',
      description: 'Descarga los datos en formato tabular para Excel o analisis.',
      helper: 'Conviene si luego quieres filtrar, ordenar o manipular la informacion fuera del sistema.',
    },
    {
      id: 'json',
      label: 'JSON',
      description: 'Descarga una version estructurada lista para integraciones o procesamiento.',
      helper: 'Util si luego quieres consumir el reporte desde scripts, APIs o herramientas tecnicas.',
    },
  ];
  protected readonly exportPreviewColumns = DEFAULT_REPORT_COLUMNS.slice(0, 6).map((column) => column.label);
  protected readonly exportColumns: ExportColumn<Employee>[] = DEFAULT_REPORT_COLUMNS.map((column) => ({
    key: column.key,
    label: column.label,
    value: column.value,
  }));
  protected isExportModalOpen = false;
  protected isExporting = false;
  protected isExportFeedbackOpen = false;
  protected exportFeedbackState: ProcessFeedbackState = 'loading';
  protected exportFeedbackTitle = '';
  protected exportFeedbackDescription = '';
  protected exportFeedbackActionLabel = 'Entendido';
  protected exportFeedbackRequiresConfirm = false;

  protected filters: ReportFiltersValue = {
    nombre: '',
    codigo: '',
    sortBy: 'nombres',
    sortDir: 'asc',
    perPage: 40,
  };

  readonly vm$ = combineLatest([
    this.reportsApiService.summary(),
    this.route.queryParamMap.pipe(
      switchMap((params) => {
        this.filters = this.mapQueryParamsToFilters(params);
        const page = Number(params.get('page') ?? 1);

        return this.reportsApiService.listEmployees({
          nombre: this.filters.nombre.trim(),
          codigo: this.filters.codigo.trim(),
          sortBy: this.filters.sortBy,
          sortDir: this.filters.sortDir,
          page,
          perPage: this.filters.perPage,
        }).pipe(
          map((report) => ({
            report,
            activeFilters: [
              this.filters.nombre ? `Nombre: ${this.filters.nombre}` : null,
              this.filters.codigo ? `Codigo: ${this.filters.codigo}` : null,
              `Orden: ${this.filters.sortBy} ${this.filters.sortDir}`,
              `Filas: ${this.filters.perPage}`,
            ].filter(Boolean) as string[],
          })),
        );
      }),
    ),
  ]).pipe(
    map(([summaryResult, reportState]) => ({
      report: reportState.report,
      activeFilters: reportState.activeFilters,
      activeFilterCount: this.getActiveFilterCount(this.filters),
      summaryChips: [
        { label: 'Total empleados', value: summaryResult.summary.total_empleados },
        { label: 'Vigentes', value: summaryResult.summary.empleados_vigentes },
        { label: 'Retirados', value: summaryResult.summary.empleados_retirados },
        { label: 'Sueldo promedio', value: `$${summaryResult.summary.sueldo_promedio.toFixed(2)}` },
      ],
    })),
  );

  constructor(
    private readonly reportsApiService: ReportsApiService,
    private readonly reportExportService: ReportExportService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  protected openExportModal(): void {
    this.isExportModalOpen = true;
  }

  protected closeExportModal(): void {
    if (!this.isExporting) {
      this.isExportModalOpen = false;
    }
  }

  protected closeExportFeedback(): void {
    if (this.exportFeedbackState === 'loading') {
      return;
    }

    this.isExportFeedbackOpen = false;
  }

  protected onFiltersChange(filters: ReportFiltersValue): void {
    this.filters = filters;

    const nextQueryParams = {
      nombre: filters.nombre || null,
      codigo: filters.codigo || null,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
      perPage: filters.perPage,
      page: 1,
    };

    const currentFilters = this.mapQueryParamsToFilters(this.route.snapshot.queryParamMap);
    const currentPage = Number(this.route.snapshot.queryParamMap.get('page') ?? 1);

    if (
      currentFilters.nombre === filters.nombre
      && currentFilters.codigo === filters.codigo
      && currentFilters.sortBy === filters.sortBy
      && currentFilters.sortDir === filters.sortDir
      && currentFilters.perPage === filters.perPage
      && currentPage === 1
    ) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: nextQueryParams,
      queryParamsHandling: 'merge',
    });
  }

  protected onSortChange(sort: { sortBy: EmployeeSortField; sortDir: 'asc' | 'desc' }): void {
    this.onFiltersChange({
      ...this.filters,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
    });
  }

  protected goToPage(page: number, lastPage: number): void {
    const targetPage = Math.min(Math.max(page, 1), Math.max(lastPage, 1));
    const currentPage = Number(this.route.snapshot.queryParamMap.get('page') ?? 1);

    if (targetPage === currentPage) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: targetPage,
      },
      queryParamsHandling: 'merge',
    });
  }

  protected buildExportPreviewMetrics(vm: {
    report: { items: Employee[]; pagination: { total?: number; last_page?: number } | null };
    activeFilters: string[];
  }): ExportPreviewMetric[] {
    return [
      { label: 'Registros', value: vm.report.pagination?.total ?? vm.report.items.length },
      { label: 'Columnas', value: this.exportColumns.length },
      { label: 'Paginas', value: vm.report.pagination?.last_page ?? 1 },
      { label: 'Filtros', value: vm.activeFilters.length || 'Sin filtros' },
    ];
  }

  protected buildExportFileName(): string {
    const date = new Date().toISOString().slice(0, 10);
    return `reporte-empleados-${date}`;
  }

  protected async onExport(format: string): Promise<void> {
    if (this.isExporting) {
      return;
    }

    this.isExportModalOpen = false;
    this.isExporting = true;
    const printPreviewPath = this.router.url.split('?')[0] || '/reports/employees';
    const loadingCopy = this.buildExportLoadingCopy(format);
    const feedbackStartedAt = performance.now();
    this.openExportFeedback('loading', loadingCopy.title, loadingCopy.description);
    const previewWindow = format === 'pdf'
      ? this.reportExportService.openPreviewWindow('Reporte de empleados', printPreviewPath)
      : null;

    try {
      if (format === 'pdf' && !previewWindow) {
        throw new Error('popup-blocked');
      }

      const vm = await firstValueFrom(this.vm$);
      const rows = await firstValueFrom(this.reportsApiService.exportEmployees(this.buildExportQuery()));
      const documentConfig = {
        fileName: this.buildExportFileName(),
        title: 'Reporte de empleados',
        subtitle: 'Exportacion del catalogo filtrado actual.',
        rows,
        columns: this.exportColumns,
        summary: vm.summaryChips,
        filters: vm.activeFilters,
      };

      if (format === 'csv') {
        this.reportExportService.downloadCsv(documentConfig);
      } else if (format === 'json') {
        this.reportExportService.downloadJson(documentConfig);
      } else {
        this.reportExportService.renderPreviewDocument(previewWindow, documentConfig, printPreviewPath);
      }

      await ensureMinimumProcessFeedbackDuration(feedbackStartedAt);

      const successCopy = this.buildExportSuccessCopy(format);
      this.openExportFeedback(
        'success',
        successCopy.title,
        successCopy.description,
        'Listo',
        true,
      );
    } catch (error) {
      if (previewWindow && !previewWindow.closed) {
        previewWindow.close();
      }

      await ensureMinimumProcessFeedbackDuration(feedbackStartedAt);

      const errorCopy = this.buildExportErrorCopy(format, error);
      this.openExportFeedback('error', errorCopy.title, errorCopy.description, 'Cerrar');
    } finally {
      this.isExporting = false;
    }
  }

  private openExportFeedback(
    state: ProcessFeedbackState,
    title: string,
    description: string,
    actionLabel = 'Entendido',
    requireActionConfirm = false,
  ): void {
    this.exportFeedbackState = state;
    this.exportFeedbackTitle = title;
    this.exportFeedbackDescription = description;
    this.exportFeedbackActionLabel = actionLabel;
    this.exportFeedbackRequiresConfirm = requireActionConfirm;
    this.isExportFeedbackOpen = true;
  }

  private buildExportLoadingCopy(format: string): { title: string; description: string } {
    switch (format) {
      case 'pdf':
        return {
          title: 'Preparando PDF',
          description: 'Estamos preparando una vista previa que se abrira en otra pestaña para que puedas imprimirla o guardarla como PDF.',
        };
      case 'json':
        return {
          title: 'Generando JSON',
          description: 'Estamos serializando el reporte para que puedas reutilizarlo en integraciones o scripts.',
        };
      default:
        return {
          title: 'Generando CSV',
          description: 'Estamos preparando el archivo tabular del reporte actual.',
        };
    }
  }

  private buildExportSuccessCopy(format: string): { title: string; description: string } {
    switch (format) {
      case 'pdf':
        return {
          title: 'PDF listo',
          description: 'Se abrio una vista previa del reporte en una nueva pestaña, sin sacarte de la aplicacion.',
        };
      case 'json':
        return {
          title: 'JSON listo',
          description: 'La descarga del archivo estructurado comenzo correctamente.',
        };
      default:
        return {
          title: 'CSV listo',
          description: 'La descarga del archivo tabular comenzo correctamente.',
        };
    }
  }

  private buildExportErrorCopy(format: string, error: unknown): { title: string; description: string } {
    if (format === 'pdf' && error instanceof Error && error.message === 'popup-blocked') {
      return {
        title: 'No pudimos abrir el PDF',
        description: 'Tu navegador bloqueo la nueva pestaña de vista previa. Permite las ventanas emergentes e intentalo otra vez.',
      };
    }

    return {
      title: 'No pudimos exportar el reporte',
      description: format === 'pdf'
        ? 'Ocurrio un problema mientras preparabamos la vista previa exportable del reporte.'
        : 'Ocurrio un problema mientras preparabamos el archivo exportable.',
    };
  }

  private mapQueryParamsToFilters(params: import('@angular/router').ParamMap): ReportFiltersValue {
    const sortBy = (params.get('sortBy') as EmployeeSortField | null) ?? 'nombres';
    const sortDir = params.get('sortDir') === 'desc' ? 'desc' : 'asc';
    const perPage = Number(params.get('perPage') ?? 40);

    return {
      nombre: params.get('nombre') ?? '',
      codigo: params.get('codigo') ?? '',
      sortBy,
      sortDir,
      perPage: [20, 40, 80].includes(perPage) ? perPage : 40,
    };
  }

  private getActiveFilterCount(filters: ReportFiltersValue): number {
    let count = 0;

    if (filters.nombre.trim()) {
      count += 1;
    }

    if (filters.codigo.trim()) {
      count += 1;
    }

    if (filters.sortBy !== 'nombres' || filters.sortDir !== 'asc') {
      count += 1;
    }

    if (filters.perPage !== 40) {
      count += 1;
    }

    return count;
  }

  private buildExportQuery(): EmployeeListQuery {
    return {
      nombre: this.filters.nombre.trim(),
      codigo: this.filters.codigo.trim(),
      sortBy: this.filters.sortBy,
      sortDir: this.filters.sortDir,
    };
  }
}
