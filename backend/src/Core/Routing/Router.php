<?php

declare(strict_types=1);

namespace App\Core\Routing;

use App\Core\Http\Request;
use App\Shared\Exceptions\HttpException;

final class Router
{
    /**
     * @var array<string, array<int, array{path: string, handler: callable}>>
     */
    private array $routes = [];

    public function get(string $path, callable $handler): void
    {
        $this->add('GET', $path, $handler);
    }

    public function post(string $path, callable $handler): void
    {
        $this->add('POST', $path, $handler);
    }

    public function add(string $method, string $path, callable $handler): void
    {
        $this->routes[strtoupper($method)][] = [
            'path' => $this->normalize($path),
            'handler' => $handler,
        ];
    }

    public function dispatch(Request $request): mixed
    {
        $method = $request->method();
        $path = $this->normalize($request->path());

        foreach ($this->routes[$method] ?? [] as $route) {
            $params = $this->match($route['path'], $path);

            if ($params === null) {
                continue;
            }

            return ($route['handler'])($request->withRouteParams($params));
        }

        throw new HttpException('Route not found', 404);
    }

    private function normalize(string $path): string
    {
        $trimmed = '/' . trim($path, '/');

        return $trimmed === '/' ? '/' : rtrim($trimmed, '/');
    }

    private function match(string $routePath, string $requestPath): ?array
    {
        $pattern = preg_replace('#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#', '(?P<$1>[^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';

        if (!preg_match($pattern, $requestPath, $matches)) {
            return null;
        }

        return array_filter($matches, static fn ($key): bool => !is_int($key), ARRAY_FILTER_USE_KEY);
    }
}
