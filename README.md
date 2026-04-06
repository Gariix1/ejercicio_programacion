# Ejercicio de Programacion

Sistema de gestion de empleados con backend API en Laravel, frontend Angular y MySQL 8.

## Que incluye

- modulo de empleados con listado, filtros, paginacion y edicion
- formulario de empleados con datos personales y laborales
- carga y gestion de fotografia
- centro de reportes y reporte operativo de empleados
- exportacion en `PDF`, `CSV` y `JSON`

## Requisitos

- PHP 8.4+
- Composer
- Node.js 20+
- npm
- MySQL 8

## 1. Cargar base de datos

```bash
mysql -uroot -proot < database/schema.sql
mysql -uroot -proot < database/seed.sql
```

## 2. Correr backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan serve
```

Backend:

- `http://localhost:8000`

## 3. Correr frontend

```bash
cd frontend
npm install
npm start
```

Frontend:

- `http://localhost:4200`

## 4. Verificacion rapida

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
./vendor/bin/phpunit tests/Feature/EmployeesApiTest.php tests/Feature/ReportsApiTest.php
```

## 5. Probar en otro dispositivo de la red

Backend:

```bash
cd backend
composer run serve:lan
```

Frontend:

```bash
cd frontend
npm run start:lan
```

Abrir desde otro dispositivo:

- `http://<tu-ip-local>:4200`

## 6. Archivos locales que no deben subirse

- `backend/storage/uploads`
- `backend/storage/logs`
- `backend/bootstrap/cache`
- `frontend/dist`
- `frontend/node_modules`
- `backend/vendor`
- archivos `.env`

## 7. Documento tecnico

La descripcion de herramientas, arquitectura y ubicacion de la logica esta en:

- [ARCHITECTURE.md](./ARCHITECTURE.md)
