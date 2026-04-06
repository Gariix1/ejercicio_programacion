<?php

declare(strict_types=1);

namespace App\Modules\Employees\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

final class EmployeePhotoService
{
    private const MANAGED_DIRECTORY = 'empleados';
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

    public function upload(UploadedFile $file): array
    {
        $path = $file->store(self::MANAGED_DIRECTORY, 'public');

        return [
            'path' => $path,
            'url' => $this->resolveUrl($path),
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ];
    }

    public function show(string $path): BinaryFileResponse
    {
        abort_unless($this->isManagedPath($path), 404);
        abort_unless(Storage::disk('public')->exists($path), 404);

        return response()->file(Storage::disk('public')->path($path), [
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    public function resolveUrl(?string $path): ?string
    {
        $normalized = trim((string) $path);

        if ($normalized === '') {
            return null;
        }

        if ($this->isExternalResource($normalized)) {
            return $normalized;
        }

        if (!$this->isManagedPath($normalized)) {
            return null;
        }

        $segments = array_map('rawurlencode', explode('/', $normalized));
        $baseUrl = $this->resolveBaseUrl();

        return $baseUrl . '/api/employee-photos/' . implode('/', $segments);
    }

    public function deleteIfManaged(?string $path): void
    {
        $normalized = trim((string) $path);

        if ($normalized === '' || !$this->isManagedPath($normalized)) {
            return;
        }

        Storage::disk('public')->delete($normalized);
    }

    public function replaceManagedPhoto(?string $currentPath, ?string $nextPath): void
    {
        $current = trim((string) $currentPath);
        $next = trim((string) $nextPath);

        if ($current === '' || $current === $next) {
            return;
        }

        $this->deleteIfManaged($current);
    }

    public function isManagedPath(?string $path): bool
    {
        $normalized = trim((string) $path);

        if ($normalized === '' || str_contains($normalized, '..') || str_starts_with($normalized, '/')) {
            return false;
        }

        if (!str_starts_with($normalized, self::MANAGED_DIRECTORY . '/')) {
            return false;
        }

        $extension = strtolower(pathinfo($normalized, PATHINFO_EXTENSION));

        return in_array($extension, self::ALLOWED_EXTENSIONS, true);
    }

    private function isExternalResource(string $value): bool
    {
        return preg_match('/^(https?:|data:|blob:)/i', $value) === 1;
    }

    private function resolveBaseUrl(): string
    {
        $request = request();

        if ($request !== null) {
            return $request->getSchemeAndHttpHost();
        }

        return rtrim((string) config('app.url'), '/');
    }
}
