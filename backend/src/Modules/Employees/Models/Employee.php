<?php

declare(strict_types=1);

namespace App\Modules\Employees\Models;

final class Employee
{
    public function __construct(private readonly array $attributes)
    {
    }

    public function toArray(): array
    {
        return $this->attributes;
    }
}
