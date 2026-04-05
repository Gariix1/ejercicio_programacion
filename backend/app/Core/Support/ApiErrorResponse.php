<?php

declare(strict_types=1);

namespace App\Core\Support;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Validation\ValidationException;

final class ApiErrorResponse
{
    public static function validation(ValidationException $exception): array
    {
        $validator = $exception->validator;
        $failedRules = $validator->failed();
        $messages = $validator->errors()->toArray();
        $errors = [];

        foreach ($messages as $attribute => $attributeMessages) {
            $attributeRules = array_keys($failedRules[$attribute] ?? []);

            foreach (array_values($attributeMessages) as $index => $message) {
                $rule = $attributeRules[$index] ?? null;

                $errors[] = [
                    'status' => $exception->status,
                    'code' => self::validationCode($attribute, $rule),
                    'title' => 'Error de validacion',
                    'detail' => $message,
                    'source' => [
                        'field' => $attribute,
                    ],
                ];
            }
        }

        return [
            'errors' => $errors,
            'meta' => [
                'request_status' => 'failed',
                'error_type' => ApiErrorCode::VALIDATION_ERROR,
                'error_count' => count($errors),
            ],
        ];
    }

    public static function modelNotFound(ModelNotFoundException $exception): array
    {
        $model = class_basename($exception->getModel());

        return [
            'errors' => [[
                    'status' => 404,
                    'code' => ApiErrorCode::modelNotFound($model),
                    'title' => 'Recurso no encontrado',
                    'detail' => 'El recurso solicitado no existe.',
                    'source' => [
                        'resource' => strtolower($model),
                    ],
                ]],
            'meta' => [
                'request_status' => 'failed',
                'error_type' => ApiErrorCode::RESOURCE_NOT_FOUND,
                'error_count' => 1,
            ],
        ];
    }

    public static function notFound(NotFoundHttpException $exception): array
    {
        $previous = $exception->getPrevious();

        if ($previous instanceof ModelNotFoundException) {
            return self::modelNotFound($previous);
        }

        return [
            'errors' => [[
                    'status' => 404,
                    'code' => ApiErrorCode::RESOURCE_NOT_FOUND,
                    'title' => 'Recurso no encontrado',
                    'detail' => 'El recurso solicitado no existe.',
                    'source' => [
                        'resource' => 'route',
                    ],
                ]],
            'meta' => [
                'request_status' => 'failed',
                'error_type' => ApiErrorCode::RESOURCE_NOT_FOUND,
                'error_count' => 1,
            ],
        ];
    }

    private static function validationCode(string $attribute, ?string $rule): string
    {
        return ApiErrorCode::validation($attribute, $rule);
    }
}
