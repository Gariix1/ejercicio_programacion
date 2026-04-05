<?php

declare(strict_types=1);

namespace App\Modules\Employees\Services;

use App\Modules\Employees\DTOs\EmployeeData;
use App\Modules\Employees\DTOs\EmployeeListFilters;
use App\Modules\Employees\DTOs\EmployeeView;
use App\Modules\Employees\Repositories\EmployeeRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class EmployeeService
{
    public function __construct(private readonly EmployeeRepository $repository)
    {
    }

    public function list(EmployeeListFilters $filters): LengthAwarePaginator
    {
        return $this->repository->all($filters);
    }

    public function findOrFail(int $id): EmployeeView
    {
        return $this->repository->findDetailsOrFail($id);
    }

    public function create(array $payload): EmployeeView
    {
        $employee = $this->repository->create(
            EmployeeData::fromArray($payload)
        );

        return $this->repository->findDetailsOrFail((int) $employee->getKey());
    }

    public function update(int $id, array $payload): EmployeeView
    {
        $employee = $this->repository->getModelOrFail($id);

        $this->repository->update($employee, EmployeeData::fromArray($payload));

        return $this->repository->findDetailsOrFail($id);
    }
}
