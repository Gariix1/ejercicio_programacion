<?php

declare(strict_types=1);

namespace App\Modules\Provinces\Services;

use App\Modules\Provinces\Repositories\ProvinceRepository;
use Illuminate\Support\Collection;

final class ProvinceService
{
    public function __construct(private readonly ProvinceRepository $repository)
    {
    }

    public function list(): Collection
    {
        return $this->repository->all();
    }
}
