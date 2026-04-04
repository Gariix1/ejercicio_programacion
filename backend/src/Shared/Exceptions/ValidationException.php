<?php

declare(strict_types=1);

namespace App\Shared\Exceptions;

final class ValidationException extends HttpException
{
    public function __construct(
        string $message,
        private readonly array $errors = []
    ) {
        parent::__construct($message, 422);
    }

    public function errors(): array
    {
        return $this->errors;
    }
}
