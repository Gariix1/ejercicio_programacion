<?php

declare(strict_types=1);

namespace App\Modules\Reports\Services;

use App\Modules\Reports\Repositories\ReportRepository;

final class ReportService
{
    public function __construct(private readonly ReportRepository $repository)
    {
    }

    public function summary(): array
    {
        return $this->repository->employeeSummary();
    }
}
