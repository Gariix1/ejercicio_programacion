<?php

declare(strict_types=1);

namespace App\Modules\Employees\Controllers;

use App\Core\Http\Controllers\ApiController;
use App\Modules\Employees\DTOs\EmployeeListFilters;
use App\Modules\Employees\Requests\PatchEmployeeRequest;
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

        return $this->paginatedResponse(
            $employees,
            EmployeeResource::class,
            ['module' => 'employees']
        );
    }

    public function show(int $id): JsonResponse
    {
        return $this->itemResponse(
            new EmployeeResource($this->service->findOrFail($id)),
            200,
            ['module' => 'employees'],
            ['self' => url('/api/employees/' . $id)]
        );
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $employee = $this->service->create($request->validated());

        return $this->itemResponse(
            new EmployeeResource($employee),
            201,
            [
                'module' => 'employees',
                'message' => 'Empleado creado correctamente.',
            ],
            ['self' => url('/api/employees/' . $employee->id)]
        );
    }

    public function update(UpdateEmployeeRequest $request, int $id): JsonResponse
    {
        $employee = $this->service->update($id, $request->validated());

        return $this->itemResponse(
            new EmployeeResource($employee),
            200,
            [
                'module' => 'employees',
                'message' => 'Empleado actualizado correctamente.',
            ],
            ['self' => url('/api/employees/' . $employee->id)]
        );
    }

    public function patch(PatchEmployeeRequest $request, int $id): JsonResponse
    {
        $employee = $this->service->update($id, $request->validated());

        return $this->itemResponse(
            new EmployeeResource($employee),
            200,
            [
                'module' => 'employees',
                'message' => 'Empleado actualizado parcialmente correctamente.',
            ],
            ['self' => url('/api/employees/' . $employee->id)]
        );
    }
}
