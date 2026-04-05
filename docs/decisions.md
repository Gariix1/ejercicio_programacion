# Decisiones de arquitectura

## 1. Backend orientado a API

El backend se organiza como una API REST en Laravel.
Las rutas viven en `backend/routes/api.php` y el flujo principal sigue el patron:

`Route -> Controller -> Request -> Service -> Repository -> Database`

Se adopto Laravel para ganar:

- validacion nativa con `FormRequest`
- manejo consistente de configuracion, errores y CORS
- mejor base de mantenimiento y crecimiento
- convenciones claras para una entrega mas profesional

## 2. MVC modular

Cada modulo encapsula su propia logica y evita carpetas globales de negocio:

- `Employees`: alta, consulta, actualizacion y validacion de empleados.
- `Provinces`: catalogo maestro de provincias.
- `Reports`: reportes y agregados de empleados.

Esto permite crecer por dominio sin mezclar responsabilidades.

Estructura actual del backend:

- `app/Modules/Employees/{Controllers,DTOs,Models,Repositories,Requests,Resources,Services}`
- `app/Modules/Provinces/{Controllers,Models,Repositories,Resources,Services}`
- `app/Modules/Reports/{Controllers,Repositories,Services}`

## 3. Frontend por features

El frontend se separa por `core`, `shared` y `features`.
Cada feature contiene sus paginas, componentes, modelos y capa `data-access` para consumir la API.

## 4. Base de datos fuera del backend

`database/schema.sql` y `database/seed.sql` permanecen en la raiz para mantener separados:

- artefactos de infraestructura y datos
- codigo de backend
- codigo de frontend

## 5. Modelo de datos versionado

El modelo versionado se alinea con la base real usada por el backend Laravel.

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

Restricciones mantenidas:

- `UNIQUE` en `codigo_empleado`
- `UNIQUE` en `cedula`
- `FOREIGN KEY` hacia `provincias`
- `CHECK` de coherencia entre `estado_codigo` y `estado_nombre`
- `utf8mb4` en todas las tablas
