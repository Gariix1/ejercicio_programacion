<?php

declare(strict_types=1);

namespace App\Core\Http;

final class Request
{
    public function __construct(
        private readonly string $method,
        private readonly string $path,
        private readonly array $query = [],
        private readonly array $body = [],
        private readonly array $headers = [],
        private readonly array $routeParams = []
    ) {
    }

    public static function capture(): self
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $rawBody = file_get_contents('php://input') ?: '';
        $contentType = $headers['Content-Type'] ?? $headers['content-type'] ?? '';
        $decoded = [];

        if ($rawBody !== '' && str_contains($contentType, 'application/json')) {
            $decoded = json_decode($rawBody, true) ?: [];
        } elseif (!empty($_POST)) {
            $decoded = $_POST;
        }

        return new self($method, $path, $_GET, $decoded, $headers);
    }

    public function method(): string
    {
        return $this->method;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function query(string $key, mixed $default = null): mixed
    {
        return $this->query[$key] ?? $default;
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $default;
    }

    public function all(): array
    {
        return $this->body;
    }

    public function route(string $key, mixed $default = null): mixed
    {
        return $this->routeParams[$key] ?? $default;
    }

    public function withRouteParams(array $routeParams): self
    {
        return new self(
            $this->method,
            $this->path,
            $this->query,
            $this->body,
            $this->headers,
            $routeParams
        );
    }
}
