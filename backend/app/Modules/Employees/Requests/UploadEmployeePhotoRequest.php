<?php

declare(strict_types=1);

namespace App\Modules\Employees\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UploadEmployeePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fotografia' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:6144'],
        ];
    }

    public function messages(): array
    {
        return [
            'fotografia.required' => 'La fotografia es obligatoria.',
            'fotografia.file' => 'La fotografia debe ser un archivo valido.',
            'fotografia.image' => 'La fotografia debe ser una imagen valida.',
            'fotografia.mimes' => 'La fotografia debe estar en formato JPG, PNG o WEBP.',
            'fotografia.max' => 'La fotografia no puede superar los 6 MB.',
        ];
    }

    public function attributes(): array
    {
        return [
            'fotografia' => 'fotografia',
        ];
    }
}
