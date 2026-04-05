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

        return $this->collectionResponse(
            EmployeeResource::collection($report),
            ['meta' => ['module' => 'reports', 'type' => 'employees']]
        );
    }

    public function summary(): JsonResponse
    {
        return $this->arrayResponse([
            'data' => $this->service->summary(),
            'meta' => ['module' => 'reports', 'type' => 'summary'],
        ]);
    }
}
