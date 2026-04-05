<?php

declare(strict_types=1);

namespace App\Modules\Reports\Repositories;

use App\Modules\Employees\DTOs\EmployeeListFilters;
use App\Modules\Employees\Enums\EmployeeStatus;
use App\Modules\Employees\Repositories\EmployeeRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final class EmployeeReportRepository
{
    public function __construct(private readonly EmployeeRepository $employeeRepository)
    {
    }

    public function all(EmployeeListFilters $filters): LengthAwarePaginator
    {
        return $this->employeeRepository->all($filters);
    }

    public function summary(): array
    {
        $summary = DB::table('empleados')
            ->selectRaw('
                COUNT(*) AS total_empleados,
                SUM(CASE WHEN estado_codigo = ' . EmployeeStatus::VIGENTE->value . ' THEN 1 ELSE 0 END) AS empleados_vigentes,
                SUM(CASE WHEN estado_codigo = ' . EmployeeStatus::RETIRADO->value . ' THEN 1 ELSE 0 END) AS empleados_retirados,
                AVG(sueldo) AS sueldo_promedio
            ')
            ->first();

        return [
            'total_empleados' => (int) ($summary->total_empleados ?? 0),
            'empleados_vigentes' => (int) ($summary->empleados_vigentes ?? 0),
            'empleados_retirados' => (int) ($summary->empleados_retirados ?? 0),
            'sueldo_promedio' => isset($summary->sueldo_promedio) ? (float) $summary->sueldo_promedio : 0.0,
        ];
    }
}
