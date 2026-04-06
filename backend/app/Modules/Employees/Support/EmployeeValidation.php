<?php

declare(strict_types=1);

namespace App\Modules\Employees\Support;

use Illuminate\Validation\Rule;

final class EmployeeValidation
{
    public static function rules(?int $ignoreId = null): array
    {
        $codigoRule = Rule::unique('empleados', 'codigo_empleado');
        $cedulaRule = Rule::unique('empleados', 'cedula');

        if ($ignoreId !== null) {
            $codigoRule = $codigoRule->ignore($ignoreId);
            $cedulaRule = $cedulaRule->ignore($ignoreId);
        }

        return [
            'codigo_empleado' => ['required', 'string', 'size:5', 'alpha_num:ascii', $codigoRule],
            'nombres' => ['required', 'string', 'max:100'],
            'apellidos' => ['required', 'string', 'max:100'],
            'cedula' => ['required', 'digits:10', $cedulaRule],
            'telefono' => ['nullable', 'digits_between:7,15'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'fecha_nacimiento' => ['required', 'date', 'before:today'],
            'email' => ['required', 'email', 'max:150'],
            'fotografia' => ['nullable', 'string', 'max:255'],
            'observaciones_personales' => ['nullable', 'string'],
            'fecha_ingreso' => ['required', 'date', 'before_or_equal:today', 'after:fecha_nacimiento'],
            'cargo' => ['required', 'string', 'max:100'],
            'departamento' => ['required', 'string', 'max:100'],
            'sueldo' => ['required', 'numeric', 'gt:0'],
            'jornada_parcial' => ['required', 'boolean'],
            'observaciones_laborales' => ['nullable', 'string'],
            'provincia_personal_id' => ['required', 'integer', 'exists:provincias,id'],
            'provincia_laboral_id' => ['required', 'integer', 'exists:provincias,id'],
            'estado_codigo' => ['required', 'integer', Rule::in([1, 9])],
        ];
    }

    public static function messages(): array
    {
        return [
            'codigo_empleado.required' => 'El codigo de empleado es obligatorio.',
            'codigo_empleado.size' => 'El codigo de empleado debe tener exactamente 5 caracteres.',
            'codigo_empleado.alpha_num' => 'El codigo de empleado solo puede contener letras y numeros.',
            'codigo_empleado.unique' => 'El codigo de empleado ya esta registrado.',
            'nombres.required' => 'Los nombres son obligatorios.',
            'apellidos.required' => 'Los apellidos son obligatorios.',
            'cedula.required' => 'La cedula es obligatoria.',
            'cedula.digits' => 'La cedula debe tener exactamente 10 digitos.',
            'cedula.unique' => 'La cedula ya esta registrada.',
            'telefono.digits_between' => 'El telefono debe contener entre 7 y 15 digitos.',
            'direccion.max' => 'La direccion no puede superar los 255 caracteres.',
            'fecha_nacimiento.required' => 'La fecha de nacimiento es obligatoria.',
            'fecha_nacimiento.date' => 'La fecha de nacimiento no tiene un formato valido.',
            'fecha_nacimiento.before' => 'La fecha de nacimiento debe ser anterior a hoy.',
            'email.required' => 'El correo electronico es obligatorio.',
            'email.email' => 'El correo electronico debe tener un formato valido.',
            'fotografia.max' => 'La ruta de la fotografia no puede superar los 255 caracteres.',
            'fecha_ingreso.required' => 'La fecha de ingreso es obligatoria.',
            'fecha_ingreso.date' => 'La fecha de ingreso no tiene un formato valido.',
            'fecha_ingreso.before_or_equal' => 'La fecha de ingreso no puede ser futura.',
            'fecha_ingreso.after' => 'La fecha de ingreso debe ser posterior a la fecha de nacimiento.',
            'cargo.required' => 'El cargo es obligatorio.',
            'departamento.required' => 'El departamento es obligatorio.',
            'sueldo.required' => 'El sueldo es obligatorio.',
            'sueldo.numeric' => 'El sueldo debe ser un valor numerico.',
            'sueldo.gt' => 'El sueldo debe ser mayor que cero.',
            'jornada_parcial.required' => 'La jornada parcial es obligatoria.',
            'jornada_parcial.boolean' => 'La jornada parcial debe ser verdadera o falsa.',
            'provincia_personal_id.required' => 'La provincia personal es obligatoria.',
            'provincia_personal_id.exists' => 'La provincia personal seleccionada no existe.',
            'provincia_laboral_id.required' => 'La provincia laboral es obligatoria.',
            'provincia_laboral_id.exists' => 'La provincia laboral seleccionada no existe.',
            'estado_codigo.required' => 'El estado codigo es obligatorio.',
            'estado_codigo.in' => 'El estado codigo debe ser 1 o 9.',
        ];
    }

    public static function attributes(): array
    {
        return [
            'codigo_empleado' => 'codigo de empleado',
            'nombres' => 'nombres',
            'apellidos' => 'apellidos',
            'cedula' => 'cedula',
            'telefono' => 'telefono',
            'direccion' => 'direccion',
            'fecha_nacimiento' => 'fecha de nacimiento',
            'email' => 'correo electronico',
            'fotografia' => 'fotografia',
            'observaciones_personales' => 'observaciones personales',
            'fecha_ingreso' => 'fecha de ingreso',
            'cargo' => 'cargo',
            'departamento' => 'departamento',
            'sueldo' => 'sueldo',
            'jornada_parcial' => 'jornada parcial',
            'observaciones_laborales' => 'observaciones laborales',
            'provincia_personal_id' => 'provincia personal',
            'provincia_laboral_id' => 'provincia laboral',
            'estado_codigo' => 'estado codigo',
        ];
    }
}
