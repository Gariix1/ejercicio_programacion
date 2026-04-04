<?php

declare(strict_types=1);

namespace App\Modules\Employees\Services;

use App\Modules\Employees\DTOs\EmployeeData;
use App\Modules\Employees\Repositories\EmployeeRepository;
use App\Modules\Employees\Validators\EmployeeValidator;
use App\Shared\Exceptions\HttpException;

final class EmployeeService
{
    public function __construct(
        private readonly EmployeeRepository $repository,
        private readonly EmployeeValidator $validator
    ) {
    }

    public function list(): array
    {
        return $this->repository->all();
    }

    public function findOrFail(int $id): array
    {
        $employee = $this->repository->find($id);

        if ($employee === null) {
            throw new HttpException('Empleado no encontrado.', 404);
        }

        return $employee;
    }

    public function create(array $payload): array
    {
        $employeeData = EmployeeData::fromArray($payload);
        $this->validator->validate($employeeData);

        return $this->repository->create($employeeData);
    }
}
