<?php

declare(strict_types=1);

namespace App\Modules\Employees\Controllers;

use App\Core\Http\Controllers\ApiController;
use App\Modules\Employees\DTOs\EmployeeListFilters;
use App\Modules\Employees\Requests\StoreEmployeeRequest;
use App\Modules\Employees\Requests\UpdateEmployeeRequest;
use App\Modules\Employees\Resources\EmployeeResource;
use App\Modules\Employees\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class EmployeeController extends ApiController
{
    public function __construct(private readonly EmployeeService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $employees = $this->service->list(
            EmployeeListFilters::fromRequest($request)
        );

        return $this->collectionResponse(
            EmployeeResource::collection($employees),
            ['meta' => ['module' => 'employees']]
        );
    }

    public function show(int $id): JsonResponse
    {
        return $this->itemResponse(
            new EmployeeResource($this->service->findOrFail($id))
        );
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        return $this->itemResponse(
            new EmployeeResource($this->service->create($request->validated())),
            201,
            ['message' => 'Empleado creado correctamente.']
        );
    }

    public function update(UpdateEmployeeRequest $request, int $id): JsonResponse
    {
        return $this->itemResponse(
            new EmployeeResource($this->service->update($id, $request->validated())),
            200,
            ['message' => 'Empleado actualizado correctamente.']
        );
    }
}
