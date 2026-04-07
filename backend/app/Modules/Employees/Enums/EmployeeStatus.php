<?php

declare(strict_types=1);

namespace App\Modules\Employees\Enums;

enum EmployeeStatus: int
{
    case VIGENTE = 1;
    case RETIRADO = 9;

    public function label(): string
    {
        return match ($this) {
            self::VIGENTE => 'VIGENTE',
            self::RETIRADO => 'RETIRADO',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::VIGENTE => 'Empleado activo en la organizacion.',
            self::RETIRADO => 'Empleado retirado de la organizacion.',
        };
    }

    public static function codes(): array
    {
        return array_map(
            static fn (self $status): int => $status->value,
            self::cases()
        );
    }

    public static function fromCode(int $code): ?self
    {
        return self::tryFrom($code);
    }
}
