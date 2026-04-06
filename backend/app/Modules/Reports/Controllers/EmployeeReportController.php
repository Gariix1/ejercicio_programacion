<?php

declare(strict_types=1);

namespace App\Modules\Reports\Controllers;

use App\Core\Http\Controllers\ApiController;
use App\Modules\Employees\DTOs\EmployeeListFilters;
use App\Modules\Employees\Resources\EmployeeResource;
use App\Modules\Reports\Services\EmployeeReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class EmployeeReportController extends ApiController
{
    public function __construct(private readonly EmployeeReportService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $report = $this->service->list(
            EmployeeListFilters::fromRequest($request)
        );

        return $this->paginatedResponse(
            $report,
            EmployeeResource::class,
            ['module' => 'reports', 'type' => 'employees']
        );
    }

    public function export(Request $request): JsonResponse
    {
        $items = $this->service->export(
            EmployeeListFilters::fromRequest($request)
        );

        return $this->collectionResponse(
            $items,
            EmployeeResource::class,
            ['module' => 'reports', 'type' => 'employees-export']
        );
    }

    public function summary(Request $request): JsonResponse
    {
        return $this->documentResponse(
            [
                'type' => 'employee-report-summary',
                'id' => 'employees',
                'attributes' => $this->service->summary(),
            ],
            200,
            ['module' => 'reports', 'type' => 'summary'],
            ['self' => $request->fullUrl()]
        );
    }
}
