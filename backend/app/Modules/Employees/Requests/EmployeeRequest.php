<?php

declare(strict_types=1);

namespace App\Modules\Employees\Requests;

use App\Modules\Employees\Enums\EmployeeStatus;
use App\Modules\Employees\Models\Employee;
use App\Modules\Employees\Support\EmployeeValidation;
use Illuminate\Foundation\Http\FormRequest;

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
    ];

    private const DEFAULT_INPUTS = [
        'codigo_empleado' => '',
        'nombres' => '',
        'apellidos' => '',
        'cedula' => '',
        'telefono' => '',
        'direccion' => '',
        'fecha_nacimiento' => '',
        'email' => '',
        'fotografia' => '',
        'observaciones_personales' => '',
        'fecha_ingreso' => '',
        'cargo' => '',
        'departamento' => '',
        'sueldo' => null,
        'jornada_parcial' => false,
        'observaciones_laborales' => '',
        'provincia_personal_id' => null,
        'provincia_laboral_id' => null,
        'estado_codigo' => EmployeeStatus::VIGENTE->value,
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
        return $this->normalizeKeys(self::ATTRIBUTE_KEYS);
    }

    protected function mergedNormalizedPayloadWithCurrentEmployee(): array
    {
        $employee = Employee::query()->findOrFail((int) $this->route('id'));
        $current = $employee->only(self::ATTRIBUTE_KEYS);
        $normalized = $current;

        foreach (self::ATTRIBUTE_KEYS as $key) {
            if ($this->exists($key)) {
                $normalized[$key] = $this->normalizeInputValue($key);
            }
        }

        return $normalized;
    }

    private function normalizeKeys(array $keys): array
    {
        $normalized = [];

        foreach ($keys as $key) {
            $normalized[$key] = $this->normalizeInputValue($key, self::DEFAULT_INPUTS[$key] ?? null);
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

    private function normalizeInputValue(string $key, mixed $default = null): mixed
    {
        $value = $this->input($key, $default);

        return match ($key) {
            'codigo_empleado' => strtoupper(trim((string) $value)),
            'nombres', 'apellidos', 'cargo', 'departamento' => trim((string) $value),
            'cedula' => trim((string) $value),
            'telefono' => $this->normalizeOptionalDigits($key),
            'direccion', 'fotografia', 'observaciones_personales', 'observaciones_laborales' => $this->normalizeOptionalText($key),
            'email' => strtolower(trim((string) $value)),
            'fecha_nacimiento', 'fecha_ingreso' => (string) $value,
            'sueldo', 'provincia_personal_id', 'provincia_laboral_id', 'estado_codigo' => $value,
            'jornada_parcial' => filter_var(
                $value,
                FILTER_VALIDATE_BOOL,
                FILTER_NULL_ON_FAILURE
            ) ?? false,
            default => $value,
        };
    }
}
