<?php

declare(strict_types=1);

namespace App\Modules\Reports\Controllers;

use App\Core\Http\Controllers\ApiController;
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
        $report = $this->service->list([
            'search' => $request->query('search'),
            'sort_by' => $request->query('sort_by', 'id'),
            'sort_dir' => $request->query('sort_dir', 'desc'),
            'page' => $request->query('page', 1),
            'per_page' => $request->query('per_page', 15),
        ]);

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
