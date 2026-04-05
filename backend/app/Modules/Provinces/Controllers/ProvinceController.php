<?php

declare(strict_types=1);

namespace App\Modules\Provinces\Controllers;

use App\Core\Http\Controllers\ApiController;
use App\Modules\Provinces\Resources\ProvinceResource;
use App\Modules\Provinces\Services\ProvinceService;
use Illuminate\Http\JsonResponse;

final class ProvinceController extends ApiController
{
    public function __construct(private readonly ProvinceService $service)
    {
    }

    public function index(): JsonResponse
    {
        return $this->collectionResponse(
            $this->service->list(),
            ProvinceResource::class,
            ['module' => 'provinces']
        );
    }
}
