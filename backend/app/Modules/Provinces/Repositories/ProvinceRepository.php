<?php

declare(strict_types=1);

namespace App\Modules\Provinces\Repositories;

use App\Modules\Provinces\Models\Province;
use Illuminate\Support\Collection;

final class ProvinceRepository
{
    public function all(): Collection
    {
        return Province::query()
            ->orderBy('nombre')
            ->get();
    }
}
