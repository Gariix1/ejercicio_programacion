<?php

declare(strict_types=1);

namespace App\Modules\Employees\Requests;

final class StoreEmployeeRequest extends EmployeeRequest
{
    public function rules(): array
    {
        return $this->baseRules();
    }
}
