<?php

declare(strict_types=1);

namespace App\Modules\Employees\Validators;

use App\Modules\Employees\DTOs\EmployeeData;
use App\Shared\Exceptions\ValidationException;

final class EmployeeValidator
{
    public function validate(EmployeeData $employeeData): void
    {
        $errors = [];

        if (strlen($employeeData->codigoEmpleado) !== 5) {
            $errors['codigo_empleado'] = 'El codigo debe tener exactamente 5 caracteres.';
        }

        if (strlen($employeeData->cedula) !== 10) {
            $errors['cedula'] = 'La cedula debe tener exactamente 10 digitos.';
        }

        if (!filter_var($employeeData->email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'El email no tiene un formato valido.';
        }

        if ($employeeData->provinciaPersonalId < 1) {
            $errors['provincia_personal_id'] = 'La provincia personal es obligatoria.';
        }

        if ($employeeData->provinciaLaboralId < 1) {
            $errors['provincia_laboral_id'] = 'La provincia laboral es obligatoria.';
        }

        if (!in_array($employeeData->estadoCodigo, [1, 9], true)) {
            $errors['estado_codigo'] = 'El estado permitido es 1 o 9.';
        }

        if (!in_array($employeeData->estadoNombre, ['VIGENTE', 'RETIRADO'], true)) {
            $errors['estado_nombre'] = 'El nombre del estado permitido es VIGENTE o RETIRADO.';
        }

        if ($errors !== []) {
            throw new ValidationException('La carga del empleado no es valida.', $errors);
        }
    }
}
