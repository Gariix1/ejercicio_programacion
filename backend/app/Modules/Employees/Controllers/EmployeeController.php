<?php

declare(strict_types=1);

namespace App\Modules\Employees\Controllers;

use App\Core\Http\Controllers\ApiController;
use App\Modules\Employees\DTOs\EmployeeListFilters;
use App\Modules\Employees\Requests\PatchEmployeeRequest;
use App\Modules\Employees\Requests\StoreEmployeeRequest;
use App\Modules\Employees\Requests\UploadEmployeePhotoRequest;
use App\Modules\Employees\Requests\UpdateEmployeeRequest;
use App\Modules\Employees\Resources\EmployeeResource;
use App\Modules\Employees\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

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

    public function uploadPhoto(UploadEmployeePhotoRequest $request): JsonResponse
    {
        $file = $request->file('fotografia');
        $path = $file->store('empleados', 'public');

        return $this->documentResponse(
            [
                'type' => 'employee-uploads',
                'id' => pathinfo($path, PATHINFO_FILENAME),
                'attributes' => [
                    'path' => $path,
                    'url' => $this->employeePhotoUrl($path),
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ],
            ],
            201,
            [
                'module' => 'employees',
                'message' => 'Fotografia cargada correctamente.',
            ],
            ['self' => url('/api/employees/photo')]
        );
    }

    public function showPhoto(string $path): BinaryFileResponse
    {
        abort_unless($this->isSafeUploadPath($path), 404);
        abort_unless(Storage::disk('public')->exists($path), 404);

        return response()->file(Storage::disk('public')->path($path), [
            'Cache-Control' => 'public, max-age=3600',
        ]);
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

    public function destroy(int $id): JsonResponse
    {
        $employee = $this->service->delete($id);

        return $this->itemResponse(
            new EmployeeResource($employee),
            200,
            [
                'module' => 'employees',
                'message' => 'Empleado eliminado correctamente.',
            ],
            ['self' => url('/api/employees/' . $employee->id)]
        );
    }

    private function employeePhotoUrl(string $path): string
    {
        $segments = array_map('rawurlencode', explode('/', ltrim($path, '/')));

        return url('/api/employee-photos/' . implode('/', $segments));
    }

    private function isSafeUploadPath(string $path): bool
    {
        if (trim($path) === '') {
            return false;
        }

        return !str_contains($path, '..');
    }
}
