# Backend

Backend API construido con Laravel y organizado por modulos.

## Estructura

- `app/Modules/Employees`
- `app/Modules/Provinces`
- `app/Modules/Reports`
- `routes/api.php`
- `config/cors.php`
- `storage/uploads`

## Flujo principal

`Route -> Controller -> Request -> Service -> Repository -> Database`

## Comandos utiles

```bash
composer install
php artisan key:generate
php artisan serve
php artisan route:list
php artisan test
```

Prueba puntual hoy:

```bash
./vendor/bin/phpunit tests/Feature/EmployeesApiTest.php
```

## Configuracion

1. Copiar `.env.example` como `.env`.
2. Ajustar credenciales MySQL con valores reales.
3. Cargar `../database/schema.sql` y `../database/seed.sql`.
4. Verificar `APP_URL=http://localhost:8000` para que las URLs de fotografia se generen bien.

## Endpoints base

- `GET /api/health`
- `GET /api/employees?page=1&per_page=15`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `PATCH /api/employees/{id}`
- `DELETE /api/employees/{id}`
- `POST /api/employees/photo`
- `GET /api/employee-photos/{path}`
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

Columnas principales soportadas en ordenamiento:

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

## Fotografias de empleados

Flujo actual:

- el frontend sube un archivo a `POST /api/employees/photo`
- el backend valida tipo y tamano
- la imagen se guarda en `storage/uploads/empleados`
- la API devuelve `path` y `url`
- `fotografia` se persiste como ruta
- `fotografia_url` se expone como URL utilizable en frontend

Restricciones:

- formatos aceptados: `jpg`, `jpeg`, `png`, `webp`
- tamano maximo: `6 MB`

## Notas de implementacion

- `PUT /api/employees/{id}` se usa para actualizacion completa
- `PATCH /api/employees/{id}` soporta actualizacion parcial y fusiona el payload entrante con el estado actual antes de validar
- las fotografias se sirven por la propia API con `GET /api/employee-photos/{path}` para no depender de enlaces simbolicos del entorno local
