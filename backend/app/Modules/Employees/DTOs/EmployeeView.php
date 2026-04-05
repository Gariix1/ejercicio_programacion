<?php

declare(strict_types=1);

namespace App\Modules\Employees\DTOs;

final class EmployeeView
{
    public function __construct(
        public readonly int $id,
        public readonly string $codigo_empleado,
        public readonly string $nombres,
        public readonly string $apellidos,
        public readonly string $cedula,
        public readonly ?string $telefono,
        public readonly ?string $direccion,
        public readonly string $fecha_nacimiento,
        public readonly string $email,
        public readonly ?string $fotografia,
        public readonly ?string $observaciones_personales,
        public readonly string $fecha_ingreso,
        public readonly string $cargo,
        public readonly string $departamento,
        public readonly float $sueldo,
        public readonly bool $jornada_parcial,
        public readonly ?string $observaciones_laborales,
        public readonly int $provincia_personal_id,
        public readonly int $provincia_laboral_id,
        public readonly int $estado_codigo,
        public readonly string $estado_nombre,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
        public readonly ?string $provincia_personal_nombre,
        public readonly ?string $provincia_laboral_nombre,
    ) {
    }

    public static function fromRow(object $row): self
    {
        return new self(
            id: (int) $row->id,
            codigo_empleado: (string) $row->codigo_empleado,
            nombres: (string) $row->nombres,
            apellidos: (string) $row->apellidos,
            cedula: (string) $row->cedula,
            telefono: isset($row->telefono) ? (string) $row->telefono : null,
            direccion: isset($row->direccion) ? (string) $row->direccion : null,
            fecha_nacimiento: (string) $row->fecha_nacimiento,
            email: (string) $row->email,
            fotografia: isset($row->fotografia) ? (string) $row->fotografia : null,
            observaciones_personales: isset($row->observaciones_personales) ? (string) $row->observaciones_personales : null,
            fecha_ingreso: (string) $row->fecha_ingreso,
            cargo: (string) $row->cargo,
            departamento: (string) $row->departamento,
            sueldo: (float) $row->sueldo,
            jornada_parcial: (bool) $row->jornada_parcial,
            observaciones_laborales: isset($row->observaciones_laborales) ? (string) $row->observaciones_laborales : null,
            provincia_personal_id: (int) $row->provincia_personal_id,
            provincia_laboral_id: (int) $row->provincia_laboral_id,
            estado_codigo: (int) $row->estado_codigo,
            estado_nombre: (string) $row->estado_nombre,
            created_at: isset($row->created_at) ? (string) $row->created_at : null,
            updated_at: isset($row->updated_at) ? (string) $row->updated_at : null,
            provincia_personal_nombre: isset($row->provincia_personal_nombre) ? (string) $row->provincia_personal_nombre : null,
            provincia_laboral_nombre: isset($row->provincia_laboral_nombre) ? (string) $row->provincia_laboral_nombre : null,
        );
    }
}
