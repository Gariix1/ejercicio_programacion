<?php

declare(strict_types=1);

namespace App\Modules\Provinces\Services;

use App\Modules\Provinces\Repositories\ProvinceRepository;

final class ProvinceService
{
    public function __construct(private readonly ProvinceRepository $repository)
    {
    }

    public function list(): array
    {
        return $this->repository->all();
    }
}
