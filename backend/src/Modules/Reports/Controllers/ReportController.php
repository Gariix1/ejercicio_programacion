<?php

declare(strict_types=1);

namespace App\Modules\Reports\Controllers;

use App\Core\Http\Request;
use App\Core\Http\Response;
use App\Modules\Reports\Services\ReportService;

final class ReportController
{
    public function __construct(private readonly ReportService $service)
    {
    }

    public function summary(Request $request): never
    {
        Response::json([
            'data' => $this->service->summary(),
            'meta' => ['module' => 'reports'],
        ]);
    }
}
