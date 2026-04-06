<?php

declare(strict_types=1);

namespace App\Modules\Employees\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class DeleteEmployeePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'path' => ['required', 'string', 'max:255', 'regex:/^empleados\/.+\.(jpg|jpeg|png|webp)$/i'],
        ];
    }

    public function messages(): array
    {
        return [
            'path.required' => 'La ruta de la fotografia es obligatoria.',
            'path.string' => 'La ruta de la fotografia debe ser una cadena valida.',
            'path.max' => 'La ruta de la fotografia no puede superar los 255 caracteres.',
            'path.regex' => 'La ruta de la fotografia debe pertenecer al directorio gestionado de empleados.',
        ];
    }

    public function attributes(): array
    {
        return [
            'path' => 'ruta de la fotografia',
        ];
    }
}
