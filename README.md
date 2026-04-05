# Ejercicio de Programacion

Implementacion del challenge de empleados con PHP MVC modular orientado a API, Angular por features y MySQL 8 en `utf8mb4`.

Este `README` ahora funciona como guia de trabajo para ejecutar el proyecto paso a paso y para controlar lo que todavia falta respecto a:

- `Ejercicio Programador.pdf`: alcance funcional original.
- `codex_context_challenge_empleados.pdf`: arquitectura, calidad y forma de entrega.

## Objetivo del reto

Debemos entregar una solucion que cumpla con estos puntos obligatorios:

- listado inicial de empleados con busqueda, seleccion y accion para agregar
- formulario de datos personales
- formulario de datos laborales
- edicion de empleado existente
- reporte general de empleados con ordenamiento por columnas
- persistencia en MySQL con validaciones
- interfaz responsive
- entrega reproducible con codigo, SQL y documentacion

## Estructura actual

```text
ejercicio_programacion/
├── backend/
│   ├── public/
│   │   └── index.php
│   ├── src/
│   │   ├── Core/
│   │   ├── Modules/
│   │   └── Shared/
│   ├── config/
│   │   └── database.php
│   ├── routes/
│   │   └── api.php
│   ├── storage/
│   │   └── uploads/
│   ├── composer.json
│   └── .env.template
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
├── .gitignore
└── README.md
```

## Estado actual

Completado:

- estructura base del backend modular
- estructura base del frontend por features
- `schema.sql` inicial con `provincias` y `empleados`
- `decisions.md` con lineamientos de arquitectura
- `README.md` base del proyecto

Pendiente:

- poblar `database/seed.sql` con provincias del PDF y datos de prueba
- completar contrato API final del challenge
- implementar actualizacion de empleados
- implementar busqueda en listado
- implementar reporte general ordenable
- construir pantallas reales del flujo del PDF
- integrar Bootstrap 4
- cerrar documentacion de instalacion y ejecucion final

## Contrato API objetivo

Estos son los endpoints que debemos dejar listos:

- `GET /api/employees`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `GET /api/provinces`
- `GET /api/reports/employees`

## Plan paso a paso

### Paso 1. Cerrar base de datos

Objetivo:
Dejar la base lista para instalacion reproducible.

Tareas:

- revisar y ajustar `database/schema.sql`
- crear `database/seed.sql` con provincias
- agregar al menos un empleado de prueba
- verificar claves unicas, `FK`, `CHECK` y `utf8mb4`

Resultado esperado:
Un tercero puede crear la base sin editar scripts manualmente.

### Paso 2. Completar backend API

Objetivo:
Dejar el backend alineado al reto y al documento tecnico.

Tareas:

- corregir `backend/routes/api.php` al contrato final
- agregar `PUT /api/employees/{id}`
- cambiar el endpoint de reportes a `GET /api/reports/employees`
- implementar busqueda y ordenamiento en `GET /api/employees`
- reforzar validaciones en backend
- manejar errores HTTP de forma consistente

Resultado esperado:
La API cubre alta, consulta, edicion, catalogo de provincias y reporte.

### Paso 3. Construir frontend funcional

Objetivo:
Reflejar el flujo del PDF original en Angular.

Tareas:

- pantalla inicial de listado con busqueda
- accion para agregar empleado
- formulario de datos personales
- formulario de datos laborales
- pantalla o flujo de edicion
- pantalla de reporte general
- consumo real de la API desde `data-access`

Resultado esperado:
El usuario puede completar el flujo completo sin depender de datos quemados.

### Paso 4. Integrar responsive y Bootstrap 4

Objetivo:
Cumplir la preferencia visual del enunciado.

Tareas:

- instalar Bootstrap 4 en frontend
- adaptar layout y formularios
- asegurar visualizacion correcta en desktop y mobile

Resultado esperado:
La interfaz es responsive y coherente con el PDF.

### Paso 5. Validaciones end to end

Objetivo:
Proteger la calidad de datos desde UI, API y base de datos.

Tareas:

- validar email, telefono, cedula y fechas en formularios
- repetir validaciones criticas en backend
- asegurar restricciones de base de datos

Resultado esperado:
Los errores de captura se detectan antes de persistir y tambien al persistir.

### Paso 6. Cerrar entrega

Objetivo:
Dejar el proyecto listo para revision tecnica.

Tareas:

- completar instrucciones de instalacion en este `README`
- documentar decisiones finales en `docs/decisions.md`
- verificar nombres de rutas, archivos y estructura
- dejar ejemplos de ejecucion local

Resultado esperado:
Cualquier revisor puede clonar, instalar y ejecutar sin asistencia adicional.

## Orden recomendado de implementacion

1. Base de datos
2. Backend API
3. Frontend listado y formularios
4. Reporte general
5. Bootstrap y responsive
6. Documentacion final

## Arranque local

Cuando completemos la implementacion, el flujo de arranque sera este:

1. Copiar `backend/.env.template` como `backend/.env`.
2. Ejecutar `database/schema.sql` y luego `database/seed.sql` en MySQL.
3. Instalar dependencias del backend con `composer install` dentro de `backend/`.
4. Instalar dependencias del frontend con `npm install` dentro de `frontend/`.
5. Levantar backend con `php -S localhost:8000 -t public`.
6. Levantar frontend con `npm start`.

## Proximo paso recomendado

El siguiente bloque de trabajo deberia ser:

1. completar `database/seed.sql`
2. alinear el contrato API final
3. implementar `PUT /api/employees/{id}`
