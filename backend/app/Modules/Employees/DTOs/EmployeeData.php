<?php

declare(strict_types=1);

namespace App\Modules\Employees\DTOs;

use App\Modules\Employees\Enums\EmployeeStatus;

final class EmployeeData
{
    public function __construct(
        public readonly string $codigoEmpleado,
        public readonly string $nombres,
        public readonly string $apellidos,
        public readonly string $cedula,
        public readonly ?string $telefono,
        public readonly ?string $direccion,
        public readonly string $fechaNacimiento,
        public readonly string $email,
        public readonly ?string $fotografia,
        public readonly ?string $observacionesPersonales,
        public readonly string $fechaIngreso,
        public readonly string $cargo,
        public readonly string $departamento,
        public readonly float $sueldo,
        public readonly bool $jornadaParcial,
        public readonly ?string $observacionesLaborales,
        public readonly int $provinciaPersonalId,
        public readonly int $provinciaLaboralId,
        public readonly int $estadoCodigo,
        public readonly string $estadoNombre,
    ) {
    }

    public static function fromArray(array $payload): self
    {
        $status = EmployeeStatus::fromCode((int) ($payload['estado_codigo'] ?? EmployeeStatus::VIGENTE->value))
            ?? EmployeeStatus::VIGENTE;

        return new self(
            codigoEmpleado: (string) ($payload['codigo_empleado'] ?? ''),
            nombres: (string) ($payload['nombres'] ?? ''),
            apellidos: (string) ($payload['apellidos'] ?? ''),
            cedula: (string) ($payload['cedula'] ?? ''),
            telefono: isset($payload['telefono']) ? (string) $payload['telefono'] : null,
            direccion: isset($payload['direccion']) ? (string) $payload['direccion'] : null,
            fechaNacimiento: (string) ($payload['fecha_nacimiento'] ?? ''),
            email: (string) ($payload['email'] ?? ''),
            fotografia: isset($payload['fotografia']) ? (string) $payload['fotografia'] : null,
            observacionesPersonales: isset($payload['observaciones_personales']) ? (string) $payload['observaciones_personales'] : null,
            fechaIngreso: (string) ($payload['fecha_ingreso'] ?? ''),
            cargo: (string) ($payload['cargo'] ?? ''),
            departamento: (string) ($payload['departamento'] ?? ''),
            sueldo: (float) ($payload['sueldo'] ?? 0),
            jornadaParcial: (bool) ($payload['jornada_parcial'] ?? false),
            observacionesLaborales: isset($payload['observaciones_laborales']) ? (string) $payload['observaciones_laborales'] : null,
            provinciaPersonalId: (int) ($payload['provincia_personal_id'] ?? 0),
            provinciaLaboralId: (int) ($payload['provincia_laboral_id'] ?? 0),
            estadoCodigo: $status->value,
            estadoNombre: $status->label(),
        );
    }

    public function toPersistenceArray(): array
    {
        return [
            'codigo_empleado' => $this->codigoEmpleado,
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos,
            'cedula' => $this->cedula,
            'telefono' => $this->telefono,
            'direccion' => $this->direccion,
            'fecha_nacimiento' => $this->fechaNacimiento,
            'email' => $this->email,
            'fotografia' => $this->fotografia,
            'observaciones_personales' => $this->observacionesPersonales,
            'fecha_ingreso' => $this->fechaIngreso,
            'cargo' => $this->cargo,
            'departamento' => $this->departamento,
            'sueldo' => $this->sueldo,
            'jornada_parcial' => $this->jornadaParcial,
            'observaciones_laborales' => $this->observacionesLaborales,
            'provincia_personal_id' => $this->provinciaPersonalId,
            'provincia_laboral_id' => $this->provinciaLaboralId,
            'estado_codigo' => $this->estadoCodigo,
            'estado_nombre' => $this->estadoNombre,
        ];
    }
}
