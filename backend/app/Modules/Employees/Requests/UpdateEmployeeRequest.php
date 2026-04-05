<?php

declare(strict_types=1);

namespace App\Modules\Employees\Requests;

final class UpdateEmployeeRequest extends EmployeeRequest
{
    public function rules(): array
    {
        return $this->baseRules((int) $this->route('id'));
    }
}
