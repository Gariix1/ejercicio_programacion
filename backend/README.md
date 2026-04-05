# Backend

Backend API construido con Laravel y organizado por modulos.

## Estructura

- `app/Modules/Employees`
- `app/Modules/Provinces`
- `app/Modules/Reports`
- `routes/api.php`
- `config/cors.php`
- `storage/uploads`

## Comandos utiles

```bash
composer install
composer run serve
php artisan route:list
php artisan test
```

## Configuracion

1. Copiar `.env.example` como `.env`.
2. Ajustar credenciales MySQL con valores reales.
3. Ejecutar `../database/schema.sql` y `../database/seed.sql`.
4. Opcionalmente, si la base ya tiene el esquema cargado, ejecutar `php artisan db:seed`. Este comando reutiliza `../database/seed.sql` como fuente oficial de datos semilla.

## Endpoints base

- `GET /api/health`
- `GET /api/employees?page=1&per_page=15`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `PATCH /api/employees/{id}`
- `GET /api/provinces`
- `GET /api/reports/employees?page=1&per_page=15`
- `GET /api/reports/summary`

## Contrato actual de la API

Respuestas exitosas:

- usan `data`, `meta` y `links`
- los recursos siguen `type`, `id`, `attributes` y `relationships` cuando aplica
- los listados paginados agregan `meta.pagination` y links `self`, `first`, `last`, `prev`, `next`

Errores:

- usan `errors[]`
- cada error incluye `status`, `code`, `title`, `detail` y `source`
- la raiz incluye `meta.request_status`, `meta.error_type` y `meta.error_count`

## Filtros y ordenamiento

`GET /api/employees` y `GET /api/reports/employees` aceptan:

- `search`
- `sort_by`
- `sort_dir`
- `page`
- `per_page`

Columnas principales soportadas en ordenamiento de empleados/reportes:

- `id`
- `codigo_empleado`
- `nombres`
- `apellidos`
- `cedula`
- `email`
- `cargo`
- `departamento`
- `sueldo`
- `fecha_ingreso`
- `estado_nombre`
- `provincia_personal_nombre`
- `provincia_laboral_nombre`

## Notas de implementacion

- `PUT /api/employees/{id}` se usa para actualizacion completa
- `PATCH /api/employees/{id}` soporta actualizacion parcial y fusiona el payload entrante con el estado actual antes de validar
- `php artisan db:seed` reutiliza `../database/seed.sql` como fuente oficial de semilla
