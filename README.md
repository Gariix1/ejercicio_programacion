# Ejercicio de Programacion

Sistema de gestion de empleados con backend API en Laravel, frontend Angular y MySQL 8.

## Stack del proyecto

- backend: Laravel 13 sobre PHP 8.4+
- frontend: Angular 18 sobre Node.js 20+
- estilos: SCSS + Bootstrap 4
- base de datos: MySQL 8

## Funcionalidades principales

- modulo de empleados con listado, filtros, paginacion y edicion
- formulario de empleados con datos personales y laborales
- carga y gestion de fotografia
- centro de reportes y reporte operativo de empleados
- exportacion en `PDF`, `CSV` y `JSON`

## Estructura

```text
backend/
frontend/
database/
```

- `backend`: API y reglas de negocio
- `frontend`: interfaz y experiencia de usuario
- `database`: esquema y datos semilla

## Compatibilidad de instalacion

- Ubuntu: es la distribucion principal documentada en este README
- compatibilidad verificada localmente en Fedora 43 con `php artisan test` y `npm run build`
- con el `composer.lock` actual, el backend requiere PHP `>=8.4`
- Angular 18 soporta Node.js `^20.11.1` y `^22.0.0`, por lo que Node.js 22 de Fedora tambien es valido

Referencia rapida para Fedora:

```bash
sudo dnf install -y git curl unzip php php-cli php-common php-mbstring php-mysqlnd php-pdo php-xml php-pecl-zip composer nodejs mysql-server
sudo systemctl enable --now mysqld
```

Nota:

- en Fedora el servicio de MySQL normalmente es `mysqld`, no `mysql`

## Inicio rapido

Este flujo esta pensado para Ubuntu. Si se copian los comandos en el mismo orden, el proyecto queda listo para correr en local.

### 1. Instalar dependencias del sistema

#### 1.1 Paquetes base

```bash
sudo apt update
sudo apt install -y ca-certificates curl git gnupg unzip software-properties-common
```

#### 1.2 PHP 8.4 y extensiones

```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.4 php8.4-cli php8.4-common php8.4-curl php8.4-mbstring php8.4-mysql php8.4-sqlite3 php8.4-xml php8.4-zip php8.4-bcmath php8.4-intl

# Forzar PHP 8.4 como version por defecto en CLI
sudo update-alternatives --set php /usr/bin/php8.4
sudo update-alternatives --set phar /usr/bin/phar8.4
sudo update-alternatives --set phar.phar /usr/bin/phar.phar8.4
sudo update-alternatives --set phpize /usr/bin/phpize8.4
sudo update-alternatives --set php-config /usr/bin/php-config8.4

# Verificacion rapida (debe mostrar 8.4.x)
php -v
```

#### 1.3 Composer global

```bash
cd /tmp
EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
ACTUAL_CHECKSUM="$(php -r 'echo hash_file("sha384", "composer-setup.php");')"
[ "$EXPECTED_CHECKSUM" = "$ACTUAL_CHECKSUM" ] || { echo 'ERROR: checksum invalido de Composer'; rm composer-setup.php; exit 1; }
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
rm composer-setup.php
```

#### 1.4 Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs
rm /tmp/nodesource_setup.sh
```

#### 1.5 MySQL 8

```bash
sudo apt install -y mysql-server
sudo systemctl enable --now mysql
```

### Notas utiles antes de clonar

- el flujo asume que el repositorio se clono en `"$HOME/ejercicio_programacion"`
- si esa carpeta ya existe, elimina la carpeta o usa otra ruta en el `git clone`

### 2. Clonar el repositorio

```bash
git clone --branch main --single-branch https://github.com/Gariix1/ejercicio_programacion.git "$HOME/ejercicio_programacion"
cd "$HOME/ejercicio_programacion"
git branch --show-current
```

La ultima linea debe mostrar `main` aunque tambien tenemos la rama `dev_1`.

### 3. Crear la base de datos e importar datos

```bash
cd "$HOME/ejercicio_programacion"
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS empleados_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'empleados_user'@'localhost' IDENTIFIED BY 'empleados_pass';
CREATE USER IF NOT EXISTS 'empleados_user'@'127.0.0.1' IDENTIFIED BY 'empleados_pass';
GRANT ALL PRIVILEGES ON empleados_db.* TO 'empleados_user'@'localhost';
GRANT ALL PRIVILEGES ON empleados_db.* TO 'empleados_user'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL
sudo mysql < database/schema.sql
sudo mysql < database/seed.sql
```

### 4. Preparar el backend

```bash
cd "$HOME/ejercicio_programacion/backend"
composer run setup
sed -i 's/DB_DATABASE=your_database_name/DB_DATABASE=empleados_db/' .env
sed -i 's/DB_USERNAME=your_database_user/DB_USERNAME=empleados_user/' .env
sed -i 's/DB_PASSWORD=your_database_password/DB_PASSWORD=empleados_pass/' .env
php artisan config:clear
```

### 5. Preparar el frontend

```bash
cd "$HOME/ejercicio_programacion/frontend"
npm install
```

### 6. Levantar la aplicacion
> Aqui hay 2 opciones (Mi recomendacion personal es la B pues sirve para probar en varios dispositivos de una misma red)

Opcion A: solo en tu maquina (localhost)

Terminal 1:

```bash
cd "$HOME/ejercicio_programacion/backend"
composer run serve
```

Terminal 2:

```bash
cd "$HOME/ejercicio_programacion/frontend"
npm start
```

Abrir en el navegador:

- `http://localhost:4200`

Chequeo rapido:

- `curl http://localhost:8000/api/health`

Opcion B: disponible para otros equipos en tu red local

Terminal 1:

```bash
cd "$HOME/ejercicio_programacion/backend"
composer run serve:lan
```

Terminal 2:

```bash
cd "$HOME/ejercicio_programacion/frontend"
npm run start:lan
```

Abrir desde otro dispositivo:

- `http://<ip-local>:4200`

Notas:

- reemplazar `<ip-local>` por la IP local real de la maquina donde ejecutas el frontend
- el frontend consume la API usando el mismo host desde el que se abre la aplicacion
- el backend acepta origenes privados comunes para pruebas locales
- las URLs de fotografia se generan con el host real de la peticion

> UNA VEZ HECHO ESTO, EL PROYECTO YA DEBERIA ESTAR FUNCIONANDO

## Verificacion rapida

Frontend:

```bash
cd "$HOME/ejercicio_programacion/frontend"
npm run build
```

Backend:

```bash
cd "$HOME/ejercicio_programacion/backend"
php artisan test
```

## Referencia y solucion de problemas

Esta seccion es de apoyo: incluye explicaciones tecnicas y variantes para resolver problemas comunes de instalacion.

### Dependencias del sistema

- PHP 8.4+ es necesario con el `composer.lock` actual
- si el sistema tiene varias versiones de PHP, este README ya fija `php8.4` como predeterminada con `update-alternatives`
- `php8.4-mysql` permite conectar el backend con MySQL
- `php8.4-sqlite3` permite ejecutar las pruebas del backend
- Composer se instala de forma global como `composer`
- Node.js 20 instala tambien `npm`
- no hace falta instalar Laravel ni Angular de forma global
- el instalador de NodeSource usado aqui soporta Ubuntu en arquitecturas `amd64` y `arm64`

### Base de datos

Credenciales usadas en desarrollo:

- base de datos: `empleados_db`
- usuario: `empleados_user`
- clave: `empleados_pass`

Si `sudo mysql` no abre la consola de MySQL en tu equipo, usa esta variante:

```bash
mysql -u root -p <<'SQL'
CREATE DATABASE IF NOT EXISTS empleados_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'empleados_user'@'localhost' IDENTIFIED BY 'empleados_pass';
CREATE USER IF NOT EXISTS 'empleados_user'@'127.0.0.1' IDENTIFIED BY 'empleados_pass';
GRANT ALL PRIVILEGES ON empleados_db.* TO 'empleados_user'@'localhost';
GRANT ALL PRIVILEGES ON empleados_db.* TO 'empleados_user'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL
```

Si se necesita importar con contraseña de `root`, usa esta variante:

```bash
cd "$HOME/ejercicio_programacion"
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### Backend

- `composer run setup` instala dependencias, crea `.env` si no existe, genera la clave de Laravel y prepara directorios locales
- las tres lineas con `sed` se pueden copiar tal cual porque reemplazan los valores por defecto de `backend/.env.example`
- despues del ajuste del `.env`, `php artisan config:clear` limpia configuraciones cacheadas

### Frontend

- `npm install` instala Angular 18 y el resto de dependencias del cliente
- no hay que configurar manualmente la URL de la API para desarrollo local
- si abres el frontend en tu misma maquina, la API quedara en `http://localhost:8000/api`
- si abres el frontend desde otro equipo en la red local, la API quedara en `http://IP-DEL-SERVIDOR:8000/api`

## Archivos locales que no deben subirse (incluidos en gitignore)

- `backend/storage/uploads`
- `backend/storage/logs`
- `backend/bootstrap/cache`
- `frontend/dist`
- `frontend/node_modules`
- `backend/vendor`
- archivos `.env`

## Documento tecnico

La descripcion de herramientas, arquitectura y ubicacion de la logica esta en:

- [ARCHITECTURE.md](./ARCHITECTURE.md)
