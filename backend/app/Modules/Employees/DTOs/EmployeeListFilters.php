<?php

declare(strict_types=1);

namespace App\Modules\Employees\DTOs;

use Illuminate\Http\Request;

final class EmployeeListFilters
{
    public function __construct(
        public readonly ?string $search,
        public readonly ?string $nombre,
        public readonly ?string $codigo,
        public readonly string $sortBy,
        public readonly string $sortDir,
        public readonly int $page,
        public readonly int $perPage,
    ) {
    }

    public static function fromArray(array $filters = []): self
    {
        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = (int) ($filters['per_page'] ?? 15);

        if ($perPage < 1) {
            $perPage = 15;
        }

        return new self(
            search: self::normalizeSearch($filters['search'] ?? null),
            nombre: self::normalizeSearch($filters['nombre'] ?? null),
            codigo: self::normalizeSearch($filters['codigo'] ?? null),
            sortBy: (string) ($filters['sort_by'] ?? 'id'),
            sortDir: strtolower((string) ($filters['sort_dir'] ?? 'desc')) === 'asc' ? 'asc' : 'desc',
            page: $page,
            perPage: min($perPage, 100),
        );
    }

    public static function fromRequest(Request $request): self
    {
        return self::fromArray([
            'search' => $request->query('search'),
            'nombre' => $request->query('nombre'),
            'codigo' => $request->query('codigo'),
            'sort_by' => $request->query('sort_by', 'id'),
            'sort_dir' => $request->query('sort_dir', 'desc'),
            'page' => $request->query('page', 1),
            'per_page' => $request->query('per_page', 15),
        ]);
    }

    private static function normalizeSearch(mixed $value): ?string
    {
        $resolved = trim((string) $value);

        return $resolved !== '' ? $resolved : null;
    }
}
