# Ejercicio de Programacion

Challenge de empleados con backend API en Laravel, frontend Angular por features y MySQL 8 en `utf8mb4`.

Este repositorio implementa el alcance del PDF original `Ejercicio Programador.pdf` y sigue el complemento tecnico `codex_context_challenge_empleados.pdf`.

## Estado actual

Completado:

- backend migrado a Laravel
- arquitectura modular en backend por `Employees`, `Provinces` y `Reports`
- frontend Angular base por features
- Bootstrap 4 integrado en frontend
- CORS y conexion MySQL configurados
- `schema.sql` alineado con la base real
- `seed.sql` con provincias y un empleado de prueba

Pendiente:

- completar pantallas reales del flujo del PDF
- formulario de datos personales
- formulario de datos laborales
- listado con busqueda visual
- reporte general ordenable en UI
- terminar integracion frontend con el flujo completo

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

El backend usa Laravel con enfoque API-first y estructura modular.

Flujo principal:

`Route -> Controller -> Request -> Service -> Repository -> Database`

Endpoints disponibles:

- `GET /api/health`
- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `GET /api/provinces`
- `GET /api/reports/employees`
- `GET /api/reports/summary`

## Base de datos

El modelo de datos versionado ya esta alineado con la base real usada por la API.

Tablas:

- `provincias`
- `empleados`

Puntos importantes:

- `telefono` y `direccion` forman parte del modelo actual de `empleados`
- `codigo_empleado` y `cedula` son unicos
- existen `FK` a `provincias`
- existe `CHECK` de estado
- `seed.sql` incluye 24 provincias y 1 empleado de prueba

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
composer run serve
```

Backend disponible en:

- `http://127.0.0.1:8000`
- `GET /api/employees` y `GET /api/reports/employees` aceptan `page` y `per_page`

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend disponible en:

- `http://localhost:4200`

## Siguiente bloque recomendado

1. construir el listado funcional con busqueda en Angular
2. crear formulario de datos personales
3. crear formulario de datos laborales
4. conectar alta y edicion de empleados
5. construir reporte general ordenable en UI
