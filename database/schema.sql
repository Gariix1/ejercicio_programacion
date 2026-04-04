CREATE DATABASE IF NOT EXISTS empleados_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE empleados_db;

DROP TABLE IF EXISTS empleados;
DROP TABLE IF EXISTS provincias;

CREATE TABLE provincias (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    capital VARCHAR(100) DEFAULT NULL,
    descripcion TEXT DEFAULT NULL,
    poblacion VARCHAR(50) DEFAULT NULL,
    superficie DECIMAL(10,2) DEFAULT NULL,
    latitud DECIMAL(10,6) DEFAULT NULL,
    longitud DECIMAL(10,6) DEFAULT NULL,
    id_region INT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_provincias_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE empleados (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    codigo_empleado VARCHAR(5) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cedula VARCHAR(10) NOT NULL,
    telefono VARCHAR(15) DEFAULT NULL,
    direccion VARCHAR(255) DEFAULT NULL,
    fecha_nacimiento DATE NOT NULL,
    email VARCHAR(150) NOT NULL,
    fotografia VARCHAR(255) DEFAULT NULL,
    observaciones_personales TEXT DEFAULT NULL,
    fecha_ingreso DATE NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    sueldo DECIMAL(10,2) NOT NULL,
    jornada_parcial TINYINT(1) NOT NULL DEFAULT 0,
    observaciones_laborales TEXT DEFAULT NULL,
    provincia_personal_id INT UNSIGNED NOT NULL,
    provincia_laboral_id INT UNSIGNED NOT NULL,
    estado_codigo TINYINT NOT NULL DEFAULT 1,
    estado_nombre VARCHAR(20) NOT NULL DEFAULT 'VIGENTE',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_empleados_codigo_empleado (codigo_empleado),
    UNIQUE KEY uq_empleados_cedula (cedula),
    KEY idx_empleados_provincia_personal (provincia_personal_id),
    KEY idx_empleados_provincia_laboral (provincia_laboral_id),
    CONSTRAINT fk_empleado_provincia_personal
        FOREIGN KEY (provincia_personal_id) REFERENCES provincias(id),
    CONSTRAINT fk_empleado_provincia_laboral
        FOREIGN KEY (provincia_laboral_id) REFERENCES provincias(id),
    CONSTRAINT chk_estado
        CHECK (
            (estado_codigo = 1 AND estado_nombre = 'VIGENTE') OR
            (estado_codigo = 9 AND estado_nombre = 'RETIRADO')
        )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;