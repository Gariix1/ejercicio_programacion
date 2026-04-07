# Documento tecnico integral del proyecto

Este documento describe la arquitectura, la componentizacion, los estandares de calidad y las reglas tecnicas del sistema de gestion de empleados.

## Alcance del documento

Este documento cubre:

- arquitectura backend y frontend
- funcionalidades principales y su ubicacion
- componentizacion por modulos
- reglas de validacion y negocio clave
- estandares de calidad y pruebas
- decisiones tecnicas de API, exportacion y manejo de archivos

Este documento no intenta listar cada linea de codigo, pero si concentra la base tecnica necesaria para mantener, extender y defender la calidad del proyecto.

## Propuesta de valor tecnica del sistema

- arquitectura modular por dominio (`Employees`, `Reports`, `Provinces`)
- separacion clara por capas (controladores, requests, servicios, repositorios)
- contrato de API consistente (`data`, `meta`, `links`)
- frontend por features con lazy loading para escalar sin acoplamiento excesivo
- pruebas automatizadas de endpoints y reglas de negocio
- soporte de exportaciones operativas (CSV, JSON y vista imprimible)

## Stack y plataforma

- backend: Laravel 13
- frontend: Angular 18
- base de datos: MySQL 8
- estilos: Bootstrap 4 + SCSS
- pruebas backend: PHPUnit

## Estructura general del repositorio

```text
backend/
frontend/
database/
```

- `backend`: API, validaciones, servicios, repositorios y recursos
- `frontend`: UI, formularios, componentes, data-access y rutas
- `database`: esquema y datos semilla

## Arquitectura backend

Flujo por request:

`Route -> Controller -> FormRequest -> Service -> Repository -> Database`

Ubicaciones base:

- rutas API: `backend/routes/api.php`
- capa base HTTP y respuestas: `backend/app/Core`
- modulos de dominio: `backend/app/Modules`

Modulos actuales:

- `Employees`
- `Reports`
- `Provinces`

### Contrato de API

El backend estandariza respuestas con:

- `data`: payload principal
- `meta`: metadatos (modulo, paginacion, mensajes)
- `links`: enlaces de navegacion o autoreferencia

Punto central: `backend/app/Core/Http/Controllers/ApiController.php`

### Manejo de errores HTTP en la API

Codigos actualmente usados en el proyecto:

- `200 OK`: consultas y operaciones exitosas
- `201 Created`: creacion de recursos (por ejemplo, alta de empleado y carga de foto)
- `404 Not Found`: recurso no encontrado o ruta inexistente
- `422 Unprocessable Entity`: errores de validacion de entrada
- `500 Internal Server Error`: errores no controlados por handlers especificos

Estructura de error para API:

- `errors`: lista de errores (status, code, title, detail, source)
- `meta.request_status`: estado general de la solicitud
- `meta.error_type`: tipo de error (`VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`)
- `meta.error_count`: cantidad de errores

Implementacion principal:

- registro de handlers API: `backend/bootstrap/app.php`
- construccion de payloads de error: `backend/app/Core/Support/ApiErrorResponse.php`
- codigos de error semanticos: `backend/app/Core/Support/ApiErrorCode.php`

## Arquitectura frontend

Organizacion principal en `frontend/src/app`:

- `core`: configuracion global (API base y tipos base)
- `shared`: componentes y utilidades reutilizables
- `features`: modulos funcionales aislados

Rutas principales:

- `app.routes.ts` redirige al modulo de empleados
- carga diferida por modulo (`employees.routes.ts`, `reports.routes.ts`)

Patron por feature:

- `pages`: paginas contenedoras
- `components`: componentes de UI
- `data-access`: servicios HTTP
- `models`: modelos y adaptadores de datos
- `forms`: estado, validaciones y utilidades del formulario

## Funcionalidades principales

- CRUD de empleados (listar, crear, ver, editar, eliminar)
- filtros, busqueda, ordenamiento y paginacion en empleados
- carga, visualizacion y eliminacion controlada de fotografia
- catalogo de provincias para datos personales y laborales
- reportes de empleados (listado, resumen y exportacion)
- exportaciones desde frontend (CSV, JSON y vista para impresion)

## Componentizacion y responsabilidad por modulo

### Empleados

Backend:

- controladores: `backend/app/Modules/Employees/Controllers`
- validacion de entrada: `backend/app/Modules/Employees/Requests`
- servicios de negocio: `backend/app/Modules/Employees/Services`
- persistencia: `backend/app/Modules/Employees/Repositories`
- transformacion de salida: `backend/app/Modules/Employees/Resources`

Frontend:

- paginas: `frontend/src/app/features/employees/pages`
- componentes: `frontend/src/app/features/employees/components`
- formularios/utilidades: `frontend/src/app/features/employees/forms`
- API client: `frontend/src/app/features/employees/data-access`
- modelos y mapeos: `frontend/src/app/features/employees/models`

### Reportes

Backend:

- controladores: `backend/app/Modules/Reports/Controllers`
- servicios: `backend/app/Modules/Reports/Services`
- repositorios: `backend/app/Modules/Reports/Repositories`

Frontend:

- paginas: `frontend/src/app/features/reports/pages`
- componentes: `frontend/src/app/features/reports/components`
- API client: `frontend/src/app/features/reports/data-access`
- modelos: `frontend/src/app/features/reports/models`

### Provincias

Backend:

- modulo: `backend/app/Modules/Provinces`

Frontend:

- modelos y consumo: `frontend/src/app/features/provinces`

## Reglas de negocio y algoritmos relevantes

- estado de empleado por codigo: `1 -> VIGENTE`, `9 -> RETIRADO`
- validacion de identidad unica para `codigo_empleado` y `cedula`
- validaciones temporales: `fecha_nacimiento < hoy`, `fecha_ingreso <= hoy` y `fecha_ingreso > fecha_nacimiento`
- `sueldo` debe ser numerico y mayor que cero
- filtros de listado independientes por nombre, codigo y busqueda libre
- ordenamiento parametrizable por columnas permitidas
- paginacion con metadatos (`current_page`, `per_page`, `total`, `last_page`)
- ciclo de foto administrada: upload, reemplazo seguro y eliminacion controlada

## Estandares de calidad tecnica

- separacion de responsabilidades por capas
- validacion de entrada via FormRequest antes de la capa de negocio
- respuestas JSON uniformes para simplificar integracion frontend
- errores semanticos con `error_type` y codigos de validacion
- cobertura funcional en pruebas de API para casos nominales y de error
- convenciones de nombres estables por feature y por modulo

## Pruebas y verificacion

Backend:

- feature tests: `backend/tests/Feature`
- unit tests: `backend/tests/Unit`

Casos cubiertos en feature tests incluyen:

- lectura individual y listados paginados
- filtros y ordenamiento
- validaciones y errores de negocio
- creacion, actualizacion completa y parcial
- flujo de fotografia
- reportes, resumen y exportacion
- catalogo de provincias

## Seguridad y estabilidad operativa

- validaciones de entrada centralizadas por request
- control de rutas de fotografia administrada para evitar accesos arbitrarios
- campos criticos con reglas estrictas (longitud, tipo, unicidad, fechas)
- separacion backend/frontend que reduce acoplamiento y facilita hardening por capa

## Rendimiento y escalabilidad funcional

- paginacion nativa en listados para evitar cargas masivas
- lazy loading en rutas frontend para reducir tiempo inicial de carga
- separacion por modulos que facilita evolucion incremental
- repositorios por dominio para optimizar consultas sin contaminar controladores

## Guia rapida de extension

Si agregas un nuevo endpoint:

- declarar ruta en `backend/routes/api.php`
- crear/actualizar `Controller`, `Request`, `Service`, `Repository`, `Resource`
- agregar cliente en `frontend/src/app/features/<modulo>/data-access`
- ajustar modelos y componentes del feature
- cubrir con pruebas de feature en backend

Si agregas un nuevo campo de empleado:

- actualizar `database/schema.sql` (si aplica)
- extender reglas en `EmployeeValidation`
- propagar a DTOs, repositorio, recurso y tests
- actualizar formulario, modelo y mapeo frontend

## Enfoque del documento

Este proyecto se presenta como demo/ejercicio tecnico, por lo que este documento prioriza:

- explicar como esta construido el sistema actual
- mostrar criterios de diseno y calidad aplicados
- facilitar mantenimiento y extension dentro del alcance del ejercicio
