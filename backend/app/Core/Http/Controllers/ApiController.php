<?php

declare(strict_types=1);

namespace App\Core\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

abstract class ApiController extends Controller
{
    protected function itemResponse(
        JsonResource $resource,
        int $status = 200,
        array $meta = [],
        array $links = []
    ): JsonResponse
    {
        return $this->documentResponse(
            $resource->resolve(request()),
            $status,
            $meta,
            $links
        );
    }

    protected function collectionResponse(
        iterable $items,
        string $resourceClass,
        array $meta = [],
        array $links = []
    ): JsonResponse
    {
        return $this->documentResponse(
            $this->resolveCollection($items, $resourceClass),
            200,
            $meta,
            $links + ['self' => request()->fullUrl()]
        );
    }

    protected function paginatedResponse(
        LengthAwarePaginator $paginator,
        string $resourceClass,
        array $meta = [],
        array $links = []
    ): JsonResponse
    {
        return $this->documentResponse(
            $this->resolveCollection($paginator->items(), $resourceClass),
            200,
            $meta + ['pagination' => $this->paginationMeta($paginator)],
            $this->paginationLinks($paginator) + $links
        );
    }

    protected function documentResponse(
        array $data,
        int $status = 200,
        array $meta = [],
        array $links = []
    ): JsonResponse {
        return response()->json([
            'data' => $data,
            'meta' => $meta,
            'links' => $links,
        ], $status);
    }

    /**
     * @param iterable<mixed> $items
     * @return array<int, array<string, mixed>>
     */
    private function resolveCollection(iterable $items, string $resourceClass): array
    {
        return Collection::make($items)
            ->values()
            ->map(
                fn (mixed $item): array => $this->resolveResource($item, $resourceClass)
            )
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function resolveResource(mixed $item, string $resourceClass): array
    {
        /** @var JsonResource $resource */
        $resource = new $resourceClass($item);

        return $resource->resolve(request());
    }

    private function paginationMeta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
        ];
    }

    private function paginationLinks(LengthAwarePaginator $paginator): array
    {
        return [
            'self' => request()->fullUrl(),
            'first' => $this->pageUrl(1),
            'last' => $this->pageUrl(max($paginator->lastPage(), 1)),
            'prev' => $paginator->currentPage() > 1
                ? $this->pageUrl($paginator->currentPage() - 1)
                : null,
            'next' => $paginator->hasMorePages()
                ? $this->pageUrl($paginator->currentPage() + 1)
                : null,
        ];
    }

    private function pageUrl(int $page): string
    {
        return request()->fullUrlWithQuery(['page' => $page]);
    }
}
