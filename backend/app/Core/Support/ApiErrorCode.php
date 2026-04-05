<?php

declare(strict_types=1);

namespace App\Core\Support;

final class ApiErrorCode
{
    public const VALIDATION_ERROR = 'VALIDATION_ERROR';
    public const RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND';

    public static function validation(string $attribute, ?string $rule): string
    {
        $normalizedAttribute = strtoupper(str_replace(['.', '-'], '_', $attribute));

        if ($rule === null) {
            return 'VALIDATION_' . $normalizedAttribute . '_INVALID';
        }

        $normalizedRule = strtoupper(preg_replace('/(?<!^)[A-Z]/', '_$0', $rule) ?? $rule);

        return 'VALIDATION_' . $normalizedAttribute . '_' . $normalizedRule;
    }

    public static function modelNotFound(string $model): string
    {
        return strtoupper($model . '_NOT_FOUND');
    }
}
