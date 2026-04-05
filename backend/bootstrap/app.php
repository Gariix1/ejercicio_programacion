<?php

use App\Core\Support\ApiErrorResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $exception, Request $request) {
            if (!$request->is('api/*')) {
                return null;
            }

            return response()->json(
                ApiErrorResponse::validation($exception),
                $exception->status
            );
        });

        $exceptions->render(function (ModelNotFoundException $exception, Request $request) {
            if (!$request->is('api/*')) {
                return null;
            }

            return response()->json(
                ApiErrorResponse::modelNotFound($exception),
                404
            );
        });

        $exceptions->render(function (NotFoundHttpException $exception, Request $request) {
            if (!$request->is('api/*')) {
                return null;
            }

            return response()->json(
                ApiErrorResponse::notFound($exception),
                404
            );
        });
    })->create();
