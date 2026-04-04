<?php

declare(strict_types=1);

namespace App\Core\Support;

final class Env
{
    public static function load(string $filePath): void
    {
        if (!file_exists($filePath)) {
            return;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];

        foreach ($lines as $line) {
            $trimmed = trim($line);

            if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                continue;
            }

            [$key, $value] = array_pad(explode('=', $trimmed, 2), 2, '');
            $cleanValue = trim($value, " \t\n\r\0\x0B\"'");

            $_ENV[$key] = $cleanValue;
            $_SERVER[$key] = $cleanValue;
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        return $_ENV[$key] ?? $_SERVER[$key] ?? $default;
    }
}
