<?php

declare(strict_types=1);

use App\Core\Http\Request;
use App\Core\Http\Response;
use App\Core\Routing\Router;
use App\Core\Support\Env;
use App\Shared\Exceptions\HttpException;
use App\Shared\Exceptions\ValidationException;

$basePath = dirname(__DIR__);
$autoload = $basePath . '/vendor/autoload.php';

if (file_exists($autoload)) {
    require $autoload;
} else {
    spl_autoload_register(static function (string $class) use ($basePath): void {
        $prefix = 'App\\';
        $srcPath = $basePath . '/src/';

        if (!str_starts_with($class, $prefix)) {
            return;
        }

        $relativeClass = substr($class, strlen($prefix));
        $file = $srcPath . str_replace('\\', '/', $relativeClass) . '.php';

        if (file_exists($file)) {
            require $file;
        }
    });
}

Env::load($basePath . '/.env');

$allowedOrigins = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$router = new Router();
$request = Request::capture();

try {
    require $basePath . '/routes/api.php';
    $router->dispatch($request);
} catch (ValidationException $exception) {
    Response::json([
        'message' => $exception->getMessage(),
        'errors' => $exception->errors(),
    ], 422);
} catch (HttpException $exception) {
    Response::json([
        'message' => $exception->getMessage(),
    ], $exception->getStatusCode());
} catch (Throwable $exception) {
    $payload = ['message' => 'Internal Server Error'];

    if (Env::get('APP_DEBUG', 'false') === 'true') {
        $payload['error'] = $exception->getMessage();
    }

    Response::json($payload, 500);
}
