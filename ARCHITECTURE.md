# Arquitectura y herramientas

## Herramientas usadas

- backend: Laravel
- frontend: Angular
- base de datos: MySQL 8
- estilos base: Bootstrap 4 + SCSS
- pruebas backend: PHPUnit

## Estructura general

```text
backend/
frontend/
database/
```

- `backend`: API y reglas de negocio
- `frontend`: interfaz y experiencia de usuario
- `database`: esquema y datos semilla

## Arquitectura usada

### Backend

El backend sigue este flujo:

`Route -> Controller -> Request -> Service -> Repository -> Database`

Ubicacion principal:

- `backend/routes/api.php`
- `backend/app/Core`
- `backend/app/Modules`

Dominios:

- `backend/app/Modules/Employees`
- `backend/app/Modules/Provinces`
- `backend/app/Modules/Reports`

### Frontend

El frontend se organiza por:

- `core`
- `shared`
- `features`

Ubicacion principal:

- `frontend/src/app/core`
- `frontend/src/app/shared`
- `frontend/src/app/features`

## Donde esta la logica de cada cosa

### Empleados

Backend:

- controladores: `backend/app/Modules/Employees/Controllers`
- validacion: `backend/app/Modules/Employees/Requests`
- servicios: `backend/app/Modules/Employees/Services`
- persistencia: `backend/app/Modules/Employees/Repositories`

Frontend:

- paginas: `frontend/src/app/features/employees/pages`
- componentes: `frontend/src/app/features/employees/components`
- formularios y utilidades: `frontend/src/app/features/employees/forms`
- acceso a API: `frontend/src/app/features/employees/data-access`
- modelos: `frontend/src/app/features/employees/models`

### Reportes

Backend:

- controladores: `backend/app/Modules/Reports/Controllers`
- servicios: `backend/app/Modules/Reports/Services`
- repositorios: `backend/app/Modules/Reports/Repositories`

Frontend:

- paginas: `frontend/src/app/features/reports/pages`
- componentes: `frontend/src/app/features/reports/components`
- acceso a API: `frontend/src/app/features/reports/data-access`

### Catalogo de provincias

Backend:

- `backend/app/Modules/Provinces`

Base de datos:

- `database/schema.sql`
- `database/seed.sql`

## Componentes compartidos importantes

En `frontend/src/app/shared`:

- `top-nav.component.ts`
- `ui-button.component.ts`
- `pagination-controls.component.ts`
- `confirm-action-modal.component.ts`
- `process-feedback-modal.component.ts`
- `export-modal.component.ts`
- `horizontal-scroll-shell.component.ts`
- `report-export.service.ts`

## Notas tecnicas

- las fotografias se gestionan desde backend y se sirven por la API
- los reportes exportan desde un endpoint dedicado
- el frontend deriva la URL base de la API desde el host actual
- Bootstrap se usa como base y el estilo del sistema se completa con SCSS propio
