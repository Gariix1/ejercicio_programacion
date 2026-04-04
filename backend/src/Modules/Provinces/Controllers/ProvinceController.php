<?php

declare(strict_types=1);

namespace App\Modules\Provinces\Controllers;

use App\Core\Http\Request;
use App\Core\Http\Response;
use App\Modules\Provinces\Services\ProvinceService;

final class ProvinceController
{
    public function __construct(private readonly ProvinceService $service)
    {
    }

    public function index(Request $request): never
    {
        Response::json([
            'data' => $this->service->list(),
            'meta' => ['module' => 'provinces'],
        ]);
    }
}
