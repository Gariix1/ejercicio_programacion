export function normalizeEmployeePhotoPath(value: unknown): string | null {
  const normalized = String(value ?? '').trim();
  return normalized !== '' ? normalized : null;
}

export function isManagedEmployeePhotoPath(path: string | null): boolean {
  return typeof path === 'string'
    && /^empleados\/.+\.(jpg|jpeg|png|webp)$/i.test(path);
}

export function resolveDraftEmployeePhotoPath(
  currentValue: unknown,
  initialValue: string | null,
): string | null {
  const currentPhotoPath = normalizeEmployeePhotoPath(currentValue);

  if (!isManagedEmployeePhotoPath(currentPhotoPath)) {
    return null;
  }

  return currentPhotoPath !== initialValue ? currentPhotoPath : null;
}
