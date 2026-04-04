<?php

declare(strict_types=1);

namespace App\Modules\Employees\Controllers;

use App\Core\Http\Request;
use App\Core\Http\Response;
use App\Modules\Employees\Services\EmployeeService;

final class EmployeeController
{
    public function __construct(private readonly EmployeeService $service)
    {
    }

    public function index(Request $request): never
    {
        Response::json([
            'data' => $this->service->list(),
            'meta' => ['module' => 'employees'],
        ]);
    }

    public function show(Request $request): never
    {
        Response::json([
            'data' => $this->service->findOrFail((int) $request->route('id')),
        ]);
    }

    public function store(Request $request): never
    {
        Response::json([
            'message' => 'Empleado creado correctamente.',
            'data' => $this->service->create($request->all()),
        ], 201);
    }
}
