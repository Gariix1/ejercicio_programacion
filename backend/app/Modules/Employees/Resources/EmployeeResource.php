<?php

declare(strict_types=1);

namespace App\Modules\Employees\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'type' => 'employees',
            'id' => (string) $this->id,
            'attributes' => [
                'codigo_empleado' => $this->codigo_empleado,
                'nombres' => $this->nombres,
                'apellidos' => $this->apellidos,
                'cedula' => $this->cedula,
                'telefono' => $this->telefono ?? null,
                'direccion' => $this->direccion ?? null,
                'fecha_nacimiento' => (string) $this->fecha_nacimiento,
                'email' => $this->email,
                'fotografia' => $this->fotografia,
                'observaciones_personales' => $this->observaciones_personales,
                'fecha_ingreso' => (string) $this->fecha_ingreso,
                'cargo' => $this->cargo,
                'departamento' => $this->departamento,
                'sueldo' => (float) $this->sueldo,
                'jornada_parcial' => (bool) $this->jornada_parcial,
                'observaciones_laborales' => $this->observaciones_laborales,
                'estado_codigo' => (int) $this->estado_codigo,
                'estado_nombre' => $this->estado_nombre,
                'created_at' => (string) $this->created_at,
                'updated_at' => (string) $this->updated_at,
            ],
            'relationships' => [
                'provincia_personal' => [
                    'data' => [
                        'type' => 'provinces',
                        'id' => (string) $this->provincia_personal_id,
                    ],
                    'meta' => [
                        'nombre' => $this->provincia_personal_nombre ?? $this->personalProvince?->nombre,
                    ],
                ],
                'provincia_laboral' => [
                    'data' => [
                        'type' => 'provinces',
                        'id' => (string) $this->provincia_laboral_id,
                    ],
                    'meta' => [
                        'nombre' => $this->provincia_laboral_nombre ?? $this->workProvince?->nombre,
                    ],
                ],
            ],
            'links' => [
                'self' => url('/api/employees/' . $this->id),
            ],
        ];
    }
}
