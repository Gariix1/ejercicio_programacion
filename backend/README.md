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

1. Copiar `.env.template` como `.env`.
2. Ajustar credenciales MySQL con valores reales.
3. Ejecutar `../database/schema.sql` y `../database/seed.sql`.

## Endpoints base

- `GET /api/health`
- `GET /api/employees?page=1&per_page=15`
- `GET /api/employees/{id}`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `GET /api/provinces`
- `GET /api/reports/employees?page=1&per_page=15`
- `GET /api/reports/summary`
