<?php

declare(strict_types=1);

namespace App\Modules\Employees\Requests;

use App\Modules\Employees\Enums\EmployeeStatus;
use App\Modules\Employees\Models\Employee;
use App\Modules\Employees\Support\EmployeeValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

abstract class EmployeeRequest extends FormRequest
{
    private const ATTRIBUTE_KEYS = [
        'codigo_empleado',
        'nombres',
        'apellidos',
        'cedula',
        'telefono',
        'direccion',
        'fecha_nacimiento',
        'email',
        'fotografia',
        'observaciones_personales',
        'fecha_ingreso',
        'cargo',
        'departamento',
        'sueldo',
        'jornada_parcial',
        'observaciones_laborales',
        'provincia_personal_id',
        'provincia_laboral_id',
        'estado_codigo',
        'estado_nombre',
    ];

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge($this->normalizedPayload());
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

    protected function normalizedPayload(): array
    {
        return [
            'codigo_empleado' => strtoupper(trim((string) $this->input('codigo_empleado', ''))),
            'nombres' => trim((string) $this->input('nombres', '')),
            'apellidos' => trim((string) $this->input('apellidos', '')),
            'cedula' => trim((string) $this->input('cedula', '')),
            'telefono' => $this->normalizeOptionalDigits('telefono'),
            'direccion' => $this->normalizeOptionalText('direccion'),
            'fecha_nacimiento' => (string) $this->input('fecha_nacimiento', ''),
            'email' => strtolower(trim((string) $this->input('email', ''))),
            'fotografia' => $this->normalizeOptionalText('fotografia'),
            'observaciones_personales' => $this->normalizeOptionalText('observaciones_personales'),
            'fecha_ingreso' => (string) $this->input('fecha_ingreso', ''),
            'cargo' => trim((string) $this->input('cargo', '')),
            'departamento' => trim((string) $this->input('departamento', '')),
            'sueldo' => $this->input('sueldo'),
            'jornada_parcial' => filter_var(
                $this->input('jornada_parcial', false),
                FILTER_VALIDATE_BOOL,
                FILTER_NULL_ON_FAILURE
            ) ?? false,
            'observaciones_laborales' => $this->normalizeOptionalText('observaciones_laborales'),
            'provincia_personal_id' => $this->input('provincia_personal_id'),
            'provincia_laboral_id' => $this->input('provincia_laboral_id'),
            'estado_codigo' => $this->input('estado_codigo', 1),
            'estado_nombre' => strtoupper((string) $this->input('estado_nombre', 'VIGENTE')),
        ];
    }

    protected function mergedNormalizedPayloadWithCurrentEmployee(): array
    {
        $employee = Employee::query()->findOrFail((int) $this->route('id'));
        $current = $employee->only(self::ATTRIBUTE_KEYS);
        $normalized = $current;

        foreach (self::ATTRIBUTE_KEYS as $key) {
            if ($this->exists($key)) {
                $normalized[$key] = $this->normalizedValueFor($key);
            }
        }

        return $normalized;
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

    private function normalizedValueFor(string $key): mixed
    {
        return match ($key) {
            'codigo_empleado' => strtoupper(trim((string) $this->input($key, ''))),
            'nombres', 'apellidos', 'cargo', 'departamento' => trim((string) $this->input($key, '')),
            'cedula' => trim((string) $this->input($key, '')),
            'telefono' => $this->normalizeOptionalDigits($key),
            'direccion', 'fotografia', 'observaciones_personales', 'observaciones_laborales' => $this->normalizeOptionalText($key),
            'email' => strtolower(trim((string) $this->input($key, ''))),
            'fecha_nacimiento', 'fecha_ingreso' => (string) $this->input($key, ''),
            'sueldo', 'provincia_personal_id', 'provincia_laboral_id', 'estado_codigo' => $this->input($key),
            'jornada_parcial' => filter_var(
                $this->input($key, false),
                FILTER_VALIDATE_BOOL,
                FILTER_NULL_ON_FAILURE
            ) ?? false,
            'estado_nombre' => strtoupper((string) $this->input($key, '')),
            default => $this->input($key),
        };
    }
}
