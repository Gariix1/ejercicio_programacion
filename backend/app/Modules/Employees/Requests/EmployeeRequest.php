<?php

declare(strict_types=1);

namespace App\Modules\Employees\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
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
        $codigoRule = Rule::unique('empleados', 'codigo_empleado');
        $cedulaRule = Rule::unique('empleados', 'cedula');

        if ($ignoreId !== null) {
            $codigoRule = $codigoRule->ignore($ignoreId);
            $cedulaRule = $cedulaRule->ignore($ignoreId);
        }

        return [
            'codigo_empleado' => ['required', 'string', 'size:5', $codigoRule],
            'nombres' => ['required', 'string', 'max:100'],
            'apellidos' => ['required', 'string', 'max:100'],
            'cedula' => ['required', 'string', 'size:10', $cedulaRule],
            'telefono' => ['nullable', 'string', 'max:15', 'regex:/^[0-9]+$/'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'fecha_nacimiento' => ['required', 'date'],
            'email' => ['required', 'email', 'max:150'],
            'fotografia' => ['nullable', 'string', 'max:255'],
            'observaciones_personales' => ['nullable', 'string'],
            'fecha_ingreso' => ['required', 'date'],
            'cargo' => ['required', 'string', 'max:100'],
            'departamento' => ['required', 'string', 'max:100'],
            'sueldo' => ['required', 'numeric', 'min:0'],
            'jornada_parcial' => ['required', 'boolean'],
            'observaciones_laborales' => ['nullable', 'string'],
            'provincia_personal_id' => ['required', 'integer', 'exists:provincias,id'],
            'provincia_laboral_id' => ['required', 'integer', 'exists:provincias,id'],
            'estado_codigo' => ['required', 'integer', Rule::in([1, 9])],
            'estado_nombre' => ['required', 'string', Rule::in(['VIGENTE', 'RETIRADO'])],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $estadoCodigo = (int) $this->input('estado_codigo', 1);
            $estadoNombre = strtoupper((string) $this->input('estado_nombre', 'VIGENTE'));

            $coherentState = ($estadoCodigo === 1 && $estadoNombre === 'VIGENTE')
                || ($estadoCodigo === 9 && $estadoNombre === 'RETIRADO');

            if (!$coherentState) {
                $validator->errors()->add('estado_codigo', 'El estado codigo y el estado nombre deben ser coherentes.');
            }
        });
    }
}
