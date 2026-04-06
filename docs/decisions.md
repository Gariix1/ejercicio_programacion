# Decisiones de arquitectura

## 1. Backend orientado a API

El backend se organiza como API REST en Laravel.
Las rutas viven en `backend/routes/api.php` y el flujo principal sigue el patron:

`Route -> Controller -> Request -> Service -> Repository -> Database`

Se eligio Laravel para ganar:

- validacion con `FormRequest`
- contrato de errores mas consistente
- mejor base para modularidad y crecimiento
- testing mas simple del dominio principal

## 2. Modulos por dominio

Cada dominio encapsula su logica:

- `Employees`: alta, consulta, actualizacion, eliminacion, validacion y carga de fotografia
- `Provinces`: catalogo maestro
- `Reports`: vistas agregadas y resumenes operativos

Esto evita mezclar reglas de negocio en carpetas globales.

## 3. Contrato uniforme de API

Decisiones adoptadas:

- respuestas exitosas con `data`, `meta` y `links`
- recursos con `type`, `id`, `attributes` y `relationships`
- errores con `errors[]`, `status`, `code`, `title`, `detail` y `source`
- paginacion con `meta.pagination`
- soporte para `PUT` y `PATCH`

Motivo:

- reducir logica especial en frontend
- estandarizar pruebas
- dar un contrato mas maduro sin meter JSON:API completo

## 4. Frontend por features y shared components

El frontend se separa por:

- `core`
- `shared`
- `features`

Cada feature contiene paginas, componentes, modelos y `data-access`.
Los patrones repetidos se movieron a `shared`, por ejemplo:

- botones
- banners
- navbar
- page headers
- action bars
- paginacion
- modales de confirmacion y feedback
- modal de exportacion

Motivo:

- menos repeticion
- mas consistencia visual
- mantenimiento mas simple

## 5. Bootstrap como base, CSS propio solo donde aporta

Se mantuvo Bootstrap 4 como base para layout, formularios y utilidades.
Encima de eso se agrego CSS propio para:

- identidad visual
- glassmorphism
- navbar custom
- tabs del formulario
- tablas y pills del sistema
- microanimaciones y estados

Tambien se vendorizo una copia local minima de Bootstrap en `frontend/src/vendor` sin la regla `:lang` que disparaba warnings de build.

Motivo:

- conservar productividad y utilidades de Bootstrap
- evitar sobreescribir el framework completo
- quitar warnings del build sin romper el look existente

## 6. Reportes como seccion escalable

La navegacion separa:

- `Modulos`
- `Reportes`

`/reports` funciona como centro de reportes y hoy contiene:

- reporte de empleados disponible
- asistencia y nomina como proximos reportes

Motivo:

- dejar la arquitectura lista para crecer sin rehacer rutas ni navbar

## 7. Exportacion reusable

La exportacion se implemento con un modal shared y un servicio reusable.

Formatos actuales:

- `PDF`
- `CSV`
- `JSON`

Motivo:

- reutilizar el flujo en futuros reportes
- unificar preview, feedback y seleccion de formato

## 8. Feedback de procesos y confirmaciones

Se definieron modales shared para:

- procesos en carga, exito y error
- confirmacion de descarte
- confirmacion de actualizacion

Motivo:

- evitar perdida accidental de cambios
- dar feedback claro en acciones lentas o importantes

## 9. Fotografias servidas por la API

Las fotografias se guardan en `storage/uploads` y se exponen mediante:

- `POST /api/employees/photo`
- `GET /api/employee-photos/{path}`

Motivo:

- no depender de symlinks o configuraciones manuales del entorno
- tener una URL estable para preview y edicion
- mantener control del acceso y de la generacion de rutas

## 10. Base de datos versionada fuera del backend

`database/schema.sql` y `database/seed.sql` permanecen en la raiz para mantener separados:

- artefactos de datos
- backend
- frontend

Esto facilita la lectura del reto y deja mas claro que el modelo de datos es un insumo compartido del proyecto completo.
