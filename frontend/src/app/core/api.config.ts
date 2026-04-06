import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => resolveApiBaseUrl(),
});

function resolveApiBaseUrl(): string {
  const configuredUrl = String(environment.apiUrl ?? '').trim();

  if (configuredUrl !== '') {
    return configuredUrl;
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api';
  }

  const { hostname } = window.location;

  return `http://${hostname}:8000/api`;
}
