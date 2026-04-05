<?php

declare(strict_types=1);

namespace App\Modules\Employees\Requests;

use App\Modules\Employees\Enums\EmployeeStatus;
use App\Modules\Employees\Support\EmployeeValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

abstract class EmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'codigo_empleado' => strtoupper(trim((string) $this->input('codigo_empleado', ''))),
            'nombres' => trim((string) $this->input('nombres', '')),
            'apellidos' => trim((string) $this->input('apellidos', '')),
            'cedula' => trim((string) $this->input('cedula', '')),
            'telefono' => $this->normalizeOptionalDigits('telefono'),
            'direccion' => $this->normalizeOptionalText('direccion'),
            'email' => strtolower(trim((string) $this->input('email', ''))),
            'fotografia' => $this->normalizeOptionalText('fotografia'),
            'observaciones_personales' => $this->normalizeOptionalText('observaciones_personales'),
            'cargo' => trim((string) $this->input('cargo', '')),
            'departamento' => trim((string) $this->input('departamento', '')),
            'observaciones_laborales' => $this->normalizeOptionalText('observaciones_laborales'),
            'jornada_parcial' => filter_var(
                $this->input('jornada_parcial', false),
                FILTER_VALIDATE_BOOL,
                FILTER_NULL_ON_FAILURE
            ) ?? false,
            'estado_nombre' => strtoupper((string) $this->input('estado_nombre', 'VIGENTE')),
        ]);
    }

    protected function baseRules(?int $ignoreId = null): array
    {
        return EmployeeValidation::rules($ignoreId);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $estadoCodigo = (int) $this->input('estado_codigo', 1);
            $estadoNombre = strtoupper((string) $this->input('estado_nombre', 'VIGENTE'));

            if (!EmployeeStatus::isCoherent($estadoCodigo, $estadoNombre)) {
                $validator->errors()->add('estado_codigo', 'El estado codigo y el estado nombre deben ser coherentes entre si.');
            }
        });
    }

    public function messages(): array
    {
        return EmployeeValidation::messages();
    }

    public function attributes(): array
    {
        return EmployeeValidation::attributes();
    }

    private function normalizeOptionalDigits(string $key): ?string
    {
        $value = preg_replace('/\D+/', '', (string) $this->input($key, ''));

        return $value !== '' ? $value : null;
    }

    private function normalizeOptionalText(string $key): ?string
    {
        $value = trim((string) $this->input($key, ''));

        return $value !== '' ? $value : null;
    }
}
