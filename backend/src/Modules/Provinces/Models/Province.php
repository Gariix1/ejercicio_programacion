<?php

declare(strict_types=1);

namespace App\Modules\Provinces\Models;

final class Province
{
    public function __construct(private readonly array $attributes)
    {
    }

    public function toArray(): array
    {
        return $this->attributes;
    }
}
