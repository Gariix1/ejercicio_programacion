<?php

$allowedOrigins = array_values(array_filter(array_map(
    static fn (string $origin): string => trim($origin),
    explode(',', (string) env('CORS_ALLOWED_ORIGINS', 'http://localhost:4200,http://127.0.0.1:4200'))
)));

$allowedOriginPatterns = array_values(array_filter(array_map(
    static fn (string $pattern): string => trim($pattern),
    explode(',', (string) env(
        'CORS_ALLOWED_ORIGIN_PATTERNS',
        '/^https?:\/\/192\.168\.\d+\.\d+(?::\d+)?$/,/^https?:\/\/10\.\d+\.\d+\.\d+(?::\d+)?$/,/^https?:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+(?::\d+)?$/'
    ))
)));

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $allowedOrigins,
    'allowed_origins_patterns' => $allowedOriginPatterns,
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
