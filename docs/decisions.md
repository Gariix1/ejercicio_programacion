# Decisiones de arquitectura

## 1. Backend orientado a API

El backend se organiza como una API REST en PHP con entrada unica en `backend/public/index.php`.
Las rutas viven en `backend/routes/api.php` y el flujo principal sigue el patron:

`Request -> Router -> Controller -> Service -> Repository -> Database`

## 2. MVC modular

Cada modulo encapsula su propia logica y evita carpetas globales de negocio:

- `Employees`: alta, consulta y validacion de empleados.
- `Provinces`: catalogo de provincias.
- `Reports`: agregados y reportes.

Esto permite crecer por dominio sin mezclar responsabilidades.

## 3. Frontend por features

El frontend se separa por `core`, `shared` y `features`.
Cada feature contiene sus paginas, componentes, modelos y capa `data-access` para consumir la API.

## 4. Base de datos fuera del backend

`database/schema.sql` y `database/seed.sql` permanecen en la raiz para mantener separados:

- artefactos de infraestructura y datos
- codigo de backend
- codigo de frontend
