# Ejercicio de Programacion

Sistema de gestion de empleados con backend API en Laravel, frontend Angular por features y MySQL 8 en `utf8mb4`.

El proyecto ya cubre el flujo principal del challenge original: modulo de empleados, formulario de alta y edicion, reporte operativo, exportacion y soporte basico para fotografia de empleados.

## Estado actual

Listo hoy:

- backend Laravel modular por dominios `Employees`, `Provinces` y `Reports`
- contrato de API uniforme con `data`, `meta`, `links` y errores estructurados
- listado de empleados con busqueda, ordenamiento y paginacion
- formulario de empleados con datos personales y laborales
- alta y edicion de empleados con validaciones
- confirmaciones para descartar cambios y para confirmar actualizaciones
- carga real de fotografia con preview y almacenamiento en backend
- centro de reportes y reporte operativo de empleados
- exportacion de reportes en `PDF`, `CSV` y `JSON`
- componentes shared para botones, modales, banners, paginacion, navbar y paneles
- estilo visual unificado con enfoque glassmorphism ligero

Todavia por cerrar o mejorar:

- mas pruebas automaticas del frontend
- mas reportes reales aparte del de empleados
- limpieza final del arbol de cambios y separacion en commits pequenos
- QA manual final en responsive y flujos borde

## Estructura

```text
ejercicio_programacion/
├── backend/
│   ├── app/
│   │   ├── Core/
│   │   └── Modules/
│   │       ├── Employees/
│   │       ├── Provinces/
│   │       └── Reports/
│   ├── bootstrap/
│   ├── config/
│   ├── public/
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   ├── storage/
│   │   └── uploads/
│   ├── tests/
│   ├── artisan
│   ├── composer.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── shared/
│   │   │   └── features/
│   │   ├── assets/
│   │   ├── environments/
│   │   ├── vendor/
│   │   ├── styles.scss
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── docs/
│   └── decisions.md
└── README.md
```

## Backend

El backend sigue el flujo:

`Route -> Controller -> Request -> Service -> Repository -> Database`

Endpoints principales:

- `GET /api/health`
- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `PATCH /api/employees/{id}`
- `DELETE /api/employees/{id}`
- `POST /api/employees/photo`
- `GET /api/employee-photos/{path}`
- `GET /api/provinces`
- `GET /api/reports/employees`
- `GET /api/reports/summary`

Capacidades relevantes:

- filtros y ordenamiento en empleados y reportes
- validaciones de negocio para estado, fechas y campos unicos
- soporte para actualizacion parcial con `PATCH`
- carga de fotografias hasta `6 MB`
- entrega de fotografias por URL servida desde la propia API

## Frontend

El frontend se organiza por `core`, `shared` y `features`.

Features principales:

- `employees`
  - listado
  - formulario create/edit
  - filtros
  - tabla
- `reports`
  - home de reportes
  - reporte de empleados

Shared relevantes:

- `top-nav`
- `module-header`
- `ui-button`
- `status-banner`
- `pagination-controls`
- `confirm-action-modal`
- `process-feedback-modal`
- `export-modal`
- `horizontal-scroll-shell`
- `report-export.service`

## Base de datos

Tablas principales:

- `provincias`
- `empleados`

Campos relevantes de `empleados`:

- identificacion: `codigo_empleado`, `nombres`, `apellidos`, `cedula`
- contacto: `telefono`, `direccion`, `email`
- personales: `fecha_nacimiento`, `fotografia`, `observaciones_personales`
- laborales: `fecha_ingreso`, `cargo`, `departamento`, `sueldo`, `jornada_parcial`, `observaciones_laborales`
- relaciones: `provincia_personal_id`, `provincia_laboral_id`
- estado: `estado_codigo`, `estado_nombre`

Restricciones activas:

- `UNIQUE` en `codigo_empleado`
- `UNIQUE` en `cedula`
- `FOREIGN KEY` hacia `provincias`
- `CHECK` de coherencia entre `estado_codigo` y `estado_nombre`

## Arranque local

### 1. Base de datos

```bash
mysql -uroot -proot < database/schema.sql
mysql -uroot -proot < database/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan serve
```

Backend disponible en:

- `http://localhost:8000`

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend disponible en:

- `http://localhost:4200`

## Verificacion rapida

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
./vendor/bin/phpunit tests/Feature/EmployeesApiTest.php
```

## Ejemplos de flujos actuales

Modulo de empleados:

- buscar empleados por nombre o codigo
- ordenar tabla
- paginar
- abrir ficha para editar

Formulario:

- crear empleado
- editar empleado
- cargar fotografia
- confirmar actualizacion
- confirmar salida con cambios sin guardar

Reportes:

- abrir centro de reportes
- entrar al reporte operativo de empleados
- filtrar y ordenar
- exportar `PDF`, `CSV` o `JSON`

## Riesgos o notas de cierre

- el arbol de trabajo actual contiene muchos cambios simultaneos, por lo que conviene separar commits por bloques
- hay bastante coverage funcional en backend de empleados, pero la parte visual del frontend depende todavia de QA manual
- el sistema ya esta fuerte para demo o entrega funcional, pero aun conviene una pasada final de estabilizacion antes de considerar cierre total
