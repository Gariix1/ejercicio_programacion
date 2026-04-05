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
            $errors[$attribute] = [];

            foreach (array_values($attributeMessages) as $index => $message) {
                $rule = $attributeRules[$index] ?? null;

                $errors[$attribute][] = [
                    'code' => self::validationCode($attribute, $rule),
                    'message' => $message,
                ];
            }
        }

        return [
            'message' => 'La solicitud contiene errores de validacion.',
            'code' => ApiErrorCode::VALIDATION_ERROR,
            'errors' => $errors,
        ];
    }

    public static function modelNotFound(ModelNotFoundException $exception): array
    {
        $model = class_basename($exception->getModel());

        return [
            'message' => 'No se encontro el recurso solicitado.',
            'code' => ApiErrorCode::RESOURCE_NOT_FOUND,
            'errors' => [
                'resource' => [[
                    'code' => ApiErrorCode::modelNotFound($model),
                    'message' => 'El recurso solicitado no existe.',
                ]],
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
            'message' => 'No se encontro el recurso solicitado.',
            'code' => ApiErrorCode::RESOURCE_NOT_FOUND,
            'errors' => [
                'resource' => [[
                    'code' => ApiErrorCode::RESOURCE_NOT_FOUND,
                    'message' => 'El recurso solicitado no existe.',
                ]],
            ],
        ];
    }

    private static function validationCode(string $attribute, ?string $rule): string
    {
        return ApiErrorCode::validation($attribute, $rule);
    }
}
