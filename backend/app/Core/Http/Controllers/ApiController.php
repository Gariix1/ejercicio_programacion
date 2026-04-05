<?php

declare(strict_types=1);

namespace App\Core\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

abstract class ApiController extends Controller
{
    protected function itemResponse(JsonResource $resource, int $status = 200, array $additional = []): JsonResponse
    {
        $response = $resource->additional($additional)->response(request());
        $response->setStatusCode($status);

        return $response;
    }

    protected function collectionResponse(AnonymousResourceCollection $resource, array $additional = []): JsonResponse
    {
        return $resource->additional($additional)->response(request());
    }

    protected function arrayResponse(array $payload, int $status = 200): JsonResponse
    {
        return response()->json($payload, $status);
    }
}
