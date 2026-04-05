<?php

declare(strict_types=1);

namespace App\Modules\Reports\Services;

use App\Modules\Employees\DTOs\EmployeeListFilters;
use App\Modules\Reports\Repositories\EmployeeReportRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class EmployeeReportService
{
    public function __construct(private readonly EmployeeReportRepository $repository)
    {
    }

    public function list(EmployeeListFilters $filters): LengthAwarePaginator
    {
        return $this->repository->all($filters);
    }

    public function summary(): array
    {
        return $this->repository->summary();
    }
}
